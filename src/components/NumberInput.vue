<template>
  <div class="number-input">
    <el-input-number
      v-model="innerValue"
      :min="min"
      :max="max"
      :step="step"
      :precision="precision"
      :placeholder="placeholder"
      :disabled="disabled"
      :controls="controls"
      @change="onChange"
      align="left"
    />
    <span v-if="unit" class="unit">{{ unit }}</span>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Number, String, undefined],
    default: undefined
  },
  unit: {
    type: String,
    default: '',
  },
  min: Number,
  max: Number,
  step: {
    type: Number,
    default: 1,
  },
  precision: {type: Number, default: 2},
  placeholder: String,
  disabled: Boolean,
  controls: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const innerValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    innerValue.value = val
  }
)

const onChange = (val) => {
  emit('update:modelValue', val)
  emit('change', val)
}
</script>

<style scoped lang="less">
.number-input {
  display: inline-flex;
  align-items: left;
  width: 260px;
  .el-input-number{
    width: 100%;
  }
}
.unit {
  margin-left: 8px;
  color: #606266;
  font-size: 14px;
  white-space: nowrap;
}
</style>
