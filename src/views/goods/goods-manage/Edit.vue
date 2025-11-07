<template>
  <Modify :page-action="PAGE_ACTIONS.EDIT" />
</template>

<script setup lang="ts">
import { PAGE_ACTIONS } from '@/utils/consts'
import { useTabsStore } from '@/stores/tabs'
import Modify from './Modify.vue'
import { onActivated, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const tabsStore = useTabsStore()

onMounted(() => {
  setTitle()
})

onActivated(() => {})

function setTitle() {
  const routePath = route.path
  const routeTitle = `${route.meta.title || ''}-${route.params.id}`
  tabsStore.updateTabTitle(routePath, routeTitle)
}
</script>

<style lang="less" scoped></style>
