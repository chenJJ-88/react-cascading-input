import type { ReactNode } from 'react';

/** 树节点数据结构 */
export interface TreeNode {
    /** 唯一标识 */
    id: string;
    /** 子节点列表 */
    children?: TreeNode[];
    /** 动态字段（由 ColumnConfig.dataIndex 决定 key） */
    [key: string]: any;
}

/** 关系线样式 */
export type LineStyle = 'straight' | 'curve';

/** 每个单元格的渲染回调参数 */
export interface CellRenderProps {
    /** 当前单元格值 */
    value: string;
    /** 值变更回调（已绑定 path + dataIndex） */
    onChange: (val: string) => void;
    /** 当前树节点 */
    node: TreeNode;
    /** 当前层级索引 */
    level: number;
    /** 从根到当前节点的 id 路径 */
    path: string[];
    /** 数据字段名 */
    dataIndex: string;
    /** 列标题 */
    title: string;
    /** 是否显示"添加"按钮 */
    hasAdd: boolean;
    /** 添加同级节点回调（已绑定 path + level） */
    onAdd: () => void;
    /** 删除节点回调（仅叶子层级，已绑定 path） */
    onDelete: () => void;
    /** 是否为叶子层级 */
    isLeaf: boolean;
    /** 列宽度 */
    width: number;
    /** 节点 id（Canvas 连线依赖 `data-cell-id` 属性） */
    id: string;
}

/** 列配置 */
export interface ColumnConfig {
    /** 列标题 */
    title: string;
    /** 数据字段名 */
    dataIndex: string;
    /** 列宽度（px） */
    width: number;
    /** 该层级是否显示"添加"按钮 */
    hasAdd: boolean;
    /** 自定义单元格渲染，接收 CellRenderProps，返回 ReactNode */
    render: (props: CellRenderProps) => ReactNode;
}

/** CascadingInput 组件 Props */
export interface CascadingInputProps {
    /** 树数据（受控） */
    value?: TreeNode[];
    /** 数据变更回调 */
    onChange?: (value: TreeNode[]) => void;
    /** 列配置 */
    columns: ColumnConfig[];
    /** 关系线样式，默认 'curve' */
    lineStyle?: LineStyle;
    /** 关系线颜色，默认 '#d9d9d9' */
    lineColor?: string;
    /** 关系线粗细，默认 1.5 */
    lineWidth?: number;
}
