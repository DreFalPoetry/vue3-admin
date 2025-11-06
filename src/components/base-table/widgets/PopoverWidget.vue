<template>
  <el-popover placement="top" trigger="hover">
    <template #reference>
      <span class="truncate">{{ value }}</span>
    </template>
    <div>{{ value }}</div>
  </el-popover>
</template>

<script setup lang="ts">
defineProps<{ value: any }>()
</script>

<style scoped>
.truncate {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
