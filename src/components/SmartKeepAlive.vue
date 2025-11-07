<template>
  <KeepAlive>
    <component v-if="shouldCache" :is="component" :key="getCacheKey(route.fullPath)" />
  </KeepAlive>
  <component v-if="!shouldCache" :is="component" :key="getCacheKey(route.fullPath)" />
</template>

<script setup lang="ts">
import { ref, watch, computed, defineProps } from 'vue'
import { useRoute } from 'vue-router'

interface Props {
  component: any
  includeList?: string[] // 允许缓存的路由 path 列表
}

const props = defineProps<Props>()
const route = useRoute()

// 自动检测 includeList 改变，删除被移除的缓存
watch(
  () => (props.includeList ? [...props.includeList] : []),
  (newList, oldList) => {
    if (!oldList?.length) return
    const removed = oldList.filter(path => !newList.includes(path))
    removed.forEach(path => {
      removeCache(path)
    })
  }
)

// 缓存 key Map：path -> unique key
const keyMap = ref(new Map<string, string>())

// 获取缓存 key
function getCacheKey(path: string) {
  if (!keyMap.value.has(path)) {
    keyMap.value.set(path, path + '-' + Date.now())
  }
  return keyMap.value.get(path)!
}

// 关闭标签页时调用，删除 key
function removeCache(path: string) {
  keyMap.value.delete(path)
}

// 是否缓存当前路由
const shouldCache = computed(() => {
  // 如果 includeList 未设置，则默认缓存
  if (!props.includeList || props.includeList.length === 0) return true
  // 根据 route.fullPath 或 route.path 判断
  return props.includeList.includes(route.fullPath)
})
</script>
