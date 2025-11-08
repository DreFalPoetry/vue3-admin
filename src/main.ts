import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import NumberInput from '@/components/NumberInput.vue'
import RichEditor from '@/components/RichEditor.vue'
import '@/styles/index.less'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

// Preload auth from cookies before router guards
app.use(pinia)
useUserStore(pinia).loadFromStorage()
app.use(router)
app.use(ElementPlus)
app.component('NumberInput', NumberInput)
app.component('RichEditor', RichEditor)

app.mount('#app')
