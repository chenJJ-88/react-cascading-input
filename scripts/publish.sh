#!/usr/bin/env bash
set -euo pipefail

# 确保在项目根目录
cd "$(dirname "$0")/.."

# 获取当前版本
CURRENT_VERSION=$(node -p "require('./package.json').version")

echo "📦 当前版本: $CURRENT_VERSION"
echo ""
echo "选择版本更新类型:"
echo "  patch  - 修复 bug (z+1)"
echo "  minor  - 新功能，向后兼容 (y+1)"
echo "  major  - 破坏性变更 (x+1)"
echo "  custom - 自定义版本号"
echo ""

read -r BUMP_TYPE

case "$BUMP_TYPE" in
    patch)
        IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"
        NEW_VERSION="$MAJOR.$MINOR.$((PATCH + 1))"
        ;;
    minor)
        IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"
        NEW_VERSION="$MAJOR.$((MINOR + 1)).0"
        ;;
    major)
        IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"
        NEW_VERSION="$((MAJOR + 1)).0.0"
        ;;
    custom)
        read -r -p "输入新版本号: " NEW_VERSION
        ;;
    *)
        echo "❌ 无效选择，退出"
        exit 1
        ;;
esac

echo ""
echo "🚀 将发布: react-cascading-input@$NEW_VERSION"
read -r -p "确认? (y/N) " CONFIRM

if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
    echo "已取消"
    exit 0
fi

# 更新 package.json 版本
node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json','utf8'));p.version='$NEW_VERSION';fs.writeFileSync('package.json',JSON.stringify(p,null,4)+'\n');"

echo "✅ 版本已更新到 $NEW_VERSION"

# 构建
echo "🔨 构建中..."
source ~/.nvm/nvm.sh && nvm use 22
pnpm build

# 发布（会弹出浏览器指纹验证）
echo "📤 发布中..."
npm publish --access public

echo ""
echo "🎉 发布成功! react-cascading-input@$NEW_VERSION"
echo ""
echo "💡 记得提交代码: git add -A && git commit -m 'release: v$NEW_VERSION' && git push"
