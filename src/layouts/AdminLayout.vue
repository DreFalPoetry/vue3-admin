<template>
  <el-container class="full-height">
    <el-aside :width="asideWidth">
      <div class="logo-container" :class="{ collapsed: app.sidebarCollapsed }">
        <span class="app-logo">
          <span class="logo-icon">🗂️</span>
          <span class="logo-text">Admin</span>
        </span>
      </div>
      <el-menu :collapse="app.sidebarCollapsed" router :default-active="route.path" :collapse-transition="false">
        <MenuItem v-for="item in menuList" :key="item.path" :item="item" />
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header" height="56px">
        <div class="header-left">
          <el-button text @click="app.toggleSidebar()">
            <el-icon>
              <component :is="app.sidebarCollapsed ? Expand : Fold" />
            </el-icon>
            {{ app.sidebarCollapsed ? '展开' : '收起' }}
          </el-button>
        </div>
        <div class="header-right">
          <el-dropdown>
            <div class="user-info">
              <el-avatar :size="32" :icon="UserFilled">
                <img v-if="userAvatar" :src="userAvatar" alt="avatar" />
              </el-avatar>
              <span class="username">{{ user.user?.name || '未登录' }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="onLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <TabBar />
      <el-main>
        <router-view v-slot="{ Component, route }">
          <template v-if="route.meta?.keepAlive !== false">
            <keep-alive>
              <component :is="Component" :key="(route.name as string) || route.path" />
            </keep-alive>
          </template>
          <component v-else :is="Component" :key="route.fullPath + (route.query?._refresh || '')" />
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, watch } from 'vue'
import { Expand, Fold, UserFilled } from '@element-plus/icons-vue'
import { useRouter, useRoute, type RouteLocationNormalized } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useTabsStore } from '@/stores/tabs'
import { menuList } from '@/config/menu'
import { getRouteTitle } from '@/utils/tabs'
import MenuItem from '@/components/MenuItem.vue'
import TabBar from '@/components/TabBar.vue'

const router = useRouter()
const route = useRoute()
const app = useAppStore()
const user = useUserStore()
const tabsStore = useTabsStore()

onMounted(() => {
  user.loadFromStorage()
  tabsStore.loadFromStorage()
  tabsStore.initHomeTab()

  // 初始化当前路由的 tab
  if (route.path !== '/login') {
    addTabForRoute(route)
  }
})

// 监听路由变化，自动添加 tab
watch(
  () => route.path,
  (path, oldPath) => {
    // 跳过 redirect 路由和登录页，避免刷新时触发菜单操作
    if (path !== '/login' && path !== '/redirect' && oldPath !== '/redirect') {
      addTabForRoute(route)
    }
  }
)

// 添加路由对应的 tab
function addTabForRoute(route: RouteLocationNormalized) {
  const title = getRouteTitle(route)
  tabsStore.addTab({
    path: route.path,
    name: route.name as string,
    title,
    closable: route.path !== '/dashboard' // 首页不可关闭
  })
}

// 不再通过 include 名称列表控制缓存，改为模板里按 meta.keepAlive 条件渲染

// 提供 collapse 状态给子组件
provide(
  'menuCollapsed',
  computed(() => app.sidebarCollapsed)
)

const asideWidth = computed(() => (app.sidebarCollapsed ? '64px' : 'var(--sidebar-width)'))

// 用户头像（可以从用户信息中获取，这里使用默认图标）
const userAvatar = computed(() => (user.user as { avatar?: string })?.avatar || '')

function onLogout() {
  user.logout()
  router.replace({ name: 'login' })
}
</script>

<style lang="less" scoped>
.logo-container {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  .app-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  &.collapsed {
    padding: 16px 8px;

    .logo-text {
      display: none;
    }
  }
}

.el-aside {
  background: #fff;
  border-right: 1px solid #ebeef5;
  overflow: hidden;

  :deep(.el-menu) {
    border-right: none;
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #f5f7fa;
    }

    .username {
      font-size: 14px;
      color: #303133;
    }
  }
}
</style>
