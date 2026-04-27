---
slug: Cloudflare-Pages-deploy
title: Cloudflare Pages 部署我的 Nuxt 个人博客全过程记录
excerpt: Cloudflare Pages 部署个人博客。
description: Cloudflare Pages 部署个人博客。
category: Cloudflare
tags:
  - Cloudflare
  - Cloudflare Pages
  - 部署
  - deploy
  - Nuxt
  - Nuxt Content
date: 2026-04-26
readingTime: 10
pinned: ture
---

## 背景

最近正在搭建自己的个人blog，打算记录一下。能看到这文章当然也是搭建起来了  
该blog整体技术栈：
```
Nuxt 3
@nuxt/content
Cloudflare Pages
Cloudflare DNS
GitHub
DeepSeek API
```
整体搭建流程：
```
本地 Nuxt 项目
    ↓
推送到 GitHub
    ↓
Cloudflare Pages 自动构建部署
    ↓
绑定自定义域名 my-domain.me
    ↓
开启 HTTPS
    ↓
后续 push 代码或文章自动更新网站
```

## 创建 Cloudflare Pages 项目
进入 Cloudflare Dashboard 后，路径大概是：
```
Workers 和 Pages
→ 创建
→ Pages
→ 连接 GitHub
```
先找到Workers 和 Pages，一般在首页构建->计算目录下  
![Workers 和 Pages](/images/blog/Cloudflare-Pages-deploy/workersandpages.png)  
创建，选择从现有git仓库导入  
！[create](/images/blog/Cloudflare-Pages-deploy/create.png)  
授权和安装Cloudflare Pages到GitHub  
![installTOgithub](/images/blog/Cloudflare-Pages-deploy/installTOgithub.png)  

## 部署与构建配置
重新打开`Workers 和 Pages`页面，开始部署  
选择需要部署的仓库，如我这里的blog仓库`MITCH`  
![deploypage](/images/blog/Cloudflare-Pages-deploy/deploypage.png)    

接着点击开始部署  
会需要让你填框架，构建命令，构建输出目录等  
根据项目对应填写即可  
| 配置项                    | 值               |
| ---------------------- | --------------- |
| Framework preset       | Nuxt.js         |
| Build command          | `npm run build` |
| Build output directory | `.output`       |
| Production branch      | `main`          |

填写完上面的基本信息后，可以根据项目情况区填写环境变量，相当于.env配置 
例如我这要使用node.js的版本，还有我自己的域名，以及我的一个api,用于首页about me部分接入AI功能  
 | 变量名                                          | 作用                                  |
| -------------------------------------------- | ----------------------------------- |
| `NODE_VERSION=20`                            | 指定 Cloudflare 构建时使用 Node.js 20      |
| `NUXT_PUBLIC_SITE_URL=https://xiaomaizhi.me` | 指定正式站点域名，用于 sitemap、rss、canonical 等 |
| `DEEPSEEK_API_KEY=xxx`                       | AI 助手功能使用的 API Key                  |

![building](/images/blog/Cloudflare-Pages-deploy/building.png)  

填写完之后就可以开始部署了  

## 首次部署成功
Cloudflare Pages 构建成功后，生成了一个默认访问地址：

https://mitch-ddd.pages.dev  

这说明项目已经成功部署到了 Cloudflare Pages。

这个地址可以作为临时预览地址，后面再绑定自己的正式域名。如果你没有注册有域名，该二级域名是可以正常访问的，就已经可以分享给你的朋友去访问了。  
![linshidomain](/images/blog/Cloudflare-Pages-deploy/linshidomain.png)  

## 绑定自定义域名

没有的可以直接在Cloudflare注册一个,相比aliyun,我还是更喜欢Cloudflare的，后续续约的价格一直都会是一样的
![registerdomain](/images/blog/Cloudflare-Pages-deploy/registerdomain.png)  

有了自己域名后
可以重新到`Workers 和 Pages`页面，进到你刚部署好的项目里，选择自定义域  
![domainset](/images/blog/Cloudflare-Pages-deploy/domainset.png)  

将你自己的域名填进去即可  
![mydomain](/images/blog/Cloudflare-Pages-deploy/mydomain.png)  

我分别绑定了：
[](xiaomaizhi.me)  
[](www.xiaomaizhi.me)  

Cloudflare 自动帮我创建了 DNS 记录。

最终 DNS 大致是：  
| 类型    | 名称              | 内容                    | 代理状态 |
| ----- | --------------- | --------------------- | ---- |
| CNAME | `xiaomaizhi.me` | `mitch-ddd.pages.dev` | 已代理  |
| CNAME | `www`           | `mitch-ddd.pages.dev` | 已代理  |


也就是说：  
https://xiaomaizhi.me  
https://www.xiaomaizhi.me    
都会指向我的 Cloudflare Pages 项目  

## Cloudflare D1 数据库

### 创建Cloudflare D1 数据库
因为我的博客文章使用 @nuxt/content 管理，也就是通过 content/ 目录里的 Markdown 文件生成博客内容  
在 Cloudflare Pages 环境下，Nuxt Content 需要绑定 Cloudflare D1 数据库，否则运行时查询文章内容可能会出现 500 服务端问题  

所以需要创建一个 D1 数据库  
![datebase](/images/blog/Cloudflare-Pages-deploy/dattebase.png)  

填一个数据库名就好了，别的保持默认就行  
![mitch-content](/images/blog/Cloudflare-Pages-deploy/mitch-content.png)  

### 绑定数据库
![mybase](/images/blog/Cloudflare-Pages-deploy/mybase.png)  
![](/images/blog/Cloudflare-Pages-deploy/namebase.png)  

## 部署后的整体架构
```
GitHub 仓库
    ↓ push main 自动触发
Cloudflare Pages
    ↓
Nuxt 3 前端应用
    ↓
@nuxt/content 读取 Markdown 内容
    ↓
Cloudflare D1 存储内容索引
    ↓
Cloudflare DNS 绑定 xiaomaizhi.me
    ↓
用户通过 HTTPS 访问博客
```
