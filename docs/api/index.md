# API

## CascadingInput

| Prop | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `columns` | `ColumnConfig[]` | — | 列配置，必填 |
| `value` | `TreeNode[]` | `[]` | 受控数据 |
| `onChange` | `(value: TreeNode[]) => void` | — | 数据变更回调 |
| `lineStyle` | `'curve' \| 'straight'` | `'curve'` | 连线风格 |
| `lineColor` | `string` | `'#d9d9d9'` | 连线颜色 |
| `lineWidth` | `number` | `1.5` | 连线粗细（px） |

## ColumnConfig

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `title` | `string` | ✓ | 列标题，同时作为默认 placeholder 的一部分 |
| `dataIndex` | `string` | ✓ | 对应 `TreeNode` 上的字段名 |
| `width` | `number` | ✓ | 列宽（px） |
| `hasAdd` | `boolean` | ✓ | 是否在该列显示"添加同级"按钮 |
| `render` | `(props: CellRenderProps) => ReactNode` | ✓ | 自定义渲染函数，必填 |

## CellRenderProps

`render` 函数接收的参数：

| 字段 | 类型 | 说明 |
|---|---|---|
| `value` | `string` | 当前单元格的值 |
| `onChange` | `(val: string) => void` | 更新当前单元格值的回调（已绑定路径） |
| `node` | `TreeNode` | 当前树节点的完整数据 |
| `level` | `number` | 当前层级索引（0 开始） |
| `path` | `string[]` | 从根到当前节点的 id 路径 |
| `dataIndex` | `string` | 当前列的 dataIndex |
| `title` | `string` | 当前列的标题 |
| `hasAdd` | `boolean` | 是否显示添加按钮 |
| `onAdd` | `() => void` | 添加同级节点（已绑定路径和层级） |
| `onDelete` | `() => void` | 删除当前行（仅叶子层级有效） |
| `isLeaf` | `boolean` | 是否为最后一列（叶子层级） |
| `width` | `number` | 当前列宽 |
| `id` | `string` | 当前节点 id（Canvas 连线依赖 `data-cell-id` 属性） |

## TreeNode

```ts
interface TreeNode {
  id: string;
  children?: TreeNode[];
  [dataIndex: string]: any;
}
```

## LineStyle

```ts
type LineStyle = 'straight' | 'curve';
```
