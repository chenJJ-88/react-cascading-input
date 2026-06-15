import { useState } from 'react';
import { CascadingInput } from '../src';
import type { ColumnConfig } from '../src/types';

const columnsConfig: ColumnConfig[] = [
    { title: '训练任务', dataIndex: 'product', type: 'input', width: 120, hasAdd: true },
    { title: '训练集群', dataIndex: 'region', type: 'input', width: 120, hasAdd: true },
    { title: '框架版本', dataIndex: 'spec', type: 'input', width: 180, hasAdd: true },
    { title: '训练阶段', dataIndex: 'scene', type: 'input', width: 120, hasAdd: false },
    { title: '算法', dataIndex: 'model', type: 'input', width: 120, hasAdd: false },
    { title: '超参配置', dataIndex: 'power', type: 'input', width: 140, hasAdd: false },
    { title: '训练轮数', dataIndex: 'count', type: 'input', width: 100, hasAdd: true },
];

export function App() {
    const [value, setValue] = useState<any[]>([]);

    return (
        <div style={{ padding: 24, background: '#f7f7f9', minHeight: '100vh' }}>
            <h2>react-cascading-input — 默认渲染器</h2>
            <p style={{ color: '#666', marginBottom: 16 }}>零 UI 库依赖，使用原生 HTML 控件</p>

            <CascadingInput columns={columnsConfig} value={value} onChange={setValue} lineStyle="curve" />

            <div style={{ marginTop: 24 }}>
                <h3>当前数据</h3>
                <pre
                    style={{
                        background: '#fff',
                        padding: 16,
                        borderRadius: 8,
                        overflow: 'auto',
                        fontSize: 12,
                        maxHeight: 400,
                    }}
                >
                    {JSON.stringify(value, null, 2)}
                </pre>
            </div>
        </div>
    );
}
