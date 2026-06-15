import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { CascadingInput } from '../src';
import type { ColumnConfig } from '../src/types';

const columns: ColumnConfig[] = [
    {
        title: '训练任务',
        dataIndex: 'product',
        width: 120,
        hasAdd: true,
        render: ({ value, onChange, title }) => (
            <input placeholder={`请输入${title}`} value={value} onChange={(e) => onChange(e.target.value)} />
        ),
    },
    {
        title: '训练集群',
        dataIndex: 'region',
        width: 120,
        hasAdd: true,
        render: ({ value, onChange, title }) => (
            <input placeholder={`请输入${title}`} value={value} onChange={(e) => onChange(e.target.value)} />
        ),
    },
    {
        title: '框架版本',
        dataIndex: 'spec',
        width: 180,
        hasAdd: false,
        render: ({ value, onChange, title }) => (
            <input placeholder={`请输入${title}`} value={value} onChange={(e) => onChange(e.target.value)} />
        ),
    },
];

function TestWrapper() {
    const [value, setValue] = useState<any[]>([]);
    return <CascadingInput columns={columns} value={value} onChange={setValue} />;
}

describe('CascadingInput', () => {
    it('应渲染表头', () => {
        render(<TestWrapper />);
        expect(screen.getByText('训练任务')).toBeTruthy();
        expect(screen.getByText('训练集群')).toBeTruthy();
        expect(screen.getByText('框架版本')).toBeTruthy();
    });

    it('应渲染 render 返回的输入框', () => {
        render(<TestWrapper />);
        const inputs = screen.getAllByPlaceholderText('请输入训练任务');
        expect(inputs.length).toBeGreaterThanOrEqual(1);
    });

    it('应渲染添加按钮', () => {
        render(<TestWrapper />);
        const addButtons = screen.getAllByText('添加');
        expect(addButtons.length).toBeGreaterThanOrEqual(1);
    });

    it('应渲染删除按钮（叶子层级）', () => {
        render(<TestWrapper />);
        const deleteButtons = screen.getAllByTitle('删除整行');
        expect(deleteButtons.length).toBeGreaterThanOrEqual(1);
    });

    it('输入值后应正确更新', () => {
        const ControlledTest = () => {
            const [value, setValue] = useState<any[]>([]);
            return (
                <div>
                    <CascadingInput columns={columns} value={value} onChange={setValue} />
                    <div data-testid="output">{JSON.stringify(value)}</div>
                </div>
            );
        };
        render(<ControlledTest />);

        const input = screen.getByPlaceholderText('请输入训练任务');
        fireEvent.change(input, { target: { value: '手机' } });
        const output = screen.getByTestId('output');
        expect(output.textContent).toContain('手机');
    });
});
