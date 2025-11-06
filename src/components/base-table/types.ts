export interface TableColumn {
  label: string
  prop: string
  width?: string | number
  minWidth?: string | number
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  fixed?: boolean | 'left' | 'right'
  sortable?: boolean | 'custom'
  formatter?: (row: any, column: any, cellValue: any, index: number) => string
  show?: boolean
  slot?: string
  headerSlot?: string
  widget?: 'span' | 'priceformat' | 'popover' | string // <-- 新增字段
  widgetProps?: Record<string, any> // 可传额外参数
}
