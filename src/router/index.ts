import {
  createRouter,
  createWebHashHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  type RouteRecordRaw
} from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Menu as MenuIcon, Setting, User as UserIcon, Key, Goods } from '@element-plus/icons-vue'

const Login = () => import('@/views/Login.vue')
const Dashboard = () => import('@/views/Dashboard.vue')
const GoodsManage = () => import('@/views/goods/goods-manage/Index.vue')
const GoodsManageCreate = () => import('@/views/goods/goods-manage/Create.vue')
const GoodsManageEdit = () => import('@/views/goods/goods-manage/Edit.vue')
const GoodsManageDetail = () => import('@/views/goods/goods-manage/Detail.vue')
const NotFound = () => import('@/views/NotFound.vue')
const Redirect = () => import('@/views/Redirect.vue')
const AdminLayout = () => import('@/layouts/AdminLayout.vue')
const User = () => import('@/views/system/User.vue')
const RoleList = () => import('@/views/system/role/RoleList.vue')
const RolePermission = () => import('@/views/system/role/RolePermission.vue')

export const appChildRoutes: RouteRecordRaw[] = [
  { path: '', redirect: '/dashboard' },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { title: '仪表盘', icon: MenuIcon }
  },
  {
    path: '/goods',
    name: 'goods',
    meta: { title: '商品', icon: Goods },
    children: [
      {
        path: '/goods/goods-manage',
        name: 'goodManage',
        component: GoodsManage,
        meta: { title: '商品管理' }
      },
      {
        path: '/goods/goods-manage/create',
        name: 'goodsManageCreate',
        component: GoodsManageCreate,
        meta: { title: '商品管理-创建', hidden: true, activeMenu: '/goods/goods-manage' }
      },
      {
        path: '/goods/goods-manage/edit/:id',
        name: 'goodsManageEdit',
        component: GoodsManageEdit,
        meta: { title: '商品管理修改', hidden: true, activeMenu: '/goods/goods-manage' }
      },
      {
        path: '/goods/goods-manage/detail/:id',
        name: 'goodsManageDetail',
        component: GoodsManageDetail,
        meta: { title: '商品管理详情', hidden: true, activeMenu: '/goods/goods-manage' }
      }
    ]
  },
  {
    path: '/system',
    name: 'system',
    meta: { title: '系统管理', icon: Setting },
    children: [
      {
        path: '/system/user',
        name: 'user',
        component: User,
        meta: { title: '用户管理', icon: UserIcon }
      },
      {
        path: '/system/role',
        name: 'role',
        meta: { title: '角色管理', icon: Key },
        children: [
          {
            path: '/system/role/list',
            name: 'roleList',
            component: RoleList,
            meta: { title: '角色列表' }
          },
          {
            path: '/system/role/permission',
            name: 'rolePermission',
            component: RolePermission,
            meta: { title: '权限配置' }
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/login', name: 'login', component: Login, meta: { public: true, title: '登录' } },
    { path: '/redirect', component: Redirect, meta: { public: true } },
    {
      path: '/',
      component: AdminLayout,
      children: appChildRoutes
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
