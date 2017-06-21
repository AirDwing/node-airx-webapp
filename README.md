# node-airx-webapp

一个基于AirX OpenAPI &amp; SDK的演示应用

## 说明

该项目只采用了前后端分离的设计理念.

后端接口采用`@airx/sdk`来完成`AirX Open API`的反向代理.

### 目录结构

- server/ 服务器后端源码目录
- app/ 前端应用源码目录
- dist/ 前端应用通过`webpack`等工具进行打包压缩, 将静态文件存放的目录

建议的 `dist` 目录结构

- index.html
- 404.html 和 403,500... 等其他相关错误的html
- static/ 文件目录,或分类目录存放 css/js/图片等静态资源

