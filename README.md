# node-airx-webapp

一个基于AirX OpenAPI &amp; SDK的演示应用

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [说明](#%E8%AF%B4%E6%98%8E)
- [前端请求参数](#%E5%89%8D%E7%AB%AF%E8%AF%B7%E6%B1%82%E5%8F%82%E6%95%B0)
  - [签名相关参数](#%E7%AD%BE%E5%90%8D%E7%9B%B8%E5%85%B3%E5%8F%82%E6%95%B0)
  - [登录Auth Token](#%E7%99%BB%E5%BD%95auth-token)
  - [登录设备相关参数](#%E7%99%BB%E5%BD%95%E8%AE%BE%E5%A4%87%E7%9B%B8%E5%85%B3%E5%8F%82%E6%95%B0)
- [项目目录结构](#%E9%A1%B9%E7%9B%AE%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84)
- [运行](#%E8%BF%90%E8%A1%8C)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 说明

该项目只采用了前后端分离的设计理念.

后端接口采用`@airx/sdk`来完成`AirX Open API`的反向代理.


## 前端请求参数

### 签名相关参数

签名相关参数不用通过前端传递,防止AK/SK的泄露,签名交给`Node.js`后端反代应用程序处理,所以以下几个签名相关参数不用传递:

- Nonce
- SecretId
- Signature
- SignatureMethod
- Timestamp

### 登录Auth Token

由于反代应用程序支持 Cookie Session, 所以前端不用存储 Auth Token,也免去了 Auth Token被截获的风险.所以如果接口需要以下参数,不用传递:

- auth

### 登录设备相关参数

每个会话都会生成一个随机唯一的模拟登录设备id, 如果接口需要以下参数, 不用传递:

- guid
- device

## 项目目录结构

- server/ 服务器后端源码目录
- app/ 前端应用源码目录
- dist/ 前端应用通过`webpack`等工具进行打包压缩, 将静态文件存放的目录

建议的 `dist` 目录结构

- index.html
- 404.html 和 403,500... 等其他相关错误的html
- static/ 文件目录,或分类目录存放 css/js/图片等静态资源

## 运行

服务器参考配置位于 `server/config/_sample.js`, 本地开发需要新建一个 `_development.js`

调试运行后端应用:

```bash
DEBUG=@airx/sdk node server/index.js
```

默认端口为`3456`,可以自行修改.

## LICENSE

Apache 2.0
