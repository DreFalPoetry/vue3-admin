import type { RouteRecordRaw } from 'vue-router'
import type { MenuItem } from '@/types/menu'
import { appChildRoutes } from '@/router'

function routeToMenuItem(route: RouteRecordRaw): MenuItem | null {
  if (route.meta && (route.meta as any).hidden) return null
  const children = Array.isArray(route.children)
    ? (route.children.map(routeToMenuItem).filter(Boolean) as MenuItem[])
    : undefined

  // skip redirect-only or unnamed nodes without title
  const hasTitle = !!route.meta && !!(route.meta as any).title
  const isRedirectOnly = !!(route as any).redirect && !route.component && !children?.length
  if (!hasTitle || isRedirectOnly) {
    return children && children.length === 1
      ? children[0]
      : children && children.length > 0
        ? ({
            path: route.path as string,
            name: (route.name as string) || (route.path as string),
            children,
            meta: {}
          } as MenuItem)
        : null
  }

  return {
    path: route.path as string,
    name: (route.name as string) || (route.path as string),
    icon: route.meta && (route.meta as any).icon ? ((route.meta as any).icon as any) : undefined,
    children,
    meta: { title: (route.meta as any).title }
  }
}

export const menuList: MenuItem[] = (appChildRoutes.map(routeToMenuItem).filter(Boolean) as MenuItem[])
  // ensure redirect '' is removed
  .filter(item => item.path !== '')
