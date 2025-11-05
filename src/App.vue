<template>
  <el-config-provider :locale="locale">
    <router-view />
    <el-backtop :right="20" :bottom="20" />
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const locale = zhCn
</script>

<style>
html, body, #app {
  height: 100%;
}
body {
  margin: 0;
}
</style>
