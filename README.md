# react-cascading-input

一个 Headless 的 React 级联输入组件，通过 Canvas 在父子层级间绘制关系线（贝塞尔曲线 / 折线），支持任意嵌套层级。

## 特性

- 🎨 **Canvas 关系线** — 自动在父子层级间绘制连接线，支持贝塞尔曲线和折线两种样式
- 🧩 **Headless 架构** — 每列可通过 `ColumnConfig.render` 自定义单元格渲染，集成任意 UI 库
- 📦 **开箱即用** — 内置默认渲染器（原生 HTML），零依赖即可使用
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

使用默认渲染器（原生 HTML 控件，零 UI 库依赖）：

```tsx
import { CascadingInput } from 'react-cascading-input';
import 'react-cascading-input/styles';
import type { ColumnConfig } from 'react-cascading-input';

const columns: ColumnConfig[] = [
    { title: '训练任务', dataIndex: 'product', width: 120, hasAdd: true },
    { title: '训练集群', dataIndex: 'region', width: 120, hasAdd: true },
    { title: '框架版本', dataIndex: 'spec', width: 180, hasAdd: false },
];

function App() {
    const [value, setValue] = useState([]);
    return <CascadingInput columns={columns} value={value} onChange={setValue} lineStyle="curve" />;
}
```

## 自定义渲染

通过 `ColumnConfig.render` 自定义每列的单元格渲染，集成 antd 或其他 UI 库：

```tsx
import { CascadingInput } from 'react-cascading-input';
import 'react-cascading-input/styles';
import type { CellRenderProps, ColumnConfig } from 'react-cascading-input';
import { Input, Select } from 'antd';

const columns: ColumnConfig[] = [
    {
        title: '训练任务',
        dataIndex: 'product',
        width: 160,
        hasAdd: true,
        render: (props: CellRenderProps) => (
            <Input value={props.value} onChange={(e) => props.onChange(e.target.value)} />
        ),
    },
    {
        title: '训练集群',
        dataIndex: 'region',
        width: 140,
        hasAdd: true,
        render: (props: CellRenderProps) => (
            <Select
                value={props.value || undefined}
                onChange={(val) => props.onChange(val)}
                options={[
                    { label: '北京', value: 'beijing' },
                    { label: '上海', value: 'shanghai' },
                ]}
                style={{ width: '100%' }}
            />
        ),
    },
    // 不设 render 的列使用默认渲染器（原生 input）
    { title: '框架版本', dataIndex: 'spec', width: 180, hasAdd: false },
];

<CascadingInput columns={columns} value={value} onChange={setValue} />;
```

## Select 类型

使用内置的 select 默认渲染器（需设置 `type: 'select'` 和 `options`）：

```tsx
const columns: ColumnConfig[] = [
    {
        title: '训练阶段',
        dataIndex: 'scene',
        width: 140,
        hasAdd: false,
        type: 'select',
        options: [
            { label: '预处理', value: 'preprocess' },
            { label: '训练中', value: 'training' },
            { label: '评估', value: 'eval' },
        ],
    },
];
```

## API

### CascadingInput Props

| Prop        | Type                          | Default     | Description      |
| ----------- | ----------------------------- | ----------- | ---------------- |
| `value`     | `TreeNode[]`                  | `[]`        | 树数据（受控）   |
| `onChange`  | `(value: TreeNode[]) => void` | -           | 数据变更回调     |
| `columns`   | `ColumnConfig[]`              | -           | 列配置（必填）   |
| `lineStyle` | `'straight' \| 'curve'`       | `'curve'`   | 关系线样式       |
| `lineColor` | `string`                      | `'#d9d9d9'` | 关系线颜色       |
| `lineWidth` | `number`                      | `1.5`       | 关系线粗细       |

### ColumnConfig

| Property     | Type                                    | Default | Description                          |
| ------------ | --------------------------------------- | ------- | ------------------------------------ |
| `title`      | `string`                                | -       | 列标题                               |
| `dataIndex`  | `string`                                | -       | 数据字段名                           |
| `type`       | `'input' \| 'select'`                   | -       | 输入类型（默认渲染器使用）           |
| `width`      | `number`                                | -       | 列宽度（px）                         |
| `hasAdd`     | `boolean`                               | -       | 是否显示"添加"按钮                   |
| `render`     | `(props: CellRenderProps) => ReactNode` | -       | 自定义单元格渲染                     |
| `options`    | `Array<{ label: string; value: string }>` | -    | type='select' 时的选项列表           |
| `inputProps` | `Record<string, unknown>`               | -       | 透传给默认渲染器内部 input 的额外属性 |

### CellRenderProps

| Property    | Type       | Description                              |
| ----------- | ---------- | ---------------------------------------- |
| `value`     | `string`   | 当前单元格值                             |
| `onChange`  | `(val: string) => void` | 值变更回调                 |
| `node`      | `TreeNode` | 当前树节点                               |
| `level`     | `number`   | 当前层级索引                             |
| `path`      | `string[]` | 从根到当前节点的 id 路径                 |
| `dataIndex` | `string`   | 数据字段名                               |
| `title`     | `string`   | 列标题                                   |
| `hasAdd`    | `boolean`  | 是否显示"添加"按钮                       |
| `onAdd`     | `() => void` | 添加同级节点回调                       |
| `onDelete`  | `() => void` | 删除节点回调（仅叶子层级）             |
| `isLeaf`    | `boolean`  | 是否为叶子层级                           |
| `width`     | `number`   | 列宽度                                   |
| `id`        | `string`   | 节点 id                                  |

### TreeNode

| Property        | Type         | Description                              |
| --------------- | ------------ | ---------------------------------------- |
| `id`            | `string`     | 唯一标识                                 |
| `children`      | `TreeNode[]` | 子节点列表                               |
| `[key: string]` | `any`        | 由 ColumnConfig.dataIndex 决定的动态字段 |

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 运行测试
pnpm test

# 构建
pnpm build
```

## License

MIT
