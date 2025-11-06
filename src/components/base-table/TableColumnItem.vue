<template>
  <el-table-column v-bind="getColumnProps(column)" v-if="column.show !== false">
    <!-- 自定义表头插槽 -->
    <template v-if="column.headerSlot" #header="scope">
      <slot :name="column.headerSlot" v-bind="scope" />
    </template>

    <!-- 单元格内容 -->
    <template v-if="column.slot" #default="scope">
      <slot :name="column.slot" v-bind="scope" />
    </template>

    <!-- widget 渲染 -->
    <template v-else-if="!column.children" #default="scope">
      <component
        :is="getWidgetComponent(column.widget)"
        :value="scope.row[column.prop]"
        v-bind="column.widgetProps"
      />
    </template>

    <!-- 子级列：递归调用自身 -->
    <template v-if="column.children && column.children.length">
      <TableColumnItem
        v-for="child in column.children"
        :key="child.prop || child.label"
        :column="child"
        :widget-map="widgetMap"
      >
        <!-- 转发插槽 -->
        <template v-for="(_, name) in $slots" :key="name" v-slot:[name]="slotScope">
          <slot :name="name" v-bind="slotScope" />
        </template>
      </TableColumnItem>
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
import type { TableColumn } from './types'
defineOptions({ name: 'TableColumnItem' }) // 这一步让 Vue 能在模板中识别自身
const props = defineProps<{
  column: TableColumn
  widgetMap: Record<string, any>
}>()

function getWidgetComponent(widget?: string) {
  if (!widget) return props.widgetMap['span']
  return props.widgetMap[widget.toLowerCase()] || props.widgetMap['span']
}

function getColumnProps(col: TableColumn) {
  return {
    prop: col.prop,
    label: col.label,
    width: col.width,
    minWidth: col.minWidth,
    align: col.align,
    headerAlign: col.headerAlign,
    sortable: col.sortable,
    fixed: col.fixed
  }
}
</script>
