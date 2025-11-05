<template>
  <el-form ref="formRef" :model="internalModel" :inline="inline" class="search-form" :label-width="labelWidth">
    <el-row :gutter="gutter">
      <el-col v-for="(item, index) in items" :key="index" :span="Number(item.colSpan) || defaultColSpan">
        <el-form-item :label="item.label" :prop="item.prop">
          <component
            v-if="item.type !== 'custom'"
            :is="componentOf(item)"
            v-model="internalModel[item.prop]"
            v-bind="controlAttrs(item)"
            :placeholder="item.placeholder"
            @keyup.enter="onSearch"
          >
            <template v-if="item.type === 'select'">
              <el-option v-for="opt in item.options || []" :key="opt.value" :label="opt.label" :value="opt.value" />
            </template>
          </component>

          <slot v-else :name="item.slotName || item.prop" :model="internalModel" />
        </el-form-item>
      </el-col>

      <el-col v-if="showActions" :span="actionsColSpan || defaultColSpan">
        <div :class="['actions', actionsAlign]">
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
import { Search, Refresh } from '@element-plus/icons-vue'
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
    actionsColSpan?: number
    actionsAlign?: 'left' | 'right'
  }>(),
  {
    inline: true,
    showActions: true,
    gutter: 12,
    defaultColSpan: 6,
    actionsAlign: 'left'
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
const labelWidth = computed(() => props.labelWidth ?? undefined)
const gutter = computed(() => props.gutter)
const defaultColSpan = computed(() => props.defaultColSpan)
const actionsColSpan = computed(() => props.actionsColSpan ?? defaultColSpan.value)
const actionsAlign = computed(() => props.actionsAlign)

const internalModel = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', { ...v })
})

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
  const base = item.attrs || {}
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
  formRef.value?.resetFields()
  emit('reset')
}
</script>

<style scoped>
.actions {
  display: flex;
  gap: 8px;
}
.actions.right {
  justify-content: flex-end;
}
</style>
