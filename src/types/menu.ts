import type { Component } from 'vue'

export interface MenuItem {
  path: string
  name: string
  icon?: Component | string
  children?: MenuItem[]
  meta?: {
    title?: string
    hidden?: boolean
    [key: string]: unknown
  }
}

