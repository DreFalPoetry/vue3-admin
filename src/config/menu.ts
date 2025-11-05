import { Menu, Setting, User, Key, Goods } from '@element-plus/icons-vue'
import type { MenuItem } from '@/types/menu'

export const menuList: MenuItem[] = [
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: Menu,
    meta: {
      title: '仪表盘'
    }
  },
  {
    path: '/goods',
    name: 'goods',
    icon: Goods,
    meta: {
      title: '商品'
    },
    children: [
      {
        path: '/goods/goods-manage',
        name: 'goodManage',
        meta: {
          title: '商品管理'
        }
      }
    ]
  },
  {
    path: '/system',
    name: 'system',
    icon: Setting,
    meta: {
      title: '系统管理'
    },
    children: [
      {
        path: '/system/user',
        name: 'user',
        icon: User,
        meta: {
          title: '用户管理'
        }
      },
      {
        path: '/system/role',
        name: 'role',
        icon: Key,
        meta: {
          title: '角色管理'
        },
        children: [
          {
            path: '/system/role/list',
            name: 'roleList',
            meta: {
              title: '角色列表'
            }
          },
          {
            path: '/system/role/permission',
            name: 'rolePermission',
            meta: {
              title: '权限配置'
            }
          }
        ]
      }
    ]
  }
]
