import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { LineStyle, TreeNode } from '../types';

interface LineSegment {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    /** 折线模式的中间控制点 */
    midX?: number;
}

interface Particle {
    progress: number;
    speed: number;
    line: LineSegment;
}

interface UseCanvasLinesOptions {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    containerRef: RefObject<HTMLDivElement | null>;
    value: TreeNode[];
    lineStyle: LineStyle;
    lineColor: string;
    lineWidth: number;
    showSource?: boolean;
}

/** 贝塞尔曲线上的点（3阶） */
function bezierPoint(t: number, p0: number, p1: number, p2: number, p3: number): number {
    const u = 1 - t;
    return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

/** 折线上的点（3段折线：水平→垂直→水平） */
function straightPoint(progress: number, line: LineSegment): { x: number; y: number } {
    const { startX, startY, endX, endY, midX } = line;
    const mx = midX ?? ((startX + endX) / 2);

    // 3 段：start→mid水平 / mid垂直 / mid→end水平
    const seg1Len = Math.abs(mx - startX);
    const seg2Len = Math.abs(endY - startY);
    const seg3Len = Math.abs(endX - mx);
    const totalLen = seg1Len + seg2Len + seg3Len;
    if (totalLen === 0) { return { x: startX, y: startY }; }

    const d = progress * totalLen;

    if (d <= seg1Len) {
        const t = seg1Len > 0 ? d / seg1Len : 0;
        return { x: startX + (mx - startX) * t, y: startY };
    }
    if (d <= seg1Len + seg2Len) {
        const t = seg2Len > 0 ? (d - seg1Len) / seg2Len : 0;
        return { x: mx, y: startY + (endY - startY) * t };
    }
    const t = seg3Len > 0 ? (d - seg1Len - seg2Len) / seg3Len : 0;
    return { x: mx + (endX - mx) * t, y: endY };
}

/** 曲线上的点 */
function curvePoint(progress: number, line: LineSegment): { x: number; y: number } {
    const { startX, startY, endX, endY } = line;
    const o = 20;
    const cp1x = startX + o;
    const cp1y = startY;
    const cp2x = endX - o;
    const cp2y = endY;
    return {
        x: bezierPoint(progress, startX, cp1x, cp2x, endX),
        y: bezierPoint(progress, startY, cp1y, cp2y, endY),
    };
}

/** 根据线条类型获取粒子在 progress 位置的坐标 */
function getParticlePosition(progress: number, line: LineSegment, lineStyle: LineStyle): { x: number; y: number } {
    if (lineStyle === 'straight') {
        return straightPoint(progress, line);
    }
    return curvePoint(progress, line);
}

export function useCanvasLines({
    canvasRef,
    containerRef,
    value,
    lineStyle,
    lineColor,
    lineWidth,
    showSource = false,
}: UseCanvasLinesOptions) {
    const animFrameRef = useRef<number>(0);
    const particlesRef = useRef<Particle[]>([]);

    /** 收集所有父子连线的坐标 */
    const collectLines = useCallback((): LineSegment[] => {
        const container = containerRef.current;
        if (!container || !value.length) { return []; }

        const rect = container.getBoundingClientRect();
        const lines: LineSegment[] = [];

        const walk = (nodes: TreeNode[]) => {
            nodes.forEach((node) => {
                if (node.children && node.children.length > 0) {
                    const parentEl = container.querySelector(`[data-cell-id="${node.id}"]`);
                    if (!parentEl) { return; }
                    const pRect = parentEl.getBoundingClientRect();
                    const startX = pRect.right - rect.left;
                    const startY = pRect.top - rect.top + 16;

                    node.children.forEach((child) => {
                        const childEl = container.querySelector(`[data-cell-id="${child.id}"]`);
                        if (!childEl) { return; }
                        const cRect = childEl.getBoundingClientRect();
                        const endX = cRect.left - rect.left;
                        const endY = cRect.top - rect.top + 16;

                        lines.push({
                            startX,
                            startY,
                            endX,
                            endY,
                            midX: lineStyle === 'straight' ? endX - 20 : undefined,
                        });
                    });
                    walk(node.children);
                }
            });
        };

        walk(value);
        return lines;
    }, [value, lineStyle, containerRef]);

    /** 静态绘制线条 */
    const drawStaticLines = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !value.length) { return; }

        const ctx = canvas.getContext('2d');
        if (!ctx) { return; }

        const rect = container.getBoundingClientRect();
        if (canvas.width !== rect.width) { canvas.width = rect.width; }
        if (canvas.height !== rect.height) { canvas.height = rect.height; }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const lines = collectLines();
        renderLines(ctx, lines, lineStyle, lineColor, lineWidth);
    }, [value, lineStyle, lineColor, lineWidth, collectLines, canvasRef, containerRef]);

    /** 动画循环：绘制线条 + 粒子 */
    const startAnimation = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !value.length) { return; }

        const ctx = canvas.getContext('2d');
        if (!ctx) { return; }

        const rect = container.getBoundingClientRect();
        if (canvas.width !== rect.width) { canvas.width = rect.width; }
        if (canvas.height !== rect.height) { canvas.height = rect.height; }

        const lines = collectLines();

        // 初始化粒子（如果线条数量变了，重新创建）
        if (particlesRef.current.length !== lines.length) {
            particlesRef.current = lines.map((line) => ({
                progress: Math.random(), // 随机初始位置，避免所有粒子同步
                speed: 0.003 + Math.random() * 0.002, // 稍有速度差异
                line,
            }));
        } else {
            // 更新线条坐标（resize 时位置变化）
            particlesRef.current.forEach((p, i) => { p.line = lines[i]; });
        }

        const animate = () => {
            const rect2 = container.getBoundingClientRect();
            if (canvas.width !== rect2.width) { canvas.width = rect2.width; }
            if (canvas.height !== rect2.height) { canvas.height = rect2.height; }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 画线
            renderLines(ctx, lines, lineStyle, lineColor, lineWidth);

            // 画粒子
            const now = Date.now();
            particlesRef.current.forEach((particle) => {
                particle.progress += particle.speed;
                if (particle.progress > 1) { particle.progress -= 1; }

                // 收拢效果：粒子从子节点（end）流向父节点（start）
                const pos = getParticlePosition(1 - particle.progress, particle.line, lineStyle);

                // 呼吸效果：半径在 2.5~4 之间脉动
                const breathe = 2.5 + 1.5 * (0.5 + 0.5 * Math.sin(now / 400 + particle.progress * Math.PI * 2));

                ctx.fillStyle = lineColor;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, breathe, 0, Math.PI * 2);
                ctx.fill();
            });

            animFrameRef.current = requestAnimationFrame(animate);
        };

        animFrameRef.current = requestAnimationFrame(animate);
    }, [value, lineStyle, lineColor, lineWidth, collectLines, canvasRef, containerRef]);

    // 主 effect：根据 showSource 决定静态还是动画
    useEffect(() => {
        if (showSource) {
            startAnimation();
        } else {
            drawStaticLines();
        }

        return () => {
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
        };
    }, [showSource, drawStaticLines, startAnimation]);

    // Resize 监听
    useLayoutEffect(() => {
        const container = containerRef.current;
        let ro: ResizeObserver | null = null;
        if (container && typeof ResizeObserver !== 'undefined') {
            ro = new ResizeObserver(() => {
                if (!showSource) { drawStaticLines(); }
                // 动画模式下，下一帧自动重绘，无需额外处理
            });
            ro.observe(container);
        }
        window.addEventListener('resize', () => {
            if (!showSource) { drawStaticLines(); }
        });
        return () => {
            ro?.disconnect();
        };
    }, [showSource, drawStaticLines, containerRef]);
}

/** 渲染所有连线 */
function renderLines(
    ctx: CanvasRenderingContext2D,
    lines: LineSegment[],
    lineStyle: LineStyle,
    lineColor: string,
    lineWidth: number,
) {
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;

    lines.forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(line.startX, line.startY);

        if (lineStyle === 'straight') {
            const mx = line.midX ?? ((line.startX + line.endX) / 2);
            ctx.lineTo(mx, line.startY);
            ctx.lineTo(mx, line.endY);
            ctx.lineTo(line.endX, line.endY);
        } else {
            const o = 20;
            ctx.bezierCurveTo(
                line.startX + o, line.startY,
                line.endX - o, line.endY,
                line.endX, line.endY,
            );
        }
        ctx.stroke();
    });
}
