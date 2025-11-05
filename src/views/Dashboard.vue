<template>
  <el-row :gutter="16">
    <el-col :span="8">
      <el-card>
        <template #header>系统概览</template>
        <div>欢迎使用 Vue3 + Vite + Element Plus 后台模板。</div>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card>
        <template #header>快速开始</template>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="路由">Vue Router 4，带登录守卫</el-descriptions-item>
          <el-descriptions-item label="状态">Pinia 管理用户与 UI</el-descriptions-item>
          <el-descriptions-item label="请求">Axios 实例，自动附带 Token</el-descriptions-item>
          <el-descriptions-item label="UI">Element Plus 全量引入</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Dashboard'
})
</script>
