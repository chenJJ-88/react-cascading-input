# 自定义渲染

每列的 `render` 是**必填**字段，返回任意 React 节点，完全由你决定渲染什么控件。

## render 函数签名

```ts
render: (props: CellRenderProps) => ReactNode
```

`CellRenderProps` 包含操作当前单元格所需的全部信息，详见 [API](/api/)。

## 使用原生 input / select

```tsx
import { CascadingInput } from 'react-cascading-input';
import type { ColumnConfig } from 'react-cascading-input';

const columns: ColumnConfig[] = [
  {
    title: '训练任务',
    dataIndex: 'product',
    width: 160,
    hasAdd: true,
    render: ({ value, onChange, title }) => (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`请输入${title}`}
      />
    ),
  },
  {
    title: '训练集群',
    dataIndex: 'region',
    width: 140,
    hasAdd: true,
    render: ({ value, onChange, title }) => (
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%' }}
      >
        <option value="">请选择{title}</option>
        <option value="beijing">北京</option>
        <option value="shanghai">上海</option>
      </select>
    ),
  },
];
```

## 在 render 中自定义操作按钮

`CellRenderProps` 同时暴露了 `onAdd`、`onDelete`、`hasAdd`、`isLeaf`，你可以在 `render` 里自行排布：

```tsx
render: ({ value, onChange, title, hasAdd, onAdd, isLeaf, onDelete }) => (
  <div>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`请输入${title}`}
    />
    {hasAdd && <button onClick={onAdd}>+ 添加</button>}
    {isLeaf && <button onClick={onDelete}>删除</button>}
  </div>
),
```

> 组件默认在单元格下方渲染"添加"按钮，在行末尾渲染"删除"按钮。你可以通过 `addRender` 和 `deleteRender` 自定义按钮样式，但按钮位置由组件固定控制。

## 性能提示

当前组件采用完全受控模式（`value` + `onChange`），每次输入都会触发状态更新。对于常见的级联输入场景（几十行数据），这不会成为性能瓶颈。

如果数据量非常大，建议在 `render` 中使用非受控组件（如 `defaultValue` + `ref`），或用 `React.memo` 包裹渲染函数，避免不必要的重渲染。
