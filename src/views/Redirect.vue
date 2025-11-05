<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

onMounted(() => {
  const redirect = route.query.redirect as string
  if (redirect) {
    // 使用 replace 而不是 push，避免触发菜单操作
    // 添加时间戳参数来强制刷新组件
    router.replace({
      path: redirect,
      query: {
        ...route.query,
        _t: Date.now().toString()
      }
    })
  }
})
</script>
