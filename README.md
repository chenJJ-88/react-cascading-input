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

通过 `render` 可以渲染任意控件，比如 select，亦或者第三方 UI 库中的组件。

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

所有连线相关配置通过 `line` prop 统一管理：

```tsx
{/* 折线风格 */}
<CascadingInput columns={columns} value={value} onChange={setValue} line={{ style: 'straight' }} />

{/* 自定义连线颜色和粗细 */}
<CascadingInput
    columns={columns}
    value={value}
    onChange={setValue}
    line={{ color: '#1890ff', width: 2 }}
/>

{/* 开启溯源动画 */}
<CascadingInput
    columns={columns}
    value={value}
    onChange={setValue}
    line={{ showSource: true }}
/>
```

## API

### CascadingInput Props

| Prop        | Type                          | Default     | Description      |
| ----------- | ----------------------------- | ----------- | ---------------- |
| `columns`   | `ColumnConfig[]`              | —           | 列配置（必填）   |
| `value`     | `TreeNode[]`                  | `[]`        | 树数据（受控）   |
| `onChange`  | `(value: TreeNode[]) => void` | —           | 数据变更回调     |
| `line`      | `LineConfig`                  | `{}`        | 连线配置         |

### LineConfig

| Property     | Type                                    | Default     | Description                          |
| ------------ | --------------------------------------- | ----------- | ------------------------------------ |
| `style`      | `'straight' \| 'curve'`                 | `'curve'`   | 连线风格                             |
| `color`      | `string`                                | `'#d9d9d9'` | 连线颜色                             |
| `width`      | `number`                                | `1.5`       | 连线粗细                             |
| `showSource` | `boolean \| SourceAnimationOptions`      | `false`     | 溯源动画，粒子从子节点流向父节点     |

### SourceAnimationOptions

`line.showSource` 设为对象时可自定义粒子动画：

| Property          | Type     | Default         | Description      |
| ----------------- | -------- | --------------- | ---------------- |
| `color`           | `string` | 跟随 `line.color` | 粒子颜色       |
| `minRadius`       | `number` | `2.5`           | 粒子最小半径     |
| `maxRadius`       | `number` | `4`             | 粒子最大半径     |
| `breatheCycle`    | `number` | `400`           | 呼吸周期（ms）   |
| `breatheAmplitude`| `number` | `1`             | 呼吸幅度 0~1     |
| `speed`           | `number` | `0.004`         | 动画速度         |

### ColumnConfig

| Property    | Type                                    | Required | Description                          |
| ----------- | --------------------------------------- | -------- | ------------------------------------ |
| `title`     | `string`                                | ✓        | 列标题                               |
| `dataIndex` | `string`                                | ✓        | 数据字段名                           |
| `width`     | `number`                                | ✓        | 列宽度（px）                         |
| `hasAdd`    | `boolean`                               | ✓        | 是否显示"添加"按钮                   |
| `render`    | `(props: CellRenderProps) => ReactNode` | ✓        | 自定义单元格渲染                     |
| `addRender`    | `(props: ActionRenderProps) => ReactNode` |        | 自定义"添加"按钮渲染，位置固定在单元格下方 |
| `deleteRender` | `(props: ActionRenderProps) => ReactNode` |        | 自定义"删除"按钮渲染（仅叶子层级），位置固定在行末尾 |

### CellRenderProps

| Property    | Type                        | Description                  |
| ----------- | --------------------------- | ---------------------------- |
| `value`     | `string`                    | 当前单元格值                 |
| `onChange`  | `(val: string) => void`     | 值变更回调                   |
| `node`      | `TreeNode`                  | 当前树节点，可访问 `node.children` 等 |
| `level`     | `number`                    | 当前层级索引（0 开始）       |
| `dataIndex` | `string`                    | 数据字段名                   |
| `title`     | `string`                    | 列标题                       |
| `onAdd`     | `() => void`                | 添加同级节点回调             |
| `onDelete`  | `() => void`                | 删除节点回调（仅叶子层级）   |
| `isLeaf`    | `boolean`                   | 是否为叶子层级               |
| `width`     | `number`                    | 列宽度（px）                 |

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
