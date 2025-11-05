<template>
  <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path">
    <template #title>
      <el-icon v-if="item.icon">
        <component :is="item.icon" />
      </el-icon>
      <span>{{ item.meta?.title || item.name }}</span>
    </template>
    <MenuItem v-for="child in item.children" :key="child.path" :item="child" :is-top-level="false" />
  </el-sub-menu>
  <el-tooltip
    v-else-if="isTopLevel"
    :content="item.meta?.title || item.name"
    placement="right"
    :disabled="!isCollapsed"
  >
    <el-menu-item :index="item.path">
      <el-icon v-if="item.icon">
        <component :is="item.icon" />
      </el-icon>
      <span>{{ item.meta?.title || item.name }}</span>
    </el-menu-item>
  </el-tooltip>
  <el-menu-item v-else :index="item.path">
    <el-icon v-if="item.icon">
      <component :is="item.icon" />
    </el-icon>
    <span>{{ item.meta?.title || item.name }}</span>
  </el-menu-item>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import type { ComputedRef } from 'vue'
import type { MenuItem as MenuItemType } from '@/types/menu'

// 定义组件接收的属性（props）
// item: 菜单项数据
// isTopLevel: 是否为顶级菜单（默认 true），用于判断是否显示 tooltip
withDefaults(
  defineProps<{
    item: MenuItemType
    isTopLevel?: boolean
  }>(),
  {
    isTopLevel: true
  }
)

// 通过 provide/inject 从父组件（AdminLayout）获取菜单折叠状态
// inject 接收两个参数：
// 1. 'menuCollapsed': 注入的 key（在 AdminLayout 中通过 provide 提供）
// 2. computed(() => false): 默认值（如果找不到注入的值，返回 false）
const menuCollapsed = inject<ComputedRef<boolean>>(
  'menuCollapsed',
  computed(() => false)
)

// 创建一个计算属性，用于在模板中判断菜单是否折叠
// 当菜单折叠且是顶级菜单时，tooltip 才会显示
const isCollapsed = computed(() => menuCollapsed.value)
</script>
