<template>
  <div class="page-container">
    <el-card>
      <!-- 搜索表单（公用组件） -->
      <SearchForm
        v-model="searchForm"
        :items="searchItems as any"
        @search="handleSearch"
        @reset="handleReset"
      />
    </el-card>
    <el-card>
      <div class="generate-table-wrapper">
        <div class="table-actions">
          <el-button type="primary" @click="handleAdd">
            <el-icon>
              <Plus />
            </el-icon>
            新增
          </el-button>
        </div>
        <div class="table-wrapper">
          <!-- 数据表格 -->
          <BaseTable
            :columns="columns"
            :data="tableData"
            :loading="loading"
            :pagination="pagination"
            show-pagination
            selection
            index
            @page-change="onPageChange"
            @size-change="onSizeChange"
            @sort-change="onSortChange"
          >
            <!-- 自定义列内容 -->
            <template #status="{ row }">
              <el-tag :type="row.status ? 'success' : 'danger'">
                {{ row.status ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </BaseTable>
        </div>
      </div>
    </el-card>

    <GoodsDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :loading="submitLoading"
      :record="editRecord"
      @confirm="onConfirmDialog"
      @closed="handleDialogClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import SearchForm from '@/components/SearchForm.vue'
import BaseTable from '@/components/base-table/Index.vue'
import GoodsDialog from './GoodsDialog.vue'
// import { get, post } from '@/api/http'

defineOptions({
  name: 'goodManage'
})

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: ''
})

const searchItems: any[] = [
  {
    type: 'input',
    prop: 'keyword',
    label: '关键词',
    placeholder: '请输入关键词',
    colSpan: 6,
    attrs: { clearable: true }
  },
  {
    type: 'select',
    prop: 'status',
    label: '状态',
    placeholder: '请选择状态',
    options: [
      { label: '启用', value: '1' },
      { label: '禁用', value: '0' }
    ],
    attrs: { clearable: true, style: 'width: 160px' }
  }
]

const pagination = ref({ page: 1, pageSize: 10, total: 2 })
// 表格数据
const loading = ref(false)

const columns = [
  { label: '姓名', prop: 'name' },
  { label: '邮箱', prop: 'email' },
  { label: '状态', prop: 'status', slot: 'status' }
]
const tableData = ref<TableItem[]>([])

function onPageChange(p: number) {
  pagination.value.page = p
}
function onSizeChange(s: number) {
  pagination.value.pageSize = s
}
function onSortChange(info: any) {
  console.log('排序信息', info)
}

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增')
const submitLoading = ref(false)
const editRecord = ref<Partial<FormItem> | null>(null)

// 类型定义
interface TableItem {
  id: number
  name: string
  code: string
  status: string
  createTime: string
  [key: string]: unknown
}

interface FormItem {
  id?: number
  name: string
  code: string
  status: string
  remark: string
}

// 获取列表数据
async function fetchData() {
  loading.value = true
  try {
    // TODO: 替换为实际的 API 调用
    // const res = await get<{
    //   data: TableItem[]
    //   total: number
    // }>('/your-api/list', {
    //   params: {
    //     ...searchForm,
    //     page: pagination.page,
    //     pageSize: pagination.pageSize
    //   }
    // })
    // tableData.value = res.data.data
    // pagination.total = res.data.total

    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = [
      {
        id: 1,
        name: '示例数据1',
        code: 'example1',
        status: '1',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: 2,
        name: '示例数据2',
        code: 'example2',
        status: '0',
        createTime: '2024-01-02 10:00:00'
      }
    ]
    pagination.value.total = 2
  } catch (error) {
    ElMessage.error('获取数据失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 搜索
function handleSearch() {
  pagination.value.page = 1
  fetchData()
}

// 重置搜索
function handleReset() {
  pagination.value.page = 1
  fetchData()
}

// 新增
function handleAdd() {
  dialogTitle.value = '新增'
  dialogVisible.value = true
  editRecord.value = null
}

// 编辑
function handleEdit(row: TableItem) {
  dialogTitle.value = '编辑'
  dialogVisible.value = true
  editRecord.value = {
    id: row.id,
    name: row.name,
    code: row.code,
    status: row.status,
    remark: (row as { remark?: string }).remark || ''
  }
}

// 删除
function handleDelete(row: TableItem) {
  ElMessageBox.confirm(`确定要删除 "${row.name}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        // TODO: 替换为实际的 API 调用
        // await post(`/your-api/delete/${row.id}`)
        ElMessage.success('删除成功')
        fetchData()
      } catch (error) {
        ElMessage.error('删除失败')
        console.error(error)
      }
    })
    .catch(() => {
      // 用户取消
    })
}

// 提交表单
async function onConfirmDialog(payload: FormItem) {
  submitLoading.value = true
  try {
    // TODO: 替换为实际的 API 调用
    // if (payload.id) {
    //   await post(`/your-api/update/${payload.id}`, payload)
    //   ElMessage.success('更新成功')
    // } else {
    //   await post('/your-api/create', payload)
    //   ElMessage.success('创建成功')
    // }

    // 模拟成功
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success(payload.id ? '更新成功' : '创建成功')

    dialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error(payload.id ? '更新失败' : '创建失败')
    console.error(error)
  } finally {
    submitLoading.value = false
  }
}

// 对话框关闭
function handleDialogClose() {
  editRecord.value = null
}

// 初始化
onMounted(() => {
  fetchData()
})
</script>

<style lang="less" scoped>
.page-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    font-size: 16px;
  }

  .search-form {
    margin-bottom: 0px;
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
