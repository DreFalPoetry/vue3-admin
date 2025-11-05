<template>
  <div class="role-permission-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>权限配置</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card>
            <template #header>角色列表</template>
            <el-tree
              :data="roleTree"
              :props="{ label: 'name' }"
              default-expand-all
              @node-click="handleRoleClick"
            />
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card>
            <template #header>
              <span>权限设置 - {{ selectedRole || '请选择角色' }}</span>
            </template>
            <el-tree
              v-if="selectedRole"
              :data="permissionTree"
              :props="{ label: 'name', children: 'children' }"
              show-checkbox
              node-key="id"
              default-expand-all
              :default-checked-keys="checkedKeys"
            />
            <el-empty v-else description="请先选择一个角色" />
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'RolePermission'
})

const selectedRole = ref<string>('')
const checkedKeys = ref<number[]>([1, 2, 3])

const roleTree = ref([
  {
    id: 1,
    name: '超级管理员'
  },
  {
    id: 2,
    name: '普通用户'
  },
  {
    id: 3,
    name: '访客'
  }
])

const permissionTree = ref([
  {
    id: 1,
    name: '系统管理',
    children: [
      { id: 11, name: '用户管理' },
      { id: 12, name: '角色管理' },
      { id: 13, name: '权限管理' }
    ]
  },
  {
    id: 2,
    name: '内容管理',
    children: [
      { id: 21, name: '文章管理' },
      { id: 22, name: '分类管理' }
    ]
  },
  {
    id: 3,
    name: '数据统计',
    children: [
      { id: 31, name: '访问统计' },
      { id: 32, name: '用户统计' }
    ]
  }
])

function handleRoleClick(data: { name: string }) {
  selectedRole.value = data.name
  // 这里可以根据角色加载对应的权限配置
}
</script>

<style lang="less" scoped>
.role-permission-page {
  .card-header {
    font-weight: 600;
    font-size: 16px;
  }
}
</style>

