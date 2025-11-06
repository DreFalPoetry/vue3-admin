// components/BaseTable/utils/registerWidgets.ts
export function registerWidgets() {
  // 自动加载 ./widgets 目录下所有组件
  const widgetModules = import.meta.glob('../widgets/*.vue', { eager: true })

  const widgetMap: Record<string, any> = {}

  for (const path in widgetModules) {
    const mod = widgetModules[path] as any
    // 文件名转为 widget 名（不区分大小写）
    const fileName = path.split('/').pop()?.replace('.vue', '') || ''
    const key = fileName.replace(/Widget$/, '').toLowerCase()
    widgetMap[key] = mod.default
  }

  return widgetMap
}
