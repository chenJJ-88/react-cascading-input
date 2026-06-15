import { type RefObject, useCallback, useLayoutEffect } from 'react';
import type { LineStyle, TreeNode } from '../types';

interface UseCanvasLinesOptions {
    containerRef: RefObject<HTMLDivElement | null>;
    canvasRef: RefObject<HTMLCanvasElement | null>;
    value: TreeNode[];
    lineStyle: LineStyle;
    lineColor: string;
    lineWidth: number;
}

/**
 * 自定义 Hook：Canvas 关系线绘制逻辑
 * - 使用 useLayoutEffect 在浏览器 paint 前同步绘制，避免闪烁
 * - 使用 ResizeObserver 监听容器尺寸变化
 * - 仅在 canvas 尺寸真正变化时才重设 width/height，避免无谓清空画布
 */
export const useCanvasLines = ({
    containerRef,
    canvasRef,
    value,
    lineStyle,
    lineColor,
    lineWidth,
}: UseCanvasLinesOptions) => {
    const drawLines = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !value.length) {
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        // 仅在尺寸真正变化时才赋值 canvas.width/height，避免无谓清空画布
        const rect = container.getBoundingClientRect();
        if (canvas.width !== rect.width) {
            canvas.width = rect.width;
        }
        if (canvas.height !== rect.height) {
            canvas.height = rect.height;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;

        // 递归查找 DOM 坐标并连线
        const drawNodeLines = (nodes: TreeNode[]) => {
            nodes.forEach((node) => {
                if (node.children && node.children.length > 0) {
                    const parentEl = container.querySelector(`[data-cell-id="${node.id}"]`);
                    if (!parentEl) {
                        return;
                    }
                    const pRect = parentEl.getBoundingClientRect();
                    const startX = pRect.right - rect.left;
                    const startY = pRect.top - rect.top + 16;

                    node.children.forEach((child) => {
                        const childEl = container.querySelector(`[data-cell-id="${child.id}"]`);
                        if (!childEl) {
                            return;
                        }
                        const cRect = childEl.getBoundingClientRect();
                        const endX = cRect.left - rect.left;
                        const endY = cRect.top - rect.top + 16;

                        ctx.beginPath();
                        ctx.moveTo(startX, startY);

                        if (lineStyle === 'straight') {
                            // 90 度折线
                            ctx.lineTo(endX - 20, startY);
                            ctx.lineTo(endX - 20, endY);
                            ctx.lineTo(endX, endY);
                        } else {
                            // 贝塞尔曲线
                            const controlPointOffset = 20;
                            ctx.bezierCurveTo(
                                startX + controlPointOffset,
                                startY,
                                endX - controlPointOffset,
                                endY,
                                endX,
                                endY,
                            );
                        }
                        ctx.stroke();
                    });
                    drawNodeLines(node.children);
                }
            });
        };

        drawNodeLines(value);
    }, [value, lineStyle, lineColor, lineWidth, containerRef, canvasRef]);

    // 使用 useLayoutEffect 在 paint 前同步绘制，消除闪烁
    useLayoutEffect(() => {
        drawLines();

        const container = containerRef.current;
        let ro: ResizeObserver | null = null;
        if (container && typeof ResizeObserver !== 'undefined') {
            ro = new ResizeObserver(() => drawLines());
            ro.observe(container);
        }
        // 兜底：监听窗口尺寸变化
        window.addEventListener('resize', drawLines);
        return () => {
            ro?.disconnect();
            window.removeEventListener('resize', drawLines);
        };
    }, [drawLines, containerRef.current]);

    return { drawLines };
};
