---
slug: spring-boot-multi-module
title: Spring Boot 多模块项目结构实践
excerpt: 如何在 Spring Boot 中组织多模块结构，兼顾可维护性与编译效率...
description: 如何在 Spring Boot 中组织多模块结构，兼顾可维护性与编译效率。
category: Java
tags:
  - Spring Boot
  - Maven
  - 架构
date: 2026-04-18
readingTime: 8
pinned: true
---

## 为什么需要多模块

随着项目规模增长，单模块结构会导致...

## 推荐结构

一个清晰的多模块结构应当包括...

### api 模块

定义接口和 DTO...

```xml
<modules>
  <module>api</module>
  <module>service</module>
</modules>
```
