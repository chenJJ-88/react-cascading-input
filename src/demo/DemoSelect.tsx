import { useState } from 'react';
import { CascadingInput } from '../index';
import type { ColumnConfig } from '../types';
import '../styles/index.css';

const selectStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '4px 8px',
    border: '1px solid #d9d9d9',
    borderRadius: 4,
    fontSize: 14,
    height: 32,
    background: '#fff',
};

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
        render: ({ value, onChange, title }) => (
            <input style={inputStyle} placeholder={`请输入${title}`} value={value} onChange={(e) => onChange(e.target.value)} />
        ),
    },
    {
        title: '训练集群',
        dataIndex: 'region',
        width: 130,
        hasAdd: true,
        render: ({ value, onChange, title }) => (
            <select style={selectStyle} value={value || ''} onChange={(e) => onChange(e.target.value)}>
                <option value="">请选择{title}</option>
                <option value="beijing">北京</option>
                <option value="shanghai">上海</option>
                <option value="guangzhou">广州</option>
            </select>
        ),
    },
    {
        title: '框架版本',
        dataIndex: 'framework',
        width: 130,
        hasAdd: true,
        render: ({ value, onChange, title }) => (
            <select style={selectStyle} value={value || ''} onChange={(e) => onChange(e.target.value)}>
                <option value="">请选择{title}</option>
                <option value="pytorch">PyTorch</option>
                <option value="tensorflow">TensorFlow</option>
                <option value="mindspore">MindSpore</option>
            </select>
        ),
    },
    {
        title: '训练阶段',
        dataIndex: 'stage',
        width: 120,
        hasAdd: false,
        render: ({ value, onChange, title }) => (
            <select style={selectStyle} value={value || ''} onChange={(e) => onChange(e.target.value)}>
                <option value="">请选择{title}</option>
                <option value="preprocess">预处理</option>
                <option value="training">训练中</option>
                <option value="eval">评估</option>
            </select>
        ),
    },
];

export function DemoSelect() {
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
