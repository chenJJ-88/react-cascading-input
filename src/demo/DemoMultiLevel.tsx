import { useState } from 'react';
import { CascadingInput } from '../index';
import type { ColumnConfig } from '../types';
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

const mkInput = (title: string, dataIndex: string, width: number, hasAdd: boolean): ColumnConfig => ({
    title,
    dataIndex,
    width,
    hasAdd,
    render: ({ value, onChange }) => (
        <input style={inputStyle} placeholder={`请输入${title}`} value={value} onChange={(e) => onChange(e.target.value)} />
    ),
});

const columns: ColumnConfig[] = [
    mkInput('项目', 'project', 100, true),
    mkInput('环境', 'env', 100, true),
    mkInput('服务', 'service', 100, true),
    mkInput('实例', 'instance', 100, true),
    mkInput('配置', 'config', 120, false),
];

export function DemoMultiLevel() {
    const [value, setValue] = useState<any[]>([]);

    return (
        <div style={{ padding: '16px 0' }}>
            <CascadingInput columns={columns} value={value} onChange={setValue} line={{ style: 'curve' }} />
            <details style={{ marginTop: 16 }}>
                <summary style={{ cursor: 'pointer', color: '#666', fontSize: 13 }}>查看数据</summary>
                <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 6, fontSize: 12, overflow: 'auto' }}>
                    {JSON.stringify(value, null, 2)}
                </pre>
            </details>
        </div>
    );
}
