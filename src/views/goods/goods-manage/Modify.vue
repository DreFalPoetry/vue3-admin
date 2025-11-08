<template>
  <div class="page-main">
    <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-change="handleChange">
      <el-tab-pane label="基础信息" name="basic"></el-tab-pane>
      <el-tab-pane label="供应商/发票信息" name="supplier"></el-tab-pane>
      <el-tab-pane label="规格参数" name="specification"></el-tab-pane>
      <el-tab-pane label="商品详情" name="detail"></el-tab-pane>
      <el-tab-pane label="其他设置" name="other"></el-tab-pane>
    </el-tabs>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto">
      <div class="section-wrapper">
        <div class="c-section-header">基础信息</div>
        <div class="c-section-content">
          <el-form-item label="商品类型：" prop="resource">
            <el-radio-group v-model="ruleForm.resource">
              <el-radio value="Sponsorship">水票商品</el-radio>
              <el-radio value="Venue">桶押金商品</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="商品名称：" prop="name">
            <el-input v-model="ruleForm.name" />
          </el-form-item>
          <el-form-item label="商品类目：" prop="region">
            <el-select v-model="ruleForm.region" placeholder="Activity zone">
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
          <div class="brand-line">
            <el-form-item label="品牌：" prop="region">
              <el-select v-model="ruleForm.region" placeholder="Activity zone">
                <el-option label="Zone one" value="shanghai" />
                <el-option label="Zone two" value="beijing" />
              </el-select>
            </el-form-item>
            <el-form-item label=" " prop="region" :label-width="10">
              <el-select v-model="ruleForm.region" placeholder="Activity zone">
                <el-option label="Zone one" value="shanghai" />
                <el-option label="Zone two" value="beijing" />
              </el-select>
            </el-form-item>
            <el-form-item label=" " prop="region" :label-width="10">
              <el-select v-model="ruleForm.region" placeholder="Activity zone">
                <el-option label="Zone one" value="shanghai" />
                <el-option label="Zone two" value="beijing" />
              </el-select>
            </el-form-item>
          </div>
        </div>
        <el-divider />
        <div class="c-section-header">供应商/发票信息</div>
        <div class="c-section-content">
          <el-form-item label="供应商：" prop="count">
            <el-select-v2
              v-model="ruleForm.count"
              placeholder="Activity count"
              :options="options"
            />
          </el-form-item>
          <el-form-item label="是否开票：" prop="region">
            <el-select v-model="ruleForm.region" placeholder="Activity zone">
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="进项—税收分类编码简称：" prop="name">
                <el-input v-model="ruleForm.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label=" 进项—税收编码：" prop="name">
                <el-input v-model="ruleForm.name" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="进项—发票税率：" prop="name">
            <el-input v-model="ruleForm.name" />
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="进项—税收分类编码简称：" prop="name">
                <el-input v-model="ruleForm.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label=" 进项—税收编码：" prop="name">
                <el-input v-model="ruleForm.name" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="进项—发票税率：" prop="name">
            <el-input v-model="ruleForm.name" />
          </el-form-item>
        </div>
        <el-divider />
        <div class="c-section-header">规格参数</div>
        <div class="c-section-content">
          <el-form-item label="商品规格：" >
            <el-button type="primary" @click="handleManageGoodsSpec">管理商品规格</el-button>
          </el-form-item>
          <el-form-item label="是否需要空桶回收：" prop="needRecycle">
            <el-radio-group v-model="ruleForm.needRecycle">
              <el-radio value="1"> 是 </el-radio>
              <el-radio value="0"> 否 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="单次配送费用：" prop="deliveryFee">
            <number-input v-model="ruleForm.deliveryFee" unit="元" />
          </el-form-item>
          <el-form-item label="水票有效期：" prop="waterTicketValidity">
            <el-radio-group v-model="ruleForm.waterTicketValidity">
              <el-radio value="1"> 永久有效 </el-radio>
              <el-radio value="0"> 固定有效期 </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
         <el-divider />
        <div class="c-section-header">商品详情</div>
        <div class="c-section-content"> 
          <rich-editor v-model="ruleForm.desc" />
        </div>
        <div class="c-section-footer">
          <el-button @click="resetForm(ruleFormRef)">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)"> 保存 </el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { TabPaneName, FormInstance, FormRules } from 'element-plus'

interface RuleForm {
  name: string
  region: string
  count: string
  date1: string
  date2: string
  delivery: boolean
  location: string
  type: string[]
  resource: string
  desc: string
  needRecycle: string,
  deliveryFee: number | undefined,
  waterTicketValidity: string,
}

const props = defineProps({
  pageAction: {
    type: String,
    required: true
  }
})

const options = Array.from({ length: 10000 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`
}))

const locationOptions = ['Home', 'Company', 'School']

const activeName = ref('basic')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  name: 'Hello',
  region: '',
  count: '',
  date1: '',
  date2: '',
  delivery: false,
  location: '',
  type: [],
  resource: '',
  desc: '',
  needRecycle: '0',
  deliveryFee: undefined,
  waterTicketValidity: '1'
})

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
  ],
  region: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'change'
    }
  ],
  count: [
    {
      required: true,
      message: 'Please select Activity count',
      trigger: 'change'
    }
  ],
  date1: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a date',
      trigger: 'change'
    }
  ],
  date2: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a time',
      trigger: 'change'
    }
  ],
  location: [
    {
      required: true,
      message: 'Please select a location',
      trigger: 'change'
    }
  ],
  type: [
    {
      type: 'array',
      required: true,
      message: 'Please select at least one activity type',
      trigger: 'change'
    }
  ],
  resource: [
    {
      required: true,
      message: 'Please select activity resource',
      trigger: 'change'
    }
  ],
  desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }]
})

const handleChange = (name: TabPaneName) => {
  console.log(name)
}

const handleManageGoodsSpec = () => {
  console.log('管理商品规格')
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style lang="less" scoped>
.brand-line {
  display: flex;
  .el-select {
    width: 200px;
  }
}
</style>
