import { describe, expect, it } from 'vitest';
import { addSiblingNode, createChain, deleteNodeCascade, updateTreeValue } from '../src/hooks/useTreeData';
import type { ColumnConfig } from '../src/types';

const columns: ColumnConfig[] = [
    { title: '训练任务', dataIndex: 'product', width: 120, hasAdd: true },
    { title: '训练集群', dataIndex: 'region', width: 120, hasAdd: true },
    { title: '框架版本', dataIndex: 'spec', width: 180, hasAdd: false },
];

describe('createChain', () => {
    it('应生成从指定层级到底的完整链', () => {
        const chain = createChain(columns, 0);
        expect(chain.id).toBeTruthy();
        expect(chain.product).toBeUndefined();
        expect(chain.children).toHaveLength(1);
        expect(chain.children![0].region).toBeUndefined();
        expect(chain.children![0].children).toHaveLength(1);
        expect(chain.children![0].children![0].spec).toBeUndefined();
        expect(chain.children![0].children![0].children).toHaveLength(0);
    });

    it('从中间层级开始也应正确生成', () => {
        const chain = createChain(columns, 1);
        expect(chain.region).toBeUndefined();
        expect(chain.children).toHaveLength(1);
    });
});

describe('updateTreeValue', () => {
    it('应更新根层级节点的值', () => {
        const root = createChain(columns, 0);
        const nodes = [root];
        const result = updateTreeValue(nodes, [root.id], '手机', 'product');
        expect(result[0].product).toBe('手机');
    });

    it('应更新深层节点的值', () => {
        const root = createChain(columns, 0);
        const nodes = [root];
        const child = root.children![0];
        const grandChild = child.children![0];
        const result = updateTreeValue(nodes, [root.id, child.id, grandChild.id], 'A100', 'spec');
        expect(result[0].children![0].children![0].spec).toBe('A100');
    });

    it('不应影响其他节点', () => {
        const root1 = createChain(columns, 0);
        const root2 = createChain(columns, 0);
        const nodes = [root1, root2];
        const result = updateTreeValue(nodes, [root1.id], '电脑', 'product');
        expect(result[0].product).toBe('电脑');
        expect(result[1].product).toBeUndefined();
    });
});

describe('addSiblingNode', () => {
    it('应在根层级节点后添加同级节点', () => {
        const root = createChain(columns, 0);
        const nodes = [root];
        const result = addSiblingNode(nodes, [root.id], 0, columns);
        expect(result).toHaveLength(2);
        expect(result[0].id).toBe(root.id);
        expect(result[1].id).not.toBe(root.id);
        expect(result[1].children).toHaveLength(1);
    });

    it('应在子层级节点后添加同级节点', () => {
        const root = createChain(columns, 0);
        const nodes = [root];
        const child = root.children![0];
        const result = addSiblingNode(nodes, [root.id, child.id], 1, columns);
        expect(result[0].children).toHaveLength(2);
    });
});

describe('deleteNodeCascade', () => {
    it('应删除根层级节点', () => {
        const root1 = createChain(columns, 0);
        const root2 = createChain(columns, 0);
        const nodes = [root1, root2];
        const result = deleteNodeCascade(nodes, [root1.id]);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(root2.id);
    });

    it('应删除深层节点，父节点保留（即使子列表为空）', () => {
        const root = createChain(columns, 0);
        const nodes = [root];
        const child = root.children![0];
        const grandChild = child.children![0];
        const result = deleteNodeCascade(nodes, [root.id, child.id, grandChild.id]);
        // 父节点保留，children 变为空数组
        expect(result).toHaveLength(1);
        expect(result[0].children![0].children).toHaveLength(0);
    });

    it('删除多个子节点中的一个后不应清理父节点', () => {
        const root = createChain(columns, 0);
        const nodes = [root];
        const child = root.children![0];
        const withSibling = addSiblingNode(nodes, [root.id, child.id], 1, columns);
        const child2 = withSibling[0].children![1];
        const result = deleteNodeCascade(withSibling, [root.id, child.id]);
        expect(result[0].children).toHaveLength(1);
        expect(result[0].children![0].id).toBe(child2.id);
    });
});
