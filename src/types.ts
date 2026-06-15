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

/** 溯源动画配置 */
export interface SourceAnimationOptions {
    /** 粒子颜色，默认跟随 line.color */
    color?: string;
    /** 粒子最小半径，默认 2.5 */
    minRadius?: number;
    /** 粒子最大半径，默认 4 */
    maxRadius?: number;
    /** 呼吸周期（ms），默认 400 */
    breatheCycle?: number;
    /** 呼吸幅度 0~1，默认 1 */
    breatheAmplitude?: number;
    /** 动画速度，默认 0.004 */
    speed?: number;
}

/** 连线配置 */
export interface LineConfig {
    /** 连线风格，默认 'curve' */
    style?: LineStyle;
    /** 连线颜色，默认 '#d9d9d9' */
    color?: string;
    /** 连线粗细，默认 1.5 */
    width?: number;
    /** 溯源动画，false 或不传不开启，true 使用默认配置，对象可自定义 */
    showSource?: boolean | SourceAnimationOptions;
}

/** 每个单元格的渲染回调参数 */
export interface CellRenderProps {
    /** 当前单元格值 */
    value: string;
    /** 值变更回调（已绑定 path + dataIndex） */
    onChange: (val: string) => void;
    /** 当前树节点，可访问 node.children 等信息 */
    node: TreeNode;
    /** 当前层级索引（0 开始） */
    level: number;
    /** 数据字段名 */
    dataIndex: string;
    /** 列标题 */
    title: string;
    /** 添加同级节点回调（已绑定 path + level） */
    onAdd: () => void;
    /** 删除节点回调（仅叶子层级，已绑定 path） */
    onDelete: () => void;
    /** 是否为叶子层级 */
    isLeaf: boolean;
    /** 列宽度（px） */
    width: number;
}

/** 操作按钮渲染参数 */
export interface ActionRenderProps {
    /** 点击回调 */
    onClick: () => void;
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
    /** 自定义"添加"按钮渲染，位置固定在单元格下方。不传则使用默认样式 */
    addRender?: (props: ActionRenderProps) => ReactNode;
    /** 自定义"删除"按钮渲染（仅叶子层级生效），位置固定在行末尾。不传则使用默认样式 */
    deleteRender?: (props: ActionRenderProps) => ReactNode;
}

/** CascadingInput 组件 Props */
export interface CascadingInputProps {
    /** 树数据（受控） */
    value?: TreeNode[];
    /** 数据变更回调 */
    onChange?: (value: TreeNode[]) => void;
    /** 列配置 */
    columns: ColumnConfig[];
    /** 连线配置 */
    line?: LineConfig;
}
