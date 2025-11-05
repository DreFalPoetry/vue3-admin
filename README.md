# Vue3 Admin Starter

基于 Vue 3 + TypeScript + Vite + Vue Router + Pinia + Axios + Element Plus 的后台管理模板。

## 开发

```bash
# 安装依赖
pnpm i # 或 npm i / yarn

# 本地开发
pnpm dev

# 类型检查 + 打包
pnpm build

# 本地预览
pnpm preview
```

## 技术栈
- Vue 3 + TypeScript
- Vite
- Vue Router 4（登录守卫）
- Pinia（用户与 UI 状态）
- Axios（请求拦截器自动附带 Token）
- Element Plus（UI 组件）

## 目录结构
```
src/
  api/           # Axios 实例
  layouts/       # 布局
  router/        # 路由
  stores/        # Pinia stores
  styles/        # 全局样式
  views/         # 页面
  App.vue
  main.ts
```

## 环境与配置
- 默认接口前缀：`/api`（见 `src/api/http.ts`），可在 Vite 代理中配置转发。
- 路由标题自动设置为 `页面标题 - Admin`。

## 自定义
- 在 `layouts/AdminLayout.vue` 中扩展侧边菜单与头部。
- 在 `router/index.ts` 中新增业务路由。
- 在 `stores/` 中扩展业务状态。

## 授权
MIT

