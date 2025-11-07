<template>
  <div class="page-main">
    <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="User" name="first"></el-tab-pane>
      <el-tab-pane label="Config" name="second"></el-tab-pane>
      <el-tab-pane label="Role" name="third"></el-tab-pane>
      <el-tab-pane label="Task" name="fourth"></el-tab-pane>
    </el-tabs>
    <div class="section-wrapper">
      <div class="c-section-header">基础信息</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import type { TabsPaneContext } from 'element-plus'

const props = defineProps({
  pageAction: {
    type: String,
    required: true
  }
})

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<style lang="less" scoped></style>
