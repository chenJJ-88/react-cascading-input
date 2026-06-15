import type React from 'react';
import { useEffect, useRef } from 'react';
import { useCanvasLines } from './hooks/useCanvasLines';
import type { CascadingInputProps, ColumnConfig, TreeNode } from './types';

const genId = () => Math.random().toString(36).substring(2, 9);

const createChain = (columns: ColumnConfig[], level: number): TreeNode => {
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

export const CascadingInput: React.FC<CascadingInputProps> = ({
    value = [],
    onChange,
    columns,
    lineStyle = 'curve',
    lineColor = '#d9d9d9',
    lineWidth = 1.5,
    showSource = false,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if ((!value || value.length === 0) && columns.length > 0) {
            onChange?.([createChain(columns, 0)]);
        }
    }, [value, columns, onChange]);

    useCanvasLines({
        canvasRef,
        containerRef,
        value,
        lineStyle,
        lineColor,
        lineWidth,
        showSource,
    });

    const updateTreeValue = (nodes: TreeNode[], path: string[], val: string, dataIndex: string): TreeNode[] => {
        const currentId = path[0];
        return nodes.map((node) => {
            if (node.id === currentId) {
                if (path.length === 1) { return { ...node, [dataIndex]: val }; }
                return { ...node, children: updateTreeValue(node.children || [], path.slice(1), val, dataIndex) };
            }
            return node;
        });
    };

    const addSiblingNode = (nodes: TreeNode[], path: string[], level: number): TreeNode[] => {
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
                return { ...node, children: addSiblingNode(node.children || [], path.slice(1), level) };
            }
            return node;
        });
    };

    const deleteNodeCascade = (nodes: TreeNode[], path: string[]): TreeNode[] => {
        const targetId = path[0];
        if (path.length === 1) { return nodes.filter((n) => n.id !== targetId); }
        return nodes
            .map((node) => {
                if (node.id === targetId) {
                    return { ...node, children: deleteNodeCascade(node.children || [], path.slice(1)) };
                }
                return node;
            })
            .filter((node) => !(node.id === targetId && node.children?.length === 0));
    };

    const handleValueChange = (path: string[], val: string, dataIndex: string) =>
        onChange?.(updateTreeValue(value, path, val, dataIndex));

    const handleAdd = (path: string[], level: number) =>
        onChange?.(addSiblingNode(value, path, level));

    const handleDelete = (path: string[]) => {
        const nextValue = deleteNodeCascade(value, path);
        onChange?.(nextValue.length === 0 ? [createChain(columns, 0)] : nextValue);
    };

    const renderLevel = (nodes: TreeNode[], level: number, parentPath: string[] = []): React.ReactNode => {
        if (!columns[level]) { return null; }
        const col = columns[level];
        const isLeaf = level === columns.length - 1;

        return (
            <div className={level === 0 ? 'tree-level-root' : 'tree-level-children'}>
                {nodes.map((node) => {
                    const currentPath = [...parentPath, node.id];
                    return (
                        <div className="tree-row" key={node.id}>
                            <div data-cell-id={node.id} className="tree-cell" style={{ width: col.width }}>
                                {col.render({
                                    value: node[col.dataIndex] ?? '',
                                    onChange: (val) => handleValueChange(currentPath, val, col.dataIndex),
                                    node,
                                    level,
                                    path: currentPath,
                                    dataIndex: col.dataIndex,
                                    title: col.title,
                                    hasAdd: col.hasAdd,
                                    onAdd: () => handleAdd(currentPath, level),
                                    onDelete: () => handleDelete(currentPath),
                                    isLeaf,
                                    width: col.width,
                                    id: node.id,
                                })}
                                {col.hasAdd && (
                                    <div className="tree-cell-action">
                                        {col.addRender
                                            ? col.addRender({ onClick: () => handleAdd(currentPath, level) })
                                            : (
                                                <button
                                                    type="button"
                                                    className="tree-cell-action-btn"
                                                    onClick={() => handleAdd(currentPath, level)}
                                                >
                                                    添加
                                                </button>
                                            )}
                                    </div>
                                )}
                            </div>

                            {!isLeaf && node.children && node.children.length > 0 &&
                                renderLevel(node.children, level + 1, currentPath)}

                            {isLeaf && (
                                col.deleteRender
                                    ? col.deleteRender({ onClick: () => handleDelete(currentPath) })
                                    : (
                                        <button
                                            type="button"
                                            className="tree-delete-btn"
                                            onClick={() => handleDelete(currentPath)}
                                            title="删除整行"
                                        >
                                            删除
                                        </button>
                                    )
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="cascading-table-wrapper">
            <div className="tree-header">
                {columns.map((col: ColumnConfig, i: number) => (
                    <div
                        key={col.dataIndex}
                        className="tree-header-cell"
                        style={{
                            width: col.width,
                            marginRight: i < columns.length - 1 ? 30 : 0,
                            marginLeft: i > 0 ? 20 : 0,
                        }}
                    >
                        {col.title}
                    </div>
                ))}
            </div>

            <div className="tree-body" ref={containerRef}>
                <canvas ref={canvasRef} className="tree-canvas-layer" />
                {renderLevel(value, 0)}
            </div>
        </div>
    );
};
