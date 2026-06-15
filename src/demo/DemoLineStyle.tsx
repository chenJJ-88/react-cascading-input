import { useState } from 'react';
import { CascadingInput } from '../index';
import type { ColumnConfig, LineConfig } from '../types';
import '../styles/index.css';

const inputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '4px 8px',
    border: '1px solid #d9d9d9',
    borderRadius: 4,
    fontSize: 14,
    height: 32,
};

const columns: ColumnConfig[] = [
    {
        title: '训练任务',
        dataIndex: 'product',
        width: 120,
        hasAdd: true,
        render: ({ value, onChange }) => (
            <input
                style={inputStyle}
                placeholder="请输入训练任务"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        ),
    },
    {
        title: '训练集群',
        dataIndex: 'region',
        width: 120,
        hasAdd: true,
        render: ({ value, onChange }) => (
            <input
                style={inputStyle}
                placeholder="请输入训练集群"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        ),
    },
    {
        title: '框架版本',
        dataIndex: 'spec',
        width: 180,
        hasAdd: false,
        render: ({ value, onChange }) => (
            <input
                style={inputStyle}
                placeholder="请输入框架版本"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        ),
    },
];

export function DemoLineStyle() {
    const [value, setValue] = useState<any[]>([]);
    const [lineStyle, setLineStyle] = useState<'curve' | 'straight'>('curve');
    const [lineColor, setLineColor] = useState('#d9d9d9');
    const [lineWidth, setLineWidth] = useState(1.5);
    const [showSource, setShowSource] = useState(false);

    const line: LineConfig = {
        style: lineStyle,
        color: lineColor,
        width: lineWidth,
        showSource,
    };

    return (
        <div style={{ padding: '16px 0' }}>
            <div
                style={{
                    marginBottom: 16,
                    display: 'flex',
                    gap: 16,
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    fontSize: 14,
                }}
            >
                <label>
                    连线样式：
                    <select
                        value={lineStyle}
                        onChange={(e) => setLineStyle(e.target.value as 'curve' | 'straight')}
                        style={{ marginLeft: 4, padding: '2px 8px' }}
                    >
                        <option value="curve">贝塞尔曲线</option>
                        <option value="straight">折线</option>
                    </select>
                </label>
                <label>
                    连线颜色：
                    <input
                        type="color"
                        value={lineColor}
                        onChange={(e) => setLineColor(e.target.value)}
                        style={{ marginLeft: 4, verticalAlign: 'middle' }}
                    />
                </label>
                <label>
                    连线粗细：
                    <input
                        type="range"
                        min={0.5}
                        max={4}
                        step={0.5}
                        value={lineWidth}
                        onChange={(e) => setLineWidth(Number(e.target.value))}
                        style={{ marginLeft: 4, verticalAlign: 'middle' }}
                    />
                    <span style={{ marginLeft: 4, color: '#666' }}>{lineWidth}px</span>
                </label>
                <label style={{ cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={showSource}
                        onChange={(e) => setShowSource(e.target.checked)}
                        style={{ marginRight: 4, verticalAlign: 'middle' }}
                    />
                    溯源动画
                </label>
            </div>

            <CascadingInput columns={columns} value={value} onChange={setValue} line={line} />
            <details style={{ marginTop: 16 }}>
                <summary style={{ cursor: 'pointer', color: '#666', fontSize: 13 }}>查看数据</summary>
                <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 6, fontSize: 12, overflow: 'auto' }}>
                    {JSON.stringify(value, null, 2)}
                </pre>
            </details>
        </div>
    );
}
