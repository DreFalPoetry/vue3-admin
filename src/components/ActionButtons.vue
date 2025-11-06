<template>
  <div class="action-buttons">
    <template v-if="filteredButtons.length <= 3">
      <el-button
        v-for="(btn, idx) in filteredButtons"
        :key="idx"
        :type="btn.type || 'primary'"
        :link="btn.link"
        :disabled="btn.disabled"
        @click="onBtnClick(btn)"
      >
        <slot :name="btn.slot" v-if="btn.slot" />
        <template v-else>{{ btn.label }}</template>
      </el-button>
    </template>
    <template v-else>
      <el-button
        :type="filteredButtons[0].type || 'primary'"
        :link="filteredButtons[0].link"
        :disabled="filteredButtons[0].disabled"
        @click="onBtnClick(filteredButtons[0])"
      >
        <slot :name="filteredButtons[0].slot" v-if="filteredButtons[0].slot" />
        <template v-else>{{ filteredButtons[0].label }}</template>
      </el-button>
      <el-dropdown trigger="hover" @command="onCommand" class="btn-dropdown">
        <el-button link type="primary">
          更多
          <el-icon><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(btn, idx) in filteredButtons.slice(1)"
              :key="idx"
              :command="btn"
              :disabled="btn.disabled"
            >
              <slot :name="btn.slot" v-if="btn.slot" />
              <template v-else>{{ btn.label }}</template>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'

interface ActionButtonItem {
  label: string
  type?: string
  link?: boolean
  disabled?: boolean
  onClick?: () => void
  slot?: string
  permission?: string | string[] | ((permissions: string[]) => boolean)
}

interface Props {
  buttons: ActionButtonItem[]
  permissions?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  permissions: () => []
})

// 默认权限检查函数
function defaultCheckPermission(
  permission: string | string[] | ((permissions: string[]) => boolean),
  userPermissions: string[]
): boolean {
  if (!permission) return true // 没有权限要求，默认显示

  // 如果是函数，直接调用
  if (typeof permission === 'function') {
    return permission(userPermissions)
  }

  // 如果是字符串数组，需要拥有所有权限
  if (Array.isArray(permission)) {
    return permission.every(p => userPermissions.includes(p))
  }

  // 如果是单个字符串，检查是否包含该权限
  return userPermissions.includes(permission)
}

// 过滤有权限的按钮
const filteredButtons = computed(() => {
  return props.buttons.filter(btn => {
    if (!btn.permission) return true // 没有权限要求，默认显示
    return defaultCheckPermission(btn.permission, props.permissions)
  })
})

function onBtnClick(btn: ActionButtonItem) {
  btn.onClick && btn.onClick()
}

function onCommand(btn: ActionButtonItem) {
  btn.onClick && btn.onClick()
}
</script>

<style scoped>
.action-buttons {
  display: inline-flex;
}
.btn-dropdown {
  margin-left: 10px;
}
</style>
