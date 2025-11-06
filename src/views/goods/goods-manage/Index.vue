<template>
  <div class="page-container">
    <el-card class="search-card" shadow="never">
      <!-- 搜索表单（公用组件） -->
      <SearchForm
        v-model="searchForm"
        :items="searchItems as any"
        :actionsColSpan="6"
        :actionsColSpanExpanded="18"
        actionsAlign="right"
        @search="handleSearch"
        @reset="handleReset"
      />
    </el-card>
    <el-card class="table-card" shadow="never">
      <div class="generate-table-wrapper">
        <div class="table-actions">
          <el-button type="primary" @click="handleAdd">
            <el-icon>
              <Plus />
            </el-icon>
            创建商品
          </el-button>
          <el-button type="primary"> 批量上架 </el-button>
          <el-button type="primary"> 批量下架 </el-button>
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
            <template #actionSlot="{ row }">
              <ActionButtons :buttons="rowActionButtons(row)" :permissions="userPermissions" />
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import SearchForm from '@/components/SearchForm.vue'
import BaseTable from '@/components/base-table/Index.vue'
import ActionButtons from '@/components/ActionButtons.vue'
import GoodsDialog from './GoodsDialog.vue'

// import { get, post } from '@/api/http'

defineOptions({
  name: 'goodManage'
})

const router = useRouter()

// 搜索表单
const searchForm = ref({
  name: '',
  type: null,
  category: null,
  status: null,
  skuCode: ''
})

const searchItems: any[] = [
  {
    type: 'input',
    prop: 'name',
    label: '商品名称',
    placeholder: '请输入',
    colSpan: 6
  },
  {
    type: 'select',
    prop: 'type',
    label: '商品类型',
    placeholder: '全部',
    colSpan: 6,
    options: [
      { label: '商品', value: '1' },
      { label: '服务', value: '2' },
      { label: '其他', value: '3' }
    ]
  },
  {
    type: 'select',
    prop: 'category',
    label: '商品类目',
    placeholder: '全部',
    options: [
      { label: '水果', value: '1' },
      { label: '蔬菜', value: '2' },
      { label: '肉类', value: '3' },
      { label: '海鲜', value: '4' },
      { label: '其他', value: '5' }
    ]
  },
  {
    type: 'select',
    prop: 'status',
    label: '商品状态',
    placeholder: '全部',
    options: [
      { label: '上架', value: '1' },
      { label: '已下架', value: '0' }
    ]
  },
  {
    type: 'input',
    prop: 'skuCode',
    label: 'SKU编码',
    placeholder: '请输入',
    colSpan: 6
  }
]

const pagination = ref({ page: 1, pageSize: 10, total: 2 })
// 表格数据
const loading = ref(false)

const columns = [
  { prop: 'skucode', label: '商品名称', widget: 'popover' },
  {
    label: '价格信息',
    prop: '1',
    children: [
      { prop: 'initPrice', label: '销售价', widget: 'priceformat' },
      { prop: 'cost', label: '成本价', widget: 'priceformat' }
    ]
  },
  {
    label: '库存信息',
    prop: '2',
    children: [
      { prop: 'saleCount', label: '库存数量' },
      { prop: 'unit', label: '单位' },
      { prop: 'actions', label: '操作', slot: 'actionSlot', width: 180 }
    ]
  }
]

// const columns = [
//   { label: 'SKU编码', prop: 'skucode', widget: 'popover' },
//   { label: '商品信息', prop: 'name' },
//   { label: '商品类型', prop: 'type' },
//   { label: '售价', prop: 'price' },
//   { label: '库存', prop: 'stock' },
//   { label: '成本价', prop: 'initPrice', widget: 'priceformat' },
//   { label: '销售数量', prop: 'saleCount' },
//   { label: '创建时间', prop: 'createTime', width: 280 },
//   { label: '商品状态', prop: 'status', width: 280 },
//   { label: '操作', prop: 'actions', slot: 'actionSlot', width: 180 }
// ]
const tableData = ref<any[]>([])

function onPageChange(p: number) {
  pagination.value.page = p
}
function onSizeChange(s: number) {
  pagination.value.pageSize = s
}
function onSortChange(info: any) {
  console.log('排序信息', info)
}

// 用户权限列表（实际应该从用户信息或权限管理模块获取）
const userPermissions = ref<string[]>([
  'goods:view', // 查看权限
  'goods:edit', // 编辑权限
  'goods:delete', // 删除权限（注释掉表示没有该权限）
  'goods:copy' // 复制权限
])

// 行内操作按钮
function rowActionButtons(row: TableItem) {
  return [
    {
      label: '详情',
      link: true,
      permission: 'goods:view',
      onClick: () => ElMessage.info(`查看 ${row.name}`)
    },
    {
      label: '编辑',
      link: true,
      permission: 'goods:edit',
      onClick: () => handleEdit(row)
    },
    {
      label: '删除',
      link: true,
      permission: 'goods:delete',
      onClick: () => handleDelete(row)
    },
    {
      label: '复制',
      link: true,
      permission: 'goods:copy',
      onClick: () => ElMessage.success('已复制')
    }
  ]
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
    //     ...searchForm.value,
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
        skucode: '1111121212121212222222222222222222222212112',
        initPrice: 11,
        name: '示例数据1',
        code: 'example1',
        status: '1',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: 2,
        name: '示例数据2',
        code: 'example2',
        initPrice: 222,
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
  router.push({ path: '/goods/goods-manage/create' })
  return
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

<style lang="less" scoped></style>
