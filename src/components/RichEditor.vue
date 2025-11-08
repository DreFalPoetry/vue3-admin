<template>
  <editor v-model="content" :init="init" :tinymceScriptSrc="tinymceScriptSrc" />
</template>

<script setup>
import { ref, watch } from 'vue'
import Editor from '@tinymce/tinymce-vue'
import tinymce from 'tinymce/tinymce' //告诉组件使用本地 tinymce

// 指向 public 下的脚本（相对于网站根目录）
const tinymceScriptSrc = '/tinymce/tinymce.min.js'

const props = defineProps({
  modelValue: String,
  height: {
    type: Number,
    default: 500
  }
})
const emit = defineEmits(['update:modelValue'])
const content = ref(props.modelValue)

watch(
  () => props.modelValue,
  val => {
    if (val !== content.value) content.value = val
  }
)
watch(content, val => emit('update:modelValue', val))

//TinyMCE 初始化配置
const init = {
  selector: 'textarea',
  license_key: 'gpl', // 关键！声明 GPL 开源许可
  width: '100%',
  height: props.height,
  menubar: true,
  language_url: '/tinymce/langs/zh_CN.js',
  language: 'zh_CN',
  skin_url: '/tinymce/skins/ui/oxide',
  content_css: '/tinymce/skins/content/default/content.css',
  plugins: 'lists link image table code fullscreen preview',
  toolbar:
    'undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | code fullscreen preview',
  branding: false,
  base_url: '/tinymce', //通知 TinyMCE 插件/皮肤从哪里加载
  suffix: '.min'
}
</script>
