---
slug: docker-compose-deploy
title: Docker Compose 部署个人项目：一台 VPS 搞定全栈
excerpt: 用 Docker Compose 在一台 VPS 上部署前端、后端、数据库和反向代理，包括 SSL、日志管理和自动更新。
description: 用 Docker Compose 在一台 VPS 上部署前端、后端、数据库和反向代理，包括 SSL、日志管理和自动更新。
category: 工程效率
tags:
  - Docker
  - 部署
  - DevOps
date: 2026-04-13
readingTime: 10
pinned: false
---

## 问题背景

个人项目不想花太多钱在基础设施上，一台 2C4G 的 VPS 就够了。但"够用"的前提是你得把部署搞对——很多人一台 VPS 上装了 Nginx、Node、Java、MySQL，互相抢端口，升级一个服务就把另一个搞挂。

Docker Compose 解决的就是这个问题：每个服务跑在独立容器里，互相隔离，一键启停。

## 整体架构

一台 VPS 上跑这些服务：

- **Nginx**：反向代理 + SSL 终止 + 静态资源
- **前端**：Nuxt 3 SSR 应用（Node 容器）
- **后端**：Spring Boot API（Java 容器）
- **数据库**：MySQL 8.0
- **Redis**：缓存和会话存储

```yaml
# docker-compose.yml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - ./frontend/.output/public:/usr/share/nginx/html/public
    depends_on:
      - frontend
      - backend

  frontend:
    build: ./frontend
    environment:
      - PORT=3000
      - DATABASE_URL=mysql://db:3306/app
    restart: unless-stopped

  backend:
    build: ./backend
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_HOST=db
      - REDIS_HOST=redis
    restart: unless-stopped

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: app
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

volumes:
  mysql_data:
```

关键设计：

- `restart: unless-stopped`：容器崩溃自动重启，除非你手动停掉
- `volumes`：MySQL 数据持久化到 Docker volume，容器删了数据还在
- `depends_on`：保证启动顺序，但不保证服务就绪（后面会讲）
- 敏感信息用 `.env` 文件，不写死在 `docker-compose.yml` 里

## Nginx 配置

Nginx 是整个系统的入口，负责路由分发和 SSL：

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    # 前端 SSR
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 后端 API
    location /api/ {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

SSL 证书用 Let's Encrypt，通过 `certbot` 手动生成后挂载到容器里。或者用 `nginx-proxy` + `acme-companion` 自动管理证书，但对个人项目来说手动管理更可控。

## 前端 Dockerfile

Nuxt 3 的 SSR 应用需要 Node 运行时：

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

多阶段构建：第一阶段编译，第二阶段只拷贝编译产物。最终镜像只有运行时依赖，体积从 1GB+ 缩小到 150MB 左右。

## 服务就绪问题

`depends_on` 只保证容器启动顺序，不保证服务就绪。MySQL 容器启动了，但 MySQL 服务可能还没初始化完，这时候后端连接数据库就会失败。

解决方案有两个：

**方案 1：健康检查 + 条件依赖**

```yaml
services:
  db:
    image: mysql:8.0
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    depends_on:
      db:
        condition: service_healthy
```

**方案 2：应用层重试**

在 Spring Boot 配置数据库连接重试：

```yaml
spring:
  datasource:
    hikari:
      connection-timeout: 30000
      initialization-fail-timeout: -1  # 启动时不因连接失败而退出
```

推荐方案 1，更优雅。

## 日志管理

Docker 日志默认写到 JSON 文件，时间长了会撑爆磁盘。限制日志大小：

```yaml
services:
  backend:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

每个服务最多保留 3 个 10MB 的日志文件，旧的自动轮转。

查看日志用 `docker compose logs -f backend`，按服务过滤。

## 踩坑记录

**坑 1：MySQL 容器重启后数据丢失**

如果你用 `docker compose down` 而不是 `docker compose stop`，没有挂载 volume 的容器数据会丢失。确保 MySQL 的数据目录挂载到 named volume 或宿主机目录。

**坑 2：容器时区问题**

Java 应用在容器里默认用 UTC 时区，和宿主机不一致。在 Dockerfile 或 docker-compose 里设置：

```yaml
environment:
  - TZ=Asia/Shanghai
volumes:
  - /etc/localtime:/etc/localtime:ro
```

**坑 3：Nginx 的 `proxy_pass` 尾部斜杠**

`proxy_pass http://backend:8080` 和 `proxy_pass http://backend:8080/` 行为不同。不带斜杠时，`/api/users` 会转发到 `http://backend:8080/api/users`；带斜杠时会转发到 `http://backend:8080/users`。根据后端的路由设计选择。

## 总结

- Docker Compose 是个人项目部署的最佳实践，隔离清晰、一键管理
- `depends_on` + `healthcheck` 保证服务启动顺序和就绪
- 多阶段构建大幅缩小镜像体积
- 日志限制防止磁盘撑爆
- 敏感信息用 `.env` 文件，不提交到 Git

一台 VPS + Docker Compose，足以支撑一个中小型个人项目的全栈部署。等到真正需要扩容的那天，再考虑 Kubernetes 也不迟。
