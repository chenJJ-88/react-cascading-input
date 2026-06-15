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

const addBtnStyle: React.CSSProperties = {
    padding: '2px 12px',
    border: '1px solid #1890ff',
    borderRadius: 4,
    background: '#e6f7ff',
    color: '#1890ff',
    fontSize: 12,
    cursor: 'pointer',
};

const deleteBtnStyle: React.CSSProperties = {
    padding: '2px 12px',
    border: '1px solid #ff4d4f',
    borderRadius: 4,
    background: '#fff1f0',
    color: '#ff4d4f',
    fontSize: 12,
    cursor: 'pointer',
};

const columns: ColumnConfig[] = [
    {
        title: '训练任务',
        dataIndex: 'product',
        width: 120,
        hasAdd: true,
        addRender: ({ onClick }) => <button type="button" style={addBtnStyle} onClick={onClick}>+ 添加</button>,
        deleteRender: ({ onClick }) => <button type="button" style={deleteBtnStyle} onClick={onClick}>删除</button>,
        render: ({ value, onChange, title }) => (
            <input style={inputStyle} placeholder={`请输入${title}`} value={value} onChange={(e) => onChange(e.target.value)} />
        ),
    },
    {
        title: '训练集群',
        dataIndex: 'region',
        width: 120,
        hasAdd: true,
        addRender: ({ onClick }) => <button type="button" style={addBtnStyle} onClick={onClick}>+ 添加</button>,
        deleteRender: ({ onClick }) => <button type="button" style={deleteBtnStyle} onClick={onClick}>删除</button>,
        render: ({ value, onChange, title }) => (
            <input style={inputStyle} placeholder={`请输入${title}`} value={value} onChange={(e) => onChange(e.target.value)} />
        ),
    },
    {
        title: '框架版本',
        dataIndex: 'spec',
        width: 180,
        hasAdd: false,
        deleteRender: ({ onClick }) => <button type="button" style={deleteBtnStyle} onClick={onClick}>删除</button>,
        render: ({ value, onChange, title }) => (
            <input style={inputStyle} placeholder={`请输入${title}`} value={value} onChange={(e) => onChange(e.target.value)} />
        ),
    },
];

export function DemoCustomActions() {
    const [value, setValue] = useState<any[]>([]);

    return (
        <div style={{ padding: '16px 0' }}>
            <CascadingInput
                columns={columns}
                value={value}
                onChange={setValue}
                lineStyle="curve"
                lineColor="#1890ff"
                lineWidth={1}
            />
            <details style={{ marginTop: 16 }}>
                <summary style={{ cursor: 'pointer', color: '#666', fontSize: 13 }}>查看数据</summary>
                <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 6, fontSize: 12, overflow: 'auto' }}>
                    {JSON.stringify(value, null, 2)}
                </pre>
            </details>
        </div>
    );
}
