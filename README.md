# node-airx-webapp

一个基于AirX OpenAPI &amp; SDK的演示应用

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

但需要注意的是, 你需要调用 `/guid` 接口来查询本次会话的 `guid` 并进行登录设备绑定.

返回结果如下:

```js
{
  status: 1,
  data: {
    guid: 'xxxx'
  }
}
```

## 项目目录结构

- server/ 服务器后端源码目录
- app/ 前端应用源码目录
- dist/ 前端应用通过`webpack`等工具进行打包压缩, 将静态文件存放的目录

建议的 `dist` 目录结构

- index.html
- 404.html 和 403,500... 等其他相关错误的html
- static/ 文件目录,或分类目录存放 css/js/图片等静态资源
