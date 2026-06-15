# 贡献指南 (Contributing)

感谢你对 `react-cascading-input` 的关注！欢迎提 Issue、PR 或参与讨论。

## 环境要求

- Node.js `>= 18`
- pnpm（项目锁定版本见 `package.json` 的 `packageManager` 字段，首次可 `corepack enable` 自动启用）

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动 demo 开发服务器（Vite）
pnpm dev

# 类型检查
pnpm typecheck

# 运行单元测试
pnpm test

# 构建（先类型检查再打包到 dist/）
pnpm build
```

## 代码规范

- 提交前会自动通过 husky + lint-staged 运行 Biome（见 `.husky/pre-commit`）。
- 手动检查：

```bash
pnpm lint          # Biome lint + 格式检查
pnpm lint:fix      # 自动修复 lint 问题和格式
pnpm format:check  # 仅格式检查
pnpm format        # 自动格式化
```

- 代码风格：4 空格缩进、单引号、尾随逗号、语句分号（由 Biome 强制，配置见 `biome.json`）。
- 请保持已有注释密度与命名风格，新增逻辑尽量复用 `src/hooks` 中已有工具。

## 项目结构

```
src/
├── index.ts              # 库入口
├── types.ts              # 类型定义
├── CascadingInput.tsx    # 主组件（Headless 逻辑 + 默认渲染器）
├── hooks/
│   ├── useTreeData.ts    # 树数据增删改
│   └── useCanvasLines.ts # Canvas 关系线绘制
└── styles/
    └── index.css         # 默认渲染器样式
demo/                     # 本地 demo（不发布）
__tests__/                # 单元测试（Vitest + Testing Library）
```

## 提交与 PR 流程

1. Fork 仓库并新建分支：`feat/xxx`、`fix/xxx` 或 `docs/xxx`。
2. 保证 `pnpm lint`、`pnpm typecheck`、`pnpm test`、`pnpm build` 全部通过。
3. 如果新增/修改了对外 API，请同步更新 `README.md` 与测试用例。
4. 提交 PR，描述清楚动机与改动点。CI（GitHub Actions）会自动跑 lint / typecheck / test / build。

## 行为准则

请保持友善、尊重，致力于建设包容的开源社区。
