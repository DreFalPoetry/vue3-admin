import {
  createRouter,
  createWebHashHistory,
  NavigationGuardNext,
  RouteLocationNormalized
} from 'vue-router'
import { useUserStore } from '@/stores/user'

const Login = () => import('@/views/Login.vue')
const Dashboard = () => import('@/views/Dashboard.vue')
const NotFound = () => import('@/views/NotFound.vue')
const Redirect = () => import('@/views/Redirect.vue')
const AdminLayout = () => import('@/layouts/AdminLayout.vue')
const User = () => import('@/views/system/User.vue')
const RoleList = () => import('@/views/system/role/RoleList.vue')
const RolePermission = () => import('@/views/system/role/RolePermission.vue')

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/login', name: 'login', component: Login, meta: { public: true, title: '登录' } },
    {
      path: '/redirect',
      component: Redirect,
      meta: { public: true }
    },
    {
      path: '/',
      component: AdminLayout,
      children: [
        { path: '', redirect: '/dashboard' },
        { path: 'dashboard', name: 'dashboard', component: Dashboard, meta: { title: '仪表盘' } },
        { path: 'system/user', name: 'user', component: User, meta: { title: '用户管理' } },
        {
          path: 'system/role/list',
          name: 'roleList',
          component: RoleList,
          meta: { title: '角色列表' }
        },
        {
          path: 'system/role/permission',
          name: 'rolePermission',
          component: RolePermission,
          meta: { title: '权限配置' }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
      meta: { public: true, title: '404' }
    }
  ]
})

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const userStore = useUserStore()
    document.title = (to.meta?.title as string) ? `${to.meta?.title} - Admin` : 'Admin'
    if (to.meta?.public) return next()
    if (!userStore.isAuthenticated) return next({ name: 'login', query: { redirect: to.fullPath } })

    // 同步 tabs store 的活动标签（跳过 redirect 路由，避免刷新时触发菜单操作）
    if (!to.meta?.public && to.path !== '/redirect' && from.path !== '/redirect') {
      import('@/stores/tabs').then(({ useTabsStore }) => {
        const tabsStore = useTabsStore()
        tabsStore.setActiveTab(to.path)
      })
    }

    next()
  }
)

export default router
