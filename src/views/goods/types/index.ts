// 类型定义
export interface TableItem {
  id: number
  name: string
  code: string
  status: string
  createTime: string
  [key: string]: unknown
}

export interface FormItem {
  id?: number
  name: string
  code: string
  status: string
  remark: string
}
