<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="600px"
    :close-on-click-modal="false"
    @close="onClose"
  >
    <el-form ref="formRef" :model="localForm" :rules="rules" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="localForm.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="localForm.code" placeholder="请输入编码" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="localForm.status">
          <el-radio value="1"> 启用 </el-radio>
          <el-radio value="0"> 禁用 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="localForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close()"> 取消 </el-button>
      <el-button type="primary" :loading="loading" @click="onConfirm"> 确定 </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

export interface GoodsFormItem {
  id?: number
  name: string
  code: string
  status: string
  remark: string
}

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    loading?: boolean
    record?: Partial<GoodsFormItem> | null
  }>(),
  {
    title: '新增',
    loading: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm', v: GoodsFormItem): void
  (e: 'closed'): void
}>()

const formRef = ref<FormInstance>()
const visible = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})
const loading = computed(() => props.loading || false)
const title = computed(() => props.title || '')
const rules = computed<FormRules>(() => ({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}))

const localForm = ref<GoodsFormItem>({ id: undefined, name: '', code: '', status: '1', remark: '' })

watch(
  () => props.record,
  v => {
    if (v) {
      localForm.value = {
        id: v.id,
        name: v.name || '',
        code: v.code || '',
        status: (v.status as string) || '1',
        remark: v.remark || ''
      }
    } else {
      localForm.value = { id: undefined, name: '', code: '', status: '1', remark: '' }
    }
  },
  { immediate: true }
)

function close() {
  visible.value = false
}

function onClose() {
  emit('closed')
}

function onConfirm() {
  if (!formRef.value) return
  formRef.value.validate(valid => {
    if (!valid) return
    emit('confirm', { ...localForm.value })
  })
}
</script>

<style scoped></style>
