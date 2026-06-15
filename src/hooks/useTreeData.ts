import { useCallback } from 'react';
import type { ColumnConfig, TreeNode } from '../types';

const genId = (): string => Math.random().toString(36).substring(2, 9);

/** 生成从指定层级到底的完整链 */
export const createChain = (columns: ColumnConfig[], level: number): TreeNode => {
    const col = columns[level];
    const node: TreeNode = { id: genId() };
    node[col.dataIndex] = undefined;
    if (level < columns.length - 1) {
        node.children = [createChain(columns, level + 1)];
    } else {
        node.children = [];
    }
    return node;
};

/** 更新指定路径节点的某个字段值 */
export const updateTreeValue = (nodes: TreeNode[], path: string[], val: string, dataIndex: string): TreeNode[] => {
    const currentId = path[0];
    return nodes.map((node) => {
        if (node.id === currentId) {
            if (path.length === 1) {
                return { ...node, [dataIndex]: val };
            }
            return { ...node, children: updateTreeValue(node.children || [], path.slice(1), val, dataIndex) };
        }
        return node;
    });
};

/** 在指定路径的节点后添加同级节点 */
export const addSiblingNode = (
    nodes: TreeNode[],
    path: string[],
    level: number,
    columns: ColumnConfig[],
): TreeNode[] => {
    const targetId = path[0];
    if (path.length === 1) {
        const index = nodes.findIndex((n) => n.id === targetId);
        if (index !== -1) {
            const nextNodes = [...nodes];
            nextNodes.splice(index + 1, 0, createChain(columns, level));
            return nextNodes;
        }
        return nodes;
    }
    return nodes.map((node) => {
        if (node.id === targetId) {
            return { ...node, children: addSiblingNode(node.children || [], path.slice(1), level, columns) };
        }
        return node;
    });
};

/** 删除指定路径的节点 */
export const deleteNodeCascade = (nodes: TreeNode[], path: string[]): TreeNode[] => {
    const targetId = path[0];
    if (path.length === 1) {
        return nodes.filter((n) => n.id !== targetId);
    }
    return nodes.map((node) => {
        if (node.id === targetId) {
            return { ...node, children: deleteNodeCascade(node.children || [], path.slice(1)) };
        }
        return node;
    });
};

/** 初始化空数据时创建默认链 */
export const ensureInitialData = (
    value: TreeNode[] | undefined,
    columns: ColumnConfig[],
    onChange?: (value: TreeNode[]) => void,
): void => {
    if ((!value || value.length === 0) && columns.length > 0) {
        onChange?.([createChain(columns, 0)]);
    }
};

/**
 * 自定义 Hook：封装树数据的所有操作方法
 */
export const useTreeData = (
    value: TreeNode[],
    onChange: ((value: TreeNode[]) => void) | undefined,
    columns: ColumnConfig[],
) => {
    const handleValueChange = useCallback(
        (path: string[], val: string, dataIndex: string) => {
            onChange?.(updateTreeValue(value, path, val, dataIndex));
        },
        [value, onChange],
    );

    const handleAdd = useCallback(
        (path: string[], level: number) => {
            onChange?.(addSiblingNode(value, path, level, columns));
        },
        [value, onChange, columns],
    );

    const handleDelete = useCallback(
        (path: string[]) => {
            const nextValue = deleteNodeCascade(value, path);
            if (nextValue.length === 0) {
                onChange?.([createChain(columns, 0)]);
            } else {
                onChange?.(nextValue);
            }
        },
        [value, onChange, columns],
    );

    return {
        handleValueChange,
        handleAdd,
        handleDelete,
    };
};
