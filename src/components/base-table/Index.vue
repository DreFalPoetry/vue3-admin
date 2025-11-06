<template>
  <div class="base-table">
    <el-table
      ref="tableRef"
      :data="tableData"
      border
      stripe
      fit
      highlight-current-row
      :row-key="rowKey"
      :size="size"
      :height="height"
      :default-sort="defaultSort"
      :loading="loading"
      @sort-change="onSortChange"
      @selection-change="onSelectionChange"
    >
      <!-- 多选框 -->
      <el-table-column v-if="selection" type="selection" width="50" align="center" />

      <!-- 序号 -->
      <el-table-column v-if="index" type="index" label="序号" width="60" align="center" />

      <!-- 动态列 -->
      <template v-for="col in visibleColumns" :key="col.prop || col.label">
        <TableColumnItem :column="col" :widget-map="widgetMap">
          <!-- 透传所有外部插槽 -->
          <template v-for="(_, name) in $slots" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps" />
          </template>
        </TableColumnItem>
      </template>
    </el-table>

    <!-- 分页 -->
    <div v-if="showPagination" class="table-pagination">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        :current-page="pagination.page"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { TableColumn } from './types'
import TableColumnItem from './TableColumnItem.vue'
import { registerWidgets } from './utils/registerWidgets'

const props = defineProps({
  columns: { type: Array as () => TableColumn[], required: true },
  data: { type: Array as () => any[], default: () => [] },
  loading: { type: Boolean, default: false },
  rowKey: { type: String, default: 'id' },
  selection: { type: Boolean, default: false },
  index: { type: Boolean, default: false },
  size: { type: String, default: 'default' },
  height: { type: [String, Number], default: 'auto' },
  showPagination: { type: Boolean, default: false },
  pagination: {
    type: Object as () => { page: number; pageSize: number; total: number },
    default: () => ({ page: 1, pageSize: 10, total: 0 })
  },
  defaultSort: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['sort-change', 'selection-change', 'page-change', 'size-change'])

const tableRef = ref()
const tableData = ref(props.data)
// 自动注册 widgets
const widgetMap = registerWidgets()
const visibleColumns = computed(() => props.columns.filter(col => col.show !== false))

watch(
  () => props.data,
  val => {
    tableData.value = val
  },
  { deep: true }
)

function onSortChange(sortInfo: any) {
  emit('sort-change', sortInfo)
}
function onSelectionChange(selection: any[]) {
  emit('selection-change', selection)
}
function onPageChange(page: number) {
  emit('page-change', page)
}
function onSizeChange(size: number) {
  emit('size-change', size)
}
</script>

<style scoped lang="less">
.base-table {
  width: 100%;
  background: #fff;
  border-radius: 8px;

  .table-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
  }
}
</style>
