# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev            # start demo dev server
pnpm build          # typecheck (src only) + vite library build → dist/
pnpm test           # vitest run (all tests once)
pnpm test:watch     # vitest watch mode
pnpm typecheck      # tsc --noEmit for src + demo + node configs
pnpm lint           # biome check
pnpm lint:fix       # biome check --write (auto-fix)
```

Run a single test file:
```bash
pnpm vitest run __tests__/useTreeData.test.ts
```

## Architecture

This is a **library** project. `src/index.ts` is the published entry point; `demo/` and `__tests__/` are dev-only and excluded from the build.

**Data model:** `TreeNode[]` — a recursive tree where each node carries dynamic fields keyed by `ColumnConfig.dataIndex`, plus `id` and `children`. The tree is fully controlled: callers own state, pass `value` + `onChange`.

**Core split:**
- `src/CascadingInput.tsx` — renders the tree recursively via `renderLevel()`, wires up hooks, provides `DefaultCellRenderer` (native HTML). Each cell gets `id="cell-${node.id}"` for Canvas targeting.
- `src/hooks/useTreeData.ts` — pure tree mutation helpers (`createChain`, `updateTreeValue`, `addSiblingNode`, `deleteNodeCascade`) plus `useTreeData` hook and `ensureInitialData`. All helpers are exported and unit-tested directly.
- `src/hooks/useCanvasLines.ts` — reads DOM positions via `getBoundingClientRect()` on `#cell-${id}` elements and draws lines on a `<canvas>` overlay. Uses `useLayoutEffect` to draw before paint; `ResizeObserver` for container resizes.

**Headless pattern:** Every column can supply `ColumnConfig.render` to fully replace the cell UI. Without it, `DefaultCellRenderer` is used. This is how antd/any-UI-library integration works — no hard dependency.

**tsconfig setup:** Project references split: `tsconfig.src.json` (lib), `tsconfig.demo.json` (demo + tests), `tsconfig.node.json` (vite configs). `tsconfig.base.json` holds shared `compilerOptions`.

**Build output:** `dist/index.js` (ESM), `dist/index.cjs` (CJS), `dist/index.d.ts` (types), `dist/style.css`. CSS export is `"./styles": "./dist/style.css"` — `cssFileName: 'style'` in `vite.config.ts` controls this.
