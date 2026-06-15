import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const root = createRoot(document.getElementById('root')!);

function Main() {
    const [tab, setTab] = useState<'default' | 'antd'>('default');

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
                <button
                    type="button"
                    onClick={() => setTab('default')}
                    style={{
                        padding: '6px 16px',
                        background: tab === 'default' ? '#1890ff' : '#fff',
                        color: tab === 'default' ? '#fff' : '#333',
                        border: '1px solid #d9d9d9',
                        borderRadius: 6,
                        cursor: 'pointer',
                    }}
                >
                    默认渲染器
                </button>
                <button
                    type="button"
                    onClick={() => setTab('antd')}
                    style={{
                        padding: '6px 16px',
                        background: tab === 'antd' ? '#1890ff' : '#fff',
                        color: tab === 'antd' ? '#fff' : '#333',
                        border: '1px solid #d9d9d9',
                        borderRadius: 6,
                        cursor: 'pointer',
                    }}
                >
                    antd 集成
                </button>
            </div>

            {tab === 'default' && <App />}
            {tab === 'antd' && (
                <React.Suspense fallback={<div>加载中...</div>}>
                    <AntdDemo />
                </React.Suspense>
            )}
        </div>
    );
}

// 懒加载 antd demo（antd 体积大，不影响默认模式启动速度）
const AntdDemo = React.lazy(() => import('./antd-demo').then((m) => ({ default: m.AntdDemo })));

root.render(<Main />);
