<template>
  <el-form
    ref="formRef"
    :model="localModel"
    :inline="inline"
    class="search-form"
    :label-width="labelWidth"
  >
    <el-row :gutter="gutter">
      <el-col
        v-for="(item, index) in displayedItems"
        :key="index"
        :span="Number(item.colSpan) || defaultColSpan"
      >
        <el-form-item :label="item.label" :prop="item.prop">
          <component
            v-if="item.type !== 'custom'"
            :is="componentOf(item)"
            :model-value="getValue(item.prop)"
            @update:model-value="(val: any) => setValue(item.prop, val)"
            v-bind="controlAttrs(item)"
            :placeholder="item.placeholder"
            @keyup.enter="onSearch"
          >
            <template v-if="item.type === 'select'">
              <el-option
                v-for="opt in item.options || []"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </template>
          </component>

          <slot v-else :name="item.slotName || item.prop" :model="localModel" />
        </el-form-item>
      </el-col>

      <el-col v-if="showActions" :span="computedActionsColSpan">
        <div :class="['actions', actionsAlign]">
          <el-button v-if="showExpandButton" link type="primary" @click="toggleExpand">
            {{ expanded ? '收起' : '展开' }}
            <el-icon
              :style="{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s'
              }"
            >
              <ArrowDown />
            </el-icon>
          </el-button>
          <el-button type="primary" @click="onSearch">
            <el-icon>
              <Search />
            </el-icon>
            {{ actions.searchText || '搜索' }}
          </el-button>
          <el-button @click="onReset">
            <el-icon>
              <Refresh />
            </el-icon>
            {{ actions.resetText || '重置' }}
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Search, Refresh, ArrowDown } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

const props = withDefaults(
  defineProps<{
    modelValue: Record<string, any>
    items: Array<Record<string, any>>
    inline?: boolean
    showActions?: boolean
    actions?: Partial<{ searchText: string; resetText: string }>
    labelWidth?: string | number
    gutter?: number
    defaultColSpan?: number
    actionsColSpanExpanded?: number
    actionsColSpanCollapsed?: number
    actionsAlign?: 'left' | 'right'
    expandThreshold?: number
  }>(),
  {
    inline: true,
    showActions: true,
    gutter: 12,
    defaultColSpan: 6,
    actionsAlign: 'left',
    expandThreshold: 4
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: Record<string, unknown>): void
  (e: 'search'): void
  (e: 'reset'): void
}>()

const formRef = ref<FormInstance>()

const inline = computed(() => props.inline)
const showActions = computed(() => props.showActions)
const actions = computed(() => props.actions || {})
const labelWidth = computed(() => props.labelWidth ?? 100)
const gutter = computed(() => props.gutter)
const defaultColSpan = computed(() => props.defaultColSpan)
const actionsAlign = computed(() => props.actionsAlign)

// 展开/收起阈值：超过该数量时启用展开/收起功能，收起时显示阈值减1个
const expandThreshold = computed(() => props.expandThreshold ?? 4)

// 收起时显示的个数：默认显示阈值减1个
const collapsedCount = computed(() => Math.max(1, expandThreshold.value - 1))

// 是否显示展开/收起按钮：当 items 数量超过阈值时显示
const showExpandButton = computed(() => props.items.length > expandThreshold.value)

// 展开/收起状态：超过阈值时默认收起，否则默认展开
const expanded = ref(props.items.length <= (props.expandThreshold ?? 4))

// 显示的搜索项：超过阈值且收起时只显示前 collapsedCount 个，否则显示全部
const displayedItems = computed(() => {
  if (props.items.length > expandThreshold.value && !expanded.value) {
    return props.items.slice(0, collapsedCount.value)
  }
  return props.items
})

// 根据展开/收起状态计算 action 部分的 colSpan
const computedActionsColSpan = computed(() => {
  if (expanded.value) {
    // 展开状态：使用 actionsColSpanExpanded，否则使用 defaultColSpan
    return props.actionsColSpanExpanded ?? defaultColSpan.value
  } else {
    // 收起状态：使用 actionsColSpanCollapsed，否则使用 defaultColSpan
    return props.actionsColSpanCollapsed ?? defaultColSpan.value
  }
})

function toggleExpand() {
  expanded.value = !expanded.value
}

// local reactive copy to avoid mutating readonly props
const localModel = ref<Record<string, any>>({ ...props.modelValue })

function getValue(prop: string) {
  return localModel.value[prop]
}

function setValue(prop: string, val: any) {
  localModel.value = { ...localModel.value, [prop]: val }
  emit('update:modelValue', { ...localModel.value })
}

function componentOf(item: Record<string, any>) {
  switch (item.type) {
    case 'input':
      return 'el-input'
    case 'select':
      return 'el-select'
    case 'date':
      return 'el-date-picker'
    case 'daterange':
      return 'el-date-picker'
    default:
      return 'div'
  }
}

function controlAttrs(item: Record<string, any>) {
  const base = item.attrs || {
    clearable: true,
    style: 'width: 100%'
  }
  if (item.type === 'date' && !('type' in base)) {
    return { type: 'date', clearable: true, ...base }
  }
  if (item.type === 'daterange' && !('type' in base)) {
    return { type: 'daterange', clearable: true, ...base }
  }
  return base
}

function onSearch() {
  emit('search')
}

function onReset() {
  // 重置所有表单项（包括被收起的），而不仅仅是显示的
  const resetValues: Record<string, any> = { ...localModel.value }
  props.items.forEach(item => {
    if (item.prop) {
      // 根据字段类型设置默认值
      if (item.type === 'select' || item.type === 'date' || item.type === 'daterange') {
        resetValues[item.prop] = undefined
      } else {
        resetValues[item.prop] = ''
      }
    }
  })

  // 更新 localModel
  localModel.value = { ...resetValues }

  // 重置表单验证状态
  formRef.value?.resetFields()

  // 触发更新事件
  emit('update:modelValue', { ...localModel.value })
  emit('reset')
}
</script>

<style scoped>
.el-form-item {
  width: 100%;
  margin-right: 0px;
}
.actions {
  display: flex;
}
.actions.right {
  justify-content: flex-end;
}
</style>
