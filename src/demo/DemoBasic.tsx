import { useState } from 'react';
import { CascadingInput } from '../index';
import type { ColumnConfig } from '../types';
import '../styles/index.css';

const mkInput = (title: string, dataIndex: string, width: number, hasAdd: boolean): ColumnConfig => ({
    title,
    dataIndex,
    width,
    hasAdd,
    render: ({ value, onChange }) => (
        <input
            style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '4px 8px',
                border: '1px solid #d9d9d9',
                borderRadius: 4,
                fontSize: 14,
                height: 32,
            }}
            placeholder={`请输入${title}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    ),
});

const columns: ColumnConfig[] = [
    mkInput('训练任务', 'product', 120, true),
    mkInput('训练集群', 'region', 120, true),
    mkInput('框架版本', 'spec', 180, false),
];

export function DemoBasic() {
    const [value, setValue] = useState<any[]>([]);

    return (
        <div style={{ padding: '16px 0' }}>
            <CascadingInput columns={columns} value={value} onChange={setValue} lineStyle="curve" />
            <details style={{ marginTop: 16 }}>
                <summary style={{ cursor: 'pointer', color: '#666', fontSize: 13 }}>查看数据</summary>
                <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 6, fontSize: 12, overflow: 'auto' }}>
                    {JSON.stringify(value, null, 2)}
                </pre>
            </details>
        </div>
    );
}
