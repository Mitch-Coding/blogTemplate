---
slug: spring-boot-unified-error-handling
title: Spring Boot 统一异常处理与参数校验：从 @ExceptionHandler 到全局拦截
excerpt: 如何用 @RestControllerAdvice 构建生产级的统一异常处理体系，覆盖参数校验、业务异常、未知异常三层。
description: 如何用 @RestControllerAdvice 构建生产级的统一异常处理体系，覆盖参数校验、业务异常、未知异常三层。
category: Java
tags:
  - Spring Boot
  - 异常处理
  - 参数校验
date: 2026-04-20
readingTime: 9
pinned: true
---

## 问题背景

每个后端项目都需要异常处理，但很多团队的做法是：Controller 里 try-catch，Service 里 try-catch，到处 try-catch。结果就是——异常被吞掉了，日志里看不到错误，前端只拿到一个 500。

更好的做法是**全局拦截**：定义统一的错误响应格式，让异常处理逻辑集中在一处，Controller 只管写业务代码，不用关心异常怎么返回。

## 统一响应结构

先定义一个通用的响应体，所有接口都返回这个格式：

```java
public class ApiResult<T> {
    private int code;
    private String message;
    private T data;

    public static <T> ApiResult<T> ok(T data) {
        return new ApiResult<>(200, "success", data);
    }

    public static <T> ApiResult<T> fail(int code, String message) {
        return new ApiResult<>(code, message, null);
    }
}
```

前端拿到响应后，先看 `code` 是否为 200，再处理 `data`。这是 REST API 的基本约定，不多解释。

## 业务异常枚举

不要用魔法数字定义错误码。定义一个异常枚举，把所有业务错误收拢在一起：

```java
public enum BizError {
    USER_NOT_FOUND(1001, "用户不存在"),
    ORDER_ALREADY_PAID(2001, "订单已支付"),
    PARAM_INVALID(4001, "参数校验失败");

    private final int code;
    private final String message;

    BizError(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() { return code; }
    public String getMessage() { return message; }
}
```

然后定义一个业务异常类：

```java
public class BizException extends RuntimeException {
    private final int code;

    public BizException(BizError error) {
        super(error.getMessage());
        this.code = error.getCode();
    }

    public int getCode() { return code; }
}
```

在 Service 层直接 throw：

```java
public User getUser(Long id) {
    return userMapper.selectById(id)
        .orElseThrow(() -> new BizException(BizError.USER_NOT_FOUND));
}
```

## 全局异常拦截器

核心是 `@RestControllerAdvice`，它能拦截所有 Controller 抛出的异常：

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // 业务异常：已知错误，返回对应错误码
    @ExceptionHandler(BizException.class)
    public ApiResult<?> handleBizException(BizException e) {
        log.warn("业务异常: code={}, msg={}", e.getCode(), e.getMessage());
        return ApiResult.fail(e.getCode(), e.getMessage());
    }

    // 参数校验异常：@Valid 触发时
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiResult<?> handleValidation(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().stream()
            .map(f -> f.getField() + ": " + f.getDefaultMessage())
            .collect(Collectors.joining("; "));
        log.warn("参数校验失败: {}", msg);
        return ApiResult.fail(4001, msg);
    }

    // 未知异常：兜底，返回 500
    @ExceptionHandler(Exception.class)
    public ApiResult<?> handleUnknown(Exception e) {
        log.error("未知异常", e);
        return ApiResult.fail(5000, "系统繁忙，请稍后重试");
    }
}
```

三层拦截，覆盖所有场景：

1. **`BizException`** — 业务逻辑中的预期错误（用户不存在、余额不足等），返回具体错误码
2. **`MethodArgumentNotValidException`** — `@Valid` 参数校验失败，拼接所有字段错误
3. **`Exception`** — 兜底，记录完整堆栈，返回通用错误信息（不要把内部细节暴露给前端）

## 参数校验实战

配合 `@Valid` 和 JSR-303 注解，在 DTO 层做校验：

```java
public class CreateUserDTO {

    @NotBlank(message = "用户名不能为空")
    @Size(min = 2, max = 20, message = "用户名长度 2-20")
    private String username;

    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    private String email;

    @NotNull(message = "年龄不能为空")
    @Min(value = 0, message = "年龄不能为负")
    @Max(value = 150, message = "年龄不合法")
    private Integer age;
}
```

Controller 里加 `@Valid` 即可：

```java
@PostMapping("/users")
public ApiResult<User> create(@Valid @RequestBody CreateUserDTO dto) {
    return ApiResult.ok(userService.create(dto));
}
```

如果校验失败，Spring 自动抛出 `MethodArgumentNotValidException`，被全局拦截器捕获。

## 踩坑记录

**坑 1：`@Valid` vs `@Validated`**

`@Valid` 是 JSR-303 标准注解，`@Validated` 是 Spring 的扩展。如果需要分组校验（比如创建和更新用不同的校验规则），用 `@Validated` 配合分组接口：

```java
public interface CreateGroup {}
public interface UpdateGroup {}

@NotBlank(groups = {CreateGroup.class}, message = "创建时用户名必填")
private String username;
```

Controller 里用 `@Validated(CreateGroup.class)` 指定分组。

**坑 2：异常拦截器的执行顺序**

如果你有多个 `@RestControllerAdvice`，用 `@Order` 控制优先级。数字越小优先级越高。一般全局兜底的设最大值，特定异常的设较小值。

**坑 3：异步方法的异常不经过 Controller**

`@Async` 方法抛出的异常不会被 `@ExceptionHandler` 捕获，因为它不在 Controller 的调用链里。需要单独配置 `AsyncUncaughtExceptionHandler`。

## 总结

- 定义统一的 `ApiResult<T>` 响应格式，所有接口返回同一结构
- 用 `BizException` + 枚举收拢业务错误码，避免魔法数字
- `@RestControllerAdvice` 三层拦截：业务异常 → 参数校验 → 兜底
- 参数校验用 `@Valid` + JSR-303 注解，错误信息自动拼接
- 生产环境不要把堆栈信息返回给前端，只给通用提示

异常处理不是"锦上添花"，而是"最后防线"。一个好的异常处理体系，能让 90% 的线上问题在日志里直接定位。
