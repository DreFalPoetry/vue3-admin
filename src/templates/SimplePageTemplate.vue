<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ pageTitle }}</span>
        </div>
      </template>

      <!-- 内容区域 -->
      <div class="content">
        <!-- 在这里添加你的页面内容 -->
        <el-empty description="暂无数据" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'SimplePageTemplate'
})

// 页面标题
const pageTitle = ref('页面标题')
</script>

<style lang="less" scoped>
.page-container {
  .card-header {
    font-weight: 600;
    font-size: 16px;
  }

  .content {
    min-height: 400px;
  }
}
</style>
