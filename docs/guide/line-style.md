# 连线样式

组件通过 Canvas 在父子节点之间绘制连接线，支持两种风格和自定义外观。

## lineStyle

通过 `lineStyle` prop 切换：

| 值 | 效果 |
|---|---|
| `'curve'`（默认） | 贝塞尔曲线，视觉更柔和 |
| `'straight'` | 90° 折线，更工整 |

```tsx
<CascadingInput columns={columns} value={value} onChange={setValue} lineStyle="straight" />
```

## lineColor

通过 `lineColor` prop 自定义连线颜色，默认 `'#d9d9d9'`：

```tsx
<CascadingInput columns={columns} value={value} onChange={setValue} lineColor="#1890ff" />
```

## lineWidth

通过 `lineWidth` prop 自定义连线粗细（px），默认 `1.5`：

```tsx
<CascadingInput columns={columns} value={value} onChange={setValue} lineWidth={2} />
```

## 组合使用

```tsx
<CascadingInput
    columns={columns}
    value={value}
    onChange={setValue}
    lineStyle="straight"
    lineColor="#52c41a"
    lineWidth={2}
/>
```

## 工作原理

- Canvas 画布绝对定位，覆盖整个 `.tree-body` 容器
- 每次 `value` 变化或容器尺寸变化，通过 `useLayoutEffect` 在浏览器 paint 前重绘，避免闪烁
- 使用 `ResizeObserver` 监听容器尺寸变化，窗口 `resize` 事件作为兜底
- 每个单元格容器绑定 `data-cell-id` 属性，Canvas 通过 `querySelector` 获取 DOM 位置后计算坐标
