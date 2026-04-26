---
slug: mybatis-plus-dynamic-query
title: MyBatis-Plus 动态查询：从 Wrapper 到生产级实践
excerpt: 深入 MyBatis-Plus QueryWrapper/LambdaQueryWrapper 的动态查询技巧，以及如何在复杂业务场景下保持查询代码可维护。
description: 深入 MyBatis-Plus QueryWrapper/LambdaQueryWrapper 的动态查询技巧，以及如何在复杂业务场景下保持查询代码可维护。
category: Java
tags:
  - MyBatis-Plus
  - Java
  - 动态查询
date: 2026-04-22
readingTime: 10
pinned: true
---

## 问题背景

做过管理后台的同学都遇到过这种需求：一个列表页，支持按名称模糊搜索、按状态筛选、按时间范围排序，所有条件都是可选的。用原生 MyBatis 写，要么拼 SQL 字符串（危险），要么在 XML 里写一堆 `<if>` 标签（臃肿）。

MyBatis-Plus 的 Wrapper 机制本意是解决这个问题，但很多团队用着用着就写出了一堆"意大利面条式"的查询代码——一个 Service 方法里堆了 50 行 `wrapper.eq(...).like(...)` 链式调用，改一个条件要读完整个方法。

这篇文章讲的是如何把 MyBatis-Plus 的动态查询用好，以及在复杂场景下怎么保持代码整洁。

## LambdaQueryWrapper vs QueryWrapper

先说结论：**永远用 `LambdaQueryWrapper`，不要用 `QueryWrapper`**。

```java
// ❌ QueryWrapper：字段名用字符串，重构时容易遗漏
QueryWrapper<User> wrapper = new QueryWrapper<>();
wrapper.eq("user_name", name);

// ✅ LambdaQueryWrapper：编译期检查，IDE 可追踪
LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
wrapper.eq(User::getUserName, name);
```

`QueryWrapper` 的字段名是字符串，一旦你 rename 了实体字段但忘了改查询代码，运行时才会报错。`LambdaQueryWrapper` 通过方法引用绑定了编译期检查，重构安全。

## 动态条件的正确写法

核心原则：**条件为 null 或空时，不要拼接到 SQL 里**。MyBatis-Plus 的 Wrapper 天然支持这一点，但很多人不知道。

```java
public IPage<User> searchUsers(UserQueryDTO query) {
    LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();

    // null 值不会拼接到 SQL，等效于 <if test="name != null">
    wrapper.like(StringUtils.isNotBlank(query.getName()),
                 User::getUserName, query.getName())
           .eq(query.getStatus() != null,
                 User::getStatus, query.getStatus())
           .between(query.getStartDate() != null && query.getEndDate() != null,
                    User::getCreateTime,
                    query.getStartDate(), query.getEndDate())
           .orderByDesc(User::getCreateTime);

    return userMapper.selectPage(
        new Page<>(query.getPageNum(), query.getPageSize()),
        wrapper
    );
}
```

`wrapper.like(condition, column, value)` 的第一个参数是 boolean，为 false 时这个条件直接跳过。这比你自己写 `if` 判断再往 wrapper 里追加要干净得多。

## 复杂场景：条件构建器模式

当查询条件超过 5 个，或者需要根据用户角色动态调整查询范围时，链式调用会变得不可读。这时候用**条件构建器**把逻辑拆开：

```java
@Component
public class UserQuerySpec {

    public LambdaQueryWrapper<User> build(UserQueryDTO query, UserRole role) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();

        applyKeywordFilter(wrapper, query.getKeyword());
        applyStatusFilter(wrapper, query.getStatus());
        applyRoleScope(wrapper, role);

        return wrapper;
    }

    private void applyKeywordFilter(LambdaQueryWrapper<User> w, String keyword) {
        if (StringUtils.isBlank(keyword)) return;
        w.and(inner -> inner
            .like(User::getUserName, keyword)
            .or()
            .like(User::getEmail, keyword)
        );
    }

    private void applyStatusFilter(LambdaQueryWrapper<User> w, Integer status) {
        w.eq(status != null, User::getStatus, status);
    }

    private void applyRoleScope(LambdaQueryWrapper<User> w, UserRole role) {
        if (role == UserRole.VIEWER) {
            w.eq(User::getVisible, true);
        }
    }
}
```

每个 `apply*` 方法只负责一个条件维度，测试时可以单独验证每个方法的行为。

## 踩坑记录

**坑 1：`or()` 的优先级问题**

```java
// ❌ 实际语义：WHERE name = 'A' OR status = 1 AND dept = 'IT'
wrapper.eq(User::getName, "A")
       .or()
       .eq(User::getStatus, 1)
       .eq(User::getDept, "IT");

// ✅ 用嵌套 and() 控制优先级
wrapper.and(w -> w.eq(User::getName, "A"))
       .or()
       .and(w -> w.eq(User::getStatus, 1)
                   .eq(User::getDept, "IT"));
```

`or()` 在链式调用中会打断前面的 AND 链。如果你不确定优先级，用 `and(lambda)` 显式分组。

**坑 2：`between` 的边界值处理**

`between` 在 SQL 中是 `>= AND <=`，即闭区间。如果业务需要左闭右开 `[start, end)`，需要手动写 `ge` + `lt`：

```java
wrapper.ge(User::getCreateTime, startDate)
       .lt(User::getCreateTime, endDate);
```

**坑 3：Lambda 序列化警告**

`LambdaQueryWrapper` 内部用了 `SerializedLambda`，如果实体类没有实现 `Serializable`，在某些序列化场景（比如分布式缓存）下会报错。养成习惯给实体加上 `implements Serializable`。

## 总结

- 用 `LambdaQueryWrapper` 替代 `QueryWrapper`，编译期安全
- 善用 `condition` 参数做动态条件，避免外层 if 判断
- 超过 5 个条件时，拆分为独立的 `apply*` 方法
- `or()` 要配合 `and(lambda)` 控制优先级
- `between` 是闭区间，左闭右开要手动拼

动态查询看似简单，但在生产环境中是 bug 高发区。好的抽象不是减少代码量，而是让每一块代码的意图清晰可见。
