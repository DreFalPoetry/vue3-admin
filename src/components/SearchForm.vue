<template>
  <el-form ref="formRef" :model="localModel" :inline="inline" class="search-form" :label-width="labelWidth">
    <el-row :gutter="gutter">
      <el-col v-for="(item, index) in items" :key="index" :span="Number(item.colSpan) || defaultColSpan">
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
              <el-option v-for="opt in item.options || []" :key="opt.value" :label="opt.label" :value="opt.value" />
            </template>
          </component>

          <slot v-else :name="item.slotName || item.prop" :model="localModel" />
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
