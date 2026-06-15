import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
    root: path.join(__dirname, 'docs'),
    // GitHub Pages 部署时以仓库名为 base 路径
    base: '/react-cascading-input/',
    title: 'react-cascading-input',
    description: '支持 Canvas 连线的级联树形输入 React 组件',
    themeConfig: {
        nav: [
            { text: '指南', link: '/guide/getting-started' },
            { text: 'API', link: '/api/' },
            { text: 'GitHub', link: 'https://github.com/chenJJ-88/react-cascading-input' },
        ],
        sidebar: {
            '/': [
                {
                    text: '指南',
                    items: [
                        { text: '快速开始', link: '/guide/getting-started' },
                        { text: '在线演示', link: '/guide/demo' },
                        { text: '自定义渲染', link: '/guide/custom-render' },
                        { text: '连线样式', link: '/guide/line-style' },
                    ],
                },
                {
                    text: 'API',
                    items: [{ text: '组件 & 类型', link: '/api/' }],
                },
            ],
        },
        socialLinks: [{ icon: 'github', mode: 'link', content: 'https://github.com/chenJJ-88/react-cascading-input' }],
    },
});
