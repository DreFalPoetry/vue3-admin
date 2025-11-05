<template>
  <div class="tab-bar">
    <div ref="scrollWrapperRef" class="tab-scroll-wrapper">
      <div ref="tabListRef" class="tab-list">
        <div v-for="tab in tabsStore.tabs" :key="tab.path"
          :class="['tab-item', { active: tabsStore.activeTab === tab.path }]" @click="handleTabClick(tab.path)"
          @contextmenu.prevent="handleContextMenu($event, tab.path)">
          <span class="tab-title">{{ tab.title }}</span>
          <el-icon v-if="tab.closable" class="tab-close" @click.stop="handleClose(tab.path)">
            <Close />
          </el-icon>
        </div>
      </div>
    </div>

    <!-- 右键菜单 -->
    <el-dropdown v-if="contextMenuTab" ref="contextMenuRef" trigger="click" :teleported="false"
      @command="handleContextCommand" @visible-change="handleMenuVisibleChange">
      <div ref="contextMenuTriggerRef" class="context-menu-trigger" :style="contextMenuPosition"></div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="refresh">
            <el-icon>
              <Refresh />
            </el-icon>
            <span>刷新</span>
          </el-dropdown-item>
          <el-dropdown-item command="close" :disabled="!contextMenuTab?.closable">
            <el-icon>
              <Close />
            </el-icon>
            <span>关闭</span>
          </el-dropdown-item>
          <el-dropdown-item command="closeOthers">
            <el-icon>
              <CircleClose />
            </el-icon>
            <span>关闭其他</span>
          </el-dropdown-item>
          <el-dropdown-item command="closeAll">
            <el-icon>
              <Delete />
            </el-icon>
            <span>关闭全部</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Close, Refresh, CircleClose, Delete } from '@element-plus/icons-vue'
import { useTabsStore } from '@/stores/tabs'
import type { TabItem } from '@/stores/tabs'

const router = useRouter()
const tabsStore = useTabsStore()
const scrollWrapperRef = ref<HTMLElement>()
const tabListRef = ref<HTMLElement>()

// 右键菜单相关
const contextMenuRef = ref()
const contextMenuTriggerRef = ref<HTMLElement>()
const contextMenuStyle = ref({
  display: 'none',
  left: '0px',
  top: '0px'
})
const contextMenuTab = ref<TabItem | null>(null)

// 计算菜单位置样式
const contextMenuPosition = computed(() => ({
  display: contextMenuStyle.value.display,
  left: contextMenuStyle.value.left,
  top: contextMenuStyle.value.top,
  position: 'fixed' as const
}))

// 监听活动标签变化，自动滚动到可见区域
watch(
  () => tabsStore.activeTab,
  () => {
    nextTick(() => {
      scrollToActiveTab()
    })
  }
)

// 监听路由变化，自动关闭菜单
watch(
  () => router.currentRoute.value.path,
  () => {
    // 路由变化时立即关闭菜单
    closeContextMenu()
  }
)

// 关闭菜单
function closeContextMenu() {
  contextMenuTab.value = null
  contextMenuStyle.value = { display: 'none', left: '0px', top: '0px' }
}

// 监听菜单显示状态变化
function handleMenuVisibleChange(visible: boolean) {
  if (!visible) {
    // 菜单关闭时重置状态
    closeContextMenu()
  }
}

function handleTabClick(path: string) {
  tabsStore.setActiveTab(path)
  router.push(path)
}

function handleClose(path: string) {
  const newActivePath = tabsStore.removeTab(path)
  // 如果被删除的是活动标签，跳转到新的活动标签
  if (newActivePath) {
    router.push(newActivePath)
  }
}

// 处理右键菜单
function handleContextMenu(event: MouseEvent, path: string) {
  const tab = tabsStore.tabs.find(t => t.path === path)
  if (!tab) return

  // 如果已经有菜单打开，先关闭它
  if (contextMenuTab.value) {
    closeContextMenu()
    // 等待菜单关闭后再打开新菜单
    nextTick(() => {
      openContextMenu(event, tab)
    })
  } else {
    openContextMenu(event, tab)
  }
}

// 打开右键菜单
function openContextMenu(event: MouseEvent, tab: TabItem) {
  contextMenuTab.value = tab

  // 设置菜单位置
  const x = event.clientX
  const y = event.clientY

  contextMenuStyle.value = {
    display: 'block',
    left: `${x}px`,
    top: `${y}px`
  }

  nextTick(() => {
    contextMenuRef.value?.handleOpen()
  })
}

// 处理右键菜单命令
function handleContextCommand(command: string) {
  if (!contextMenuTab.value) return

  const tabPath = contextMenuTab.value.path

  // 立即关闭菜单，避免路由变化时菜单闪烁
  closeContextMenu()

  // 使用 nextTick 确保菜单关闭后再执行操作
  nextTick(() => {
    switch (command) {
      case 'refresh':
        handleRefresh(tabPath)
        break
      case 'close':
        handleClose(tabPath)
        break
      case 'closeOthers':
        const newActivePath = tabsStore.closeOthers(tabPath)
        if (newActivePath) {
          router.push(newActivePath)
        }
        break
      case 'closeAll':
        const newActivePath2 = tabsStore.closeAll()
        if (newActivePath2) {
          router.push(newActivePath2)
        }
        break
    }
  })
}

// 刷新当前标签页
function handleRefresh(path: string) {
  const tab = tabsStore.tabs.find(t => t.path === path)
  if (!tab) return

  // 如果当前不是活动标签，先切换到该标签
  if (tabsStore.activeTab !== path) {
    tabsStore.setActiveTab(path)
    router.push(path)
    return
  }

  // 刷新当前页面：通过添加时间戳参数来强制重新渲染组件
  // 直接在当前路由添加 query 参数，避免经过 redirect 路由触发菜单操作
  const currentRoute = router.currentRoute.value
  router.replace({
    path: path,
    query: {
      ...currentRoute.query,
      _refresh: Date.now().toString()
    }
  })
}

function scrollToActiveTab() {
  if (!scrollWrapperRef.value || !tabListRef.value) return

  const activeTab = tabListRef.value.querySelector('.tab-item.active') as HTMLElement
  if (!activeTab) return

  const wrapper = scrollWrapperRef.value
  const tabLeft = activeTab.offsetLeft
  const tabWidth = activeTab.offsetWidth
  const wrapperWidth = wrapper.offsetWidth
  const wrapperScrollLeft = wrapper.scrollLeft

  // 如果标签在可视区域左侧，滚动到标签左侧
  if (tabLeft < wrapperScrollLeft) {
    wrapper.scrollTo({ left: tabLeft, behavior: 'smooth' })
  }
  // 如果标签在可视区域右侧，滚动到标签右侧
  else if (tabLeft + tabWidth > wrapperScrollLeft + wrapperWidth) {
    wrapper.scrollTo({ left: tabLeft + tabWidth - wrapperWidth, behavior: 'smooth' })
  }
}
</script>

<style lang="less" scoped>
.tab-bar {
  display: flex;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
  height: 40px;
  padding: 0 8px;
}

.tab-scroll-wrapper {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.tab-list {
  display: flex;
  align-items: center;
  height: 100%;
  min-width: 100%;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  height: 32px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  white-space: nowrap;
  margin-right: 4px;
  transition: all 0.3s;

  .tab-title {
    font-size: 13px;
    color: #606266;
  }

  .tab-close {
    font-size: 12px;
    color: #909399;
    transition: color 0.3s;

    &:hover {
      color: #f56c6c;
    }
  }

  &:hover {
    background: #f5f7fa;
  }

  &.active {
    background: #409eff;
    border-color: #409eff;

    .tab-title {
      color: #fff;
    }

    .tab-close {
      color: #fff;

      &:hover {
        color: #f56c6c;
      }
    }
  }
}

.context-menu-trigger {
  position: fixed;
  width: 1px;
  height: 1px;
  pointer-events: none;
}
</style>
