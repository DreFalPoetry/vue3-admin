<template>
  <span>{{ formattedPrice }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ value: any }>()

const formattedPrice = computed(() => {
  const val = Number(props.value)
  if (isNaN(val)) return '-'
  return `¥${val.toFixed(2)}`
})
</script>
