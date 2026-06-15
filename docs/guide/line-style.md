# 连线样式

组件通过 Canvas 在父子节点之间绘制连接线，所有连线相关配置通过 `line` prop 统一管理。

## line.style

通过 `line.style` 切换连线风格：

| 值 | 效果 |
|---|---|
| `'curve'`（默认） | 贝塞尔曲线，视觉更柔和 |
| `'straight'` | 90° 折线，更工整 |

```tsx
<CascadingInput columns={columns} value={value} onChange={setValue} line={{ style: 'straight' }} />
```

## line.color

自定义连线颜色，默认 `'#d9d9d9'`：

```tsx
<CascadingInput columns={columns} value={value} onChange={setValue} line={{ color: '#1890ff' }} />
```

## line.width

自定义连线粗细（px），默认 `1.5`：

```tsx
<CascadingInput columns={columns} value={value} onChange={setValue} line={{ width: 2 }} />
```

## 组合使用

```tsx
<CascadingInput
    columns={columns}
    value={value}
    onChange={setValue}
    line={{ style: 'straight', color: '#52c41a', width: 2 }}
/>
```

## line.showSource 溯源动画

开启后，连线上的小圆点粒子会从子节点沿线条流向父节点，用 `requestAnimationFrame` 驱动动画循环，直观展示数据溯源关系：

```tsx
{/* 默认配置 */}
<CascadingInput columns={columns} value={value} onChange={setValue} line={{ showSource: true }} />

{/* 自定义粒子动画 */}
<CascadingInput
    columns={columns}
    value={value}
    onChange={setValue}
    line={{
        style: 'curve',
        color: '#d9d9d9',
        showSource: { color: '#1890ff', speed: 0.006, breatheCycle: 300 },
    }}
/>
```

> 粒子颜色默认跟随 `line.color`，运动路径跟随 `line.style`。详细配置项见 [API - SourceAnimationOptions](/api/)。

## 工作原理

- Canvas 画布绝对定位，覆盖整个 `.tree-body` 容器
- 每次 `value` 变化或容器尺寸变化，通过 `useLayoutEffect` 在浏览器 paint 前重绘，避免闪烁
- 使用 `ResizeObserver` 监听容器尺寸变化，窗口 `resize` 事件作为兜底
- 每个单元格容器绑定 `data-cell-id` 属性，Canvas 通过 `querySelector` 获取 DOM 位置后计算坐标
