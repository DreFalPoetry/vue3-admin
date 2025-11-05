<template>
  <div class="role-list-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>角色列表</span>
          <el-button type="primary" @click="handleAdd">新增角色</el-button>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="code" label="角色编码" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'RoleList'
})

const tableData = ref([
  {
    id: 1,
    name: '超级管理员',
    code: 'admin',
    description: '拥有所有权限',
    createTime: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    name: '普通用户',
    code: 'user',
    description: '普通用户权限',
    createTime: '2024-01-02 10:00:00'
  },
  {
    id: 3,
    name: '访客',
    code: 'guest',
    description: '只读权限',
    createTime: '2024-01-03 10:00:00'
  }
])

function handleAdd() {
  ElMessage.info('新增角色功能待实现')
}

function handleEdit(row: unknown) {
  ElMessage.info(`编辑角色: ${JSON.stringify(row)}`)
}

function handleDelete(row: unknown) {
  ElMessage.warning(`删除角色: ${JSON.stringify(row)}`)
}
</script>

<style lang="less" scoped>
.role-list-page {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    font-size: 16px;
  }
}
</style>
