# 快速开始

## 安装

```bash
npm install react-cascading-input
# or
pnpm add react-cascading-input
```

## 引入样式

```ts
import 'react-cascading-input/styles';
```

## 基础用法

`render` 是必填字段，由你决定每列渲染什么控件。

```tsx
import { useState } from 'react';
import { CascadingInput } from 'react-cascading-input';
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

export function App() {
  const [value, setValue] = useState([]);
  return <CascadingInput columns={columns} value={value} onChange={setValue} />;
}
```

## 本地运行 Demo

```bash
git clone https://github.com/chenJJ-88/react-cascading-input.git
cd react-cascading-input
pnpm install
pnpm dev
```

## 数据结构

`value` 是一个 `TreeNode[]`，每个节点的结构为：

```ts
interface TreeNode {
  id: string;           // 自动生成，唯一标识
  children?: TreeNode[];
  [dataIndex: string]: any; // 每列的值，key 来自 ColumnConfig.dataIndex
}
```

示例数据：

```json
[
  {
    "id": "a1b2c3",
    "product": "GPT-4",
    "children": [
      {
        "id": "d4e5f6",
        "region": "北京",
        "children": [
          { "id": "g7h8i9", "spec": "PyTorch 2.0", "children": [] }
        ]
      }
    ]
  }
]
```
