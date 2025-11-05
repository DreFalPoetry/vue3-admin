import type { RouteLocationNormalized } from 'vue-router'
import { menuList } from '@/config/menu'
import type { MenuItem } from '@/types/menu'

// 递归查找菜单项
function findMenuItem(path: string, items: MenuItem[]): MenuItem | null {
  for (const item of items) {
    if (item.path === path) {
      return item
    }
    if (item.children) {
      const found = findMenuItem(path, item.children)
      if (found) return found
    }
  }
  return null
}

// 获取路由标题
export function getRouteTitle(route: RouteLocationNormalized): string {
  // 优先使用路由 meta 中的 title
  if (route.meta?.title) {
    return route.meta.title as string
  }
  
  // 从菜单配置中查找
  const menuItem = findMenuItem(route.path, menuList)
  if (menuItem?.meta?.title) {
    return menuItem.meta.title
  }
  
  // 使用路由名称
  if (route.name) {
    return String(route.name)
  }
  
  // 默认使用路径
  return route.path
}

