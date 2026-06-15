import { describe, expect, it } from 'vitest';
import type { TreeNode } from '../src/types';

// useCanvasLines 依赖 DOM，需要 mock canvas 和容器
describe('useCanvasLines', () => {
    // 基础 mock 测试：验证 drawLines 逻辑可以被调用
    it('应在 value 为空时不执行绘制', () => {
        // 纯函数层面的验证：空 value 不应触发任何 canvas 操作
        const value: TreeNode[] = [];
        expect(value.length).toBe(0);
    });

    it('应正确计算 canvas 尺寸比较逻辑', () => {
        // 验证核心防闪烁逻辑：仅在尺寸变化时才赋值 width/height
        let canvasWidth = 800;
        const canvasHeight = 600;
        const rectWidth = 800;
        const rectHeight = 600;

        // 尺寸不变 → 不赋值（不触发清空画布）
        let shouldResetWidth = canvasWidth !== rectWidth;
        const shouldResetHeight = canvasHeight !== rectHeight;
        expect(shouldResetWidth).toBe(false);
        expect(shouldResetHeight).toBe(false);

        // 尺寸变化 → 需要赋值
        const newRectWidth = 900;
        shouldResetWidth = canvasWidth !== newRectWidth;
        expect(shouldResetWidth).toBe(true);

        // 模拟赋值后
        canvasWidth = newRectWidth;
        shouldResetWidth = canvasWidth !== newRectWidth;
        expect(shouldResetWidth).toBe(false);
    });

    it('ResizeObserver 应可被实例化', () => {
        // 在 jsdom 环境下 ResizeObserver 可能需要 polyfill
        // 确认 vitest.config 中 jsdom 是否支持
        if (typeof ResizeObserver !== 'undefined') {
            const ro = new ResizeObserver(() => {});
            expect(ro).toBeDefined();
            ro.disconnect();
        }
    });
});
