<template>
  <div class="page-container">
    <el-card>
      <!-- 搜索表单（公用组件） -->
      <SearchForm v-model="searchForm" :items="searchItems as any" @search="handleSearch" @reset="handleReset" />
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="formData.code" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="1"> 启用 </el-radio>
            <el-radio label="0"> 禁用 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false"> 取消 </el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit"> 确定 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import SearchForm from '@/components/SearchForm.vue'
import BaseTable from '@/components/base-table/Index.vue'
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
const formRef = ref<FormInstance>()
const formData = reactive<FormItem>({
  id: undefined,
  name: '',
  code: '',
  status: '1',
  remark: ''
})

// 表单验证规则
const formRules: FormRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

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
  resetForm()
}

// 编辑
function handleEdit(row: TableItem) {
  dialogTitle.value = '编辑'
  dialogVisible.value = true
  Object.assign(formData, {
    id: row.id,
    name: row.name,
    code: row.code,
    status: row.status,
    remark: (row as { remark?: string }).remark || ''
  })
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
async function handleSubmit() {
  if (!formRef.value) return

  await formRef.value.validate(async valid => {
    if (!valid) return

    submitLoading.value = true
    try {
      // TODO: 替换为实际的 API 调用
      // if (formData.id) {
      //   await post(`/your-api/update/${formData.id}`, formData)
      //   ElMessage.success('更新成功')
      // } else {
      //   await post('/your-api/create', formData)
      //   ElMessage.success('创建成功')
      // }

      // 模拟成功
      await new Promise(resolve => setTimeout(resolve, 500))
      ElMessage.success(formData.id ? '更新成功' : '创建成功')

      dialogVisible.value = false
      fetchData()
    } catch (error) {
      ElMessage.error(formData.id ? '更新失败' : '创建失败')
      console.error(error)
    } finally {
      submitLoading.value = false
    }
  })
}

// 重置表单
function resetForm() {
  Object.assign(formData, {
    id: undefined,
    name: '',
    code: '',
    status: '1',
    remark: ''
  })
  formRef.value?.clearValidate()
}

// 对话框关闭
function handleDialogClose() {
  resetForm()
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
