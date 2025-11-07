import { defineStore } from 'pinia'

export interface TabItem {
  path: string
  name: string
  title: string
  closable?: boolean
}

interface TabsState {
  tabs: TabItem[]
  activeTab: string
}

const TABS_STORAGE_KEY = 'admin_tabs'
const ACTIVE_TAB_KEY = 'active_tab'

export const useTabsStore = defineStore('tabs', {
  state: (): TabsState => ({
    tabs: [],
    activeTab: ''
  }),
  actions: {
    // 添加标签页
    addTab(tab: TabItem) {
      const exists = this.tabs.some(t => t.path === tab.path)
      if (!exists) {
        this.tabs.push(tab)
        this.saveToStorage()
      }
      this.setActiveTab(tab.path)
    },
    // 设置活动标签
    setActiveTab(path: string) {
      this.activeTab = path
      sessionStorage.setItem(ACTIVE_TAB_KEY, path)
    },
    // 更新标签页
    updateTabTitle(path: string, newTitle: string) {
      const currentTabIdx = this.tabs.findIndex(t => t.path === path)
      if (currentTabIdx > -1) {
        this.tabs.splice(currentTabIdx, 1, { ...this.tabs[currentTabIdx], title: newTitle })
        this.saveToStorage()
      }
    },
    // 移除标签页，返回新的活动标签路径（如果被删除的是活动标签）
    removeTab(path: string): string | null {
      const index = this.tabs.findIndex(t => t.path === path)
      if (index > -1) {
        const wasActive = this.activeTab === path
        let newActive: string | null = null

        // 如果删除的是当前活动标签，先确定要切换到的标签
        if (wasActive && this.tabs.length > 1) {
          // 如果删除的不是最后一个，切换到下一个（右侧）
          if (index < this.tabs.length - 1) {
            newActive = this.tabs[index + 1].path
          } else {
            // 否则切换到前一个（左侧）
            newActive = this.tabs[index - 1].path
          }
        }

        // 删除标签
        this.tabs.splice(index, 1)
        this.saveToStorage()

        // 如果确定了新的活动标签，设置它
        if (newActive) {
          this.setActiveTab(newActive)
          return newActive
        }
      }
      return null
    },
    // 关闭其他标签，返回新的活动标签路径
    closeOthers(path: string): string | null {
      const targetTab = this.tabs.find(t => t.path === path)
      if (!targetTab) return null

      this.tabs = this.tabs.filter(t => t.path === path || !t.closable)
      this.saveToStorage()

      // 如果当前活动标签被关闭了，切换到目标标签
      if (!this.tabs.some(t => t.path === this.activeTab)) {
        this.setActiveTab(path)
        return path
      }
      return null
    },
    // 关闭所有标签，返回新的活动标签路径
    closeAll(): string | null {
      this.tabs = this.tabs.filter(t => !t.closable)
      this.saveToStorage()
      if (this.tabs.length > 0) {
        const newActive = this.tabs[0].path
        this.setActiveTab(newActive)
        return newActive
      }
      return null
    },
    // 保存到存储
    saveToStorage() {
      sessionStorage.setItem(TABS_STORAGE_KEY, JSON.stringify(this.tabs))
    },
    // 从存储加载
    loadFromStorage() {
      const tabsStr = sessionStorage.getItem(TABS_STORAGE_KEY)
      if (tabsStr) {
        try {
          this.tabs = JSON.parse(tabsStr)
        } catch {
          this.tabs = []
        }
      }
      // 加载活动标签
      const activeTab = sessionStorage.getItem(ACTIVE_TAB_KEY)
      if (activeTab && this.tabs.some(t => t.path === activeTab)) {
        this.activeTab = activeTab
      } else if (this.tabs.length > 0) {
        this.activeTab = this.tabs[0].path
      }
    },
    // 初始化首页标签
    initHomeTab() {
      const homeTab: TabItem = {
        path: '/dashboard',
        name: 'dashboard',
        title: '首页',
        closable: false
      }
      if (this.tabs.length === 0) {
        this.tabs.push(homeTab)
        this.activeTab = homeTab.path
        this.saveToStorage()
      }
    }
  }
})
