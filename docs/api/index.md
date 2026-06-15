# API

## CascadingInput

| Prop | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `columns` | `ColumnConfig[]` | — | 列配置，必填 |
| `value` | `TreeNode[]` | `[]` | 受控数据 |
| `onChange` | `(value: TreeNode[]) => void` | — | 数据变更回调 |
| `line` | `LineConfig` | `{}` | 连线配置 |

## ColumnConfig

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `title` | `string` | ✓ | 列标题，同时作为默认 placeholder 的一部分 |
| `dataIndex` | `string` | ✓ | 对应 `TreeNode` 上的字段名 |
| `width` | `number` | ✓ | 列宽（px） |
| `hasAdd` | `boolean` | ✓ | 是否在该列显示"添加同级"按钮 |
| `render` | `(props: CellRenderProps) => ReactNode` | ✓ | 自定义渲染函数，必填 |
| `addRender` | `(props: ActionRenderProps) => ReactNode` | | 自定义"添加"按钮渲染，位置固定在单元格下方。不传则使用默认样式 |
| `deleteRender` | `(props: ActionRenderProps) => ReactNode` | | 自定义"删除"按钮渲染（仅叶子层级），位置固定在行末尾。不传则使用默认样式 |

## LineConfig

| 字段 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `style` | `'curve' \| 'straight'` | `'curve'` | 连线风格 |
| `color` | `string` | `'#d9d9d9'` | 连线颜色 |
| `width` | `number` | `1.5` | 连线粗细（px） |
| `showSource` | `boolean \| SourceAnimationOptions` | `false` | 溯源动画配置 |

## SourceAnimationOptions

`line.showSource` 设为对象时可自定义粒子动画：

| 字段 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `color` | `string` | 跟随 `line.color` | 粒子颜色 |
| `minRadius` | `number` | `2.5` | 粒子最小半径 |
| `maxRadius` | `number` | `4` | 粒子最大半径 |
| `breatheCycle` | `number` | `400` | 呼吸周期（ms） |
| `breatheAmplitude` | `number` | `1` | 呼吸幅度 0~1 |
| `speed` | `number` | `0.004` | 动画速度 |



## CellRenderProps

`render` 函数接收的参数：

| 字段 | 类型 | 说明 |
|---|---|---|
| `value` | `string` | 当前单元格的值 |
| `onChange` | `(val: string) => void` | 更新当前单元格值的回调（已绑定路径） |
| `node` | `TreeNode` | 当前树节点的完整数据，可访问 `node.children` 等 |
| `level` | `number` | 当前层级索引（0 开始），常用于区分不同层级的样式 |
| `dataIndex` | `string` | 当前列的 dataIndex，同一 render 函数服务多列时可区分字段 |
| `title` | `string` | 当前列的标题 |
| `onAdd` | `() => void` | 添加同级节点（已绑定路径和层级） |
| `onDelete` | `() => void` | 删除当前行（仅叶子层级有效） |
| `isLeaf` | `boolean` | 是否为最后一列（叶子层级），常用于给末列加特殊样式 |
| `width` | `number` | 当前列宽（px），可用于计算内部元素尺寸 |

## ActionRenderProps

`addRender` / `deleteRender` 函数接收的参数：

| 字段 | 类型 | 说明 |
|---|---|---|
| `onClick` | `() => void` | 点击回调，触发添加或删除操作 |

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
