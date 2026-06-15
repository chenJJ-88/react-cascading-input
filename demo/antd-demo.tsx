import { Input, Select } from 'antd';
import { useState } from 'react';
import { CascadingInput } from '../src';
import type { CellRenderProps, ColumnConfig, TreeNode } from '../src/types';
import 'antd/dist/reset.css';
import '../src/styles/index.css';

/** 用 antd 组件渲染输入单元格 */
function AntdInputCell({ value, onChange, title }: CellRenderProps) {
    return <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={`请输入${title}`} />;
}

/** 用 antd 组件渲染选择单元格 */
function AntdSelectCell({ value, onChange, title, options }: CellRenderProps & { options?: ColumnConfig['options'] }) {
    return (
        <Select
            value={value || undefined}
            onChange={(val) => onChange(val)}
            placeholder={`请选择${title}`}
            options={options}
            style={{ width: '100%' }}
            allowClear
        />
    );
}

const columnsConfig: ColumnConfig[] = [
    {
        title: '训练任务',
        dataIndex: 'product',
        width: 160,
        hasAdd: true,
        render: (props) => <AntdInputCell {...props} />,
    },
    {
        title: '训练集群',
        dataIndex: 'region',
        width: 140,
        hasAdd: true,
        type: 'select',
        options: [
            { label: '北京', value: 'beijing' },
            { label: '上海', value: 'shanghai' },
            { label: '广州', value: 'guangzhou' },
        ],
        render: (props) => (
            <AntdSelectCell
                {...props}
                options={[
                    { label: '北京', value: 'beijing' },
                    { label: '上海', value: 'shanghai' },
                    { label: '广州', value: 'guangzhou' },
                ]}
            />
        ),
    },
    {
        title: '框架版本',
        dataIndex: 'spec',
        width: 180,
        hasAdd: true,
        render: (props) => <AntdInputCell {...props} />,
    },
    {
        title: '训练阶段',
        dataIndex: 'scene',
        width: 140,
        hasAdd: false,
        type: 'select',
        options: [
            { label: '预处理', value: 'preprocess' },
            { label: '训练中', value: 'training' },
            { label: '评估', value: 'eval' },
        ],
        render: (props) => (
            <AntdSelectCell
                {...props}
                options={[
                    { label: '预处理', value: 'preprocess' },
                    { label: '训练中', value: 'training' },
                    { label: '评估', value: 'eval' },
                ]}
            />
        ),
    },
    {
        title: '算法',
        dataIndex: 'model',
        width: 140,
        hasAdd: false,
        render: (props) => <AntdInputCell {...props} />,
    },
    {
        title: '超参配置',
        dataIndex: 'power',
        width: 160,
        hasAdd: false,
        render: (props) => <AntdInputCell {...props} />,
    },
    {
        title: '训练轮数',
        dataIndex: 'count',
        width: 120,
        hasAdd: true,
        render: (props) => (
            <Input
                type="number"
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
                placeholder="请输入轮数"
            />
        ),
    },
];

export function AntdDemo() {
    const [value, setValue] = useState<TreeNode[]>([]);

    return (
        <div style={{ padding: 24, background: '#f7f7f9', minHeight: '100vh' }}>
            <h2>react-cascading-input — antd 集成示例</h2>
            <p style={{ color: '#666', marginBottom: 16 }}>
                通过 <code>ColumnConfig.render</code> 自定义每列的渲染组件，集成 antd
            </p>

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
