<template>
  <div class="login-page">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">登录</div>
      </template>
      <el-form :model="form" label-width="80px" @keyup.enter="onSubmit">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="admin" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" placeholder="123456" show-password />
        </el-form-item>
        <el-form-item>
          <el-button class="login-submit" type="primary" :loading="loading" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const user = useUserStore()

const form = reactive({ username: 'admin', password: '123456' })
const loading = ref(false)

async function onSubmit() {
  try {
    loading.value = true
    // Demo: fake api login, return mock token
    await new Promise(r => setTimeout(r, 600))
    user.login('mock-token-' + Date.now(), form.username)
    const redirect = (route.query.redirect as string) || '/'
    router.replace(redirect)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="less" scoped>
.login-page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 360px;
}

.login-submit {
  width: 100%;
}
</style>
