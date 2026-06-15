# react-cascading-input

一个 Headless 的 React 级联输入组件，通过 Canvas 在父子层级间绘制关系线（贝塞尔曲线 / 折线），支持任意嵌套层级。

## 特性

- 🎨 **Canvas 关系线** — 自动在父子层级间绘制连接线，支持贝塞尔曲线和折线两种样式，可自定义颜色与粗细
- 🧩 **Headless 架构** — 每列通过 `render` prop 完全自定义渲染，自由集成任意 UI 库
- 📦 **零依赖** — 核心无第三方依赖，体积轻量
- ⚡ **无闪烁重绘** — 使用 `useLayoutEffect` + `ResizeObserver`，数据变更时关系线无感知更新
- 🔧 **TypeScript** — 完整类型支持
- 🎯 **React 18+** — 兼容 React 18 / 19

## 安装

```bash
npm install react-cascading-input
# 或
pnpm add react-cascading-input
```

## 基础用法

`render` 是 `ColumnConfig` 的必填字段，由你决定每列渲染什么控件：

```tsx
import { useState } from 'react';
import { CascadingInput } from 'react-cascading-input';
import 'react-cascading-input/styles';
import type { ColumnConfig } from 'react-cascading-input';

const columns: ColumnConfig[] = [
    {
        title: '训练任务',
        dataIndex: 'product',
        width: 120,
        hasAdd: true,
        render: ({ value, onChange, title }) => (
            <input
                placeholder={`请输入${title}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        ),
    },
    {
        title: '训练集群',
        dataIndex: 'region',
        width: 120,
        hasAdd: true,
        render: ({ value, onChange, title }) => (
            <input
                placeholder={`请输入${title}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        ),
    },
    {
        title: '框架版本',
        dataIndex: 'spec',
        width: 180,
        hasAdd: false,
        render: ({ value, onChange, title }) => (
            <input
                placeholder={`请输入${title}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        ),
    },
];

function App() {
    const [value, setValue] = useState([]);
    return <CascadingInput columns={columns} value={value} onChange={setValue} />;
}
```

## 自定义渲染

通过 `render` 可以渲染任意控件，比如 select：

```tsx
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
                <option value="guangzhou">广州</option>
            </select>
        ),
    },
];
```

## 连线样式

```tsx
{/* 折线风格 */}
<CascadingInput columns={columns} value={value} onChange={setValue} lineStyle="straight" />

{/* 自定义连线颜色和粗细 */}
<CascadingInput
    columns={columns}
    value={value}
    onChange={setValue}
    lineColor="#1890ff"
    lineWidth={2}
/>
```

## API

### CascadingInput Props

| Prop        | Type                          | Default     | Description      |
| ----------- | ----------------------------- | ----------- | ---------------- |
| `columns`   | `ColumnConfig[]`              | —           | 列配置（必填）   |
| `value`     | `TreeNode[]`                  | `[]`        | 树数据（受控）   |
| `onChange`  | `(value: TreeNode[]) => void` | —           | 数据变更回调     |
| `lineStyle` | `'straight' \| 'curve'`       | `'curve'`   | 关系线样式       |
| `lineColor` | `string`                      | `'#d9d9d9'` | 关系线颜色       |
| `lineWidth` | `number`                      | `1.5`       | 关系线粗细       |

### ColumnConfig

| Property    | Type                                    | Required | Description                          |
| ----------- | --------------------------------------- | -------- | ------------------------------------ |
| `title`     | `string`                                | ✓        | 列标题                               |
| `dataIndex` | `string`                                | ✓        | 数据字段名                           |
| `width`     | `number`                                | ✓        | 列宽度（px）                         |
| `hasAdd`    | `boolean`                               | ✓        | 是否显示"添加"按钮                   |
| `render`    | `(props: CellRenderProps) => ReactNode` | ✓        | 自定义单元格渲染                     |

### CellRenderProps

| Property    | Type                        | Description                  |
| ----------- | --------------------------- | ---------------------------- |
| `value`     | `string`                    | 当前单元格值                 |
| `onChange`  | `(val: string) => void`     | 值变更回调                   |
| `node`      | `TreeNode`                  | 当前树节点                   |
| `level`     | `number`                    | 当前层级索引                 |
| `path`      | `string[]`                  | 从根到当前节点的 id 路径     |
| `dataIndex` | `string`                    | 数据字段名                   |
| `title`     | `string`                    | 列标题                       |
| `hasAdd`    | `boolean`                   | 是否显示"添加"按钮           |
| `onAdd`     | `() => void`                | 添加同级节点回调             |
| `onDelete`  | `() => void`                | 删除节点回调（仅叶子层级）   |
| `isLeaf`    | `boolean`                   | 是否为叶子层级               |
| `width`     | `number`                    | 列宽度                       |
| `id`        | `string`                    | 节点 id                      |

### TreeNode

| Property        | Type         | Description                              |
| --------------- | ------------ | ---------------------------------------- |
| `id`            | `string`     | 唯一标识                                 |
| `children`      | `TreeNode[]` | 子节点列表                               |
| `[key: string]` | `any`        | 由 ColumnConfig.dataIndex 决定的动态字段 |

### LineStyle

```ts
type LineStyle = 'straight' | 'curve';
```

## 开发

```bash
# 安装依赖
pnpm install

# 启动文档开发服务器（含在线演示）
pnpm dev

# 运行测试
pnpm test

# 构建
pnpm build
```

## License

MIT
