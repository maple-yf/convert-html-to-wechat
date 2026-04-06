---
name: convert-html-to-wechat
description: 将带 <style> 标签的 HTML 转换为微信公众号兼容格式。当用户提到微信公众号文章、微信编辑器、HTML 转微信、公众号排版、WeChat article、公众号样式、内联样式转换、CSS inlining for WeChat 时触发此技能。也适用于用户想把网页内容发到公众号、HTML 粘贴到微信编辑器后样式丢失、或需要处理微信不支持的 CSS 属性的场景。
---

# HTML 转微信公众号格式

将带有 `<style>` 标签的 HTML 自动转换为微信公众号编辑器兼容的纯内联样式格式。

微信公众号编辑器会过滤掉 `<style>` 标签、伪元素、大部分布局属性，导致粘贴 HTML 后样式全丢。这个工具解决了这个问题。

## 转换流程

脚本路径: `scripts/convert_html_to_wechat.js`（相对于本 skill 根目录）

运行前确保依赖已安装：在 skill 根目录执行 `npm install`

### 执行转换

```bash
node <skill-path>/scripts/convert_html_to_wechat.js <input.html> [output.html]
```

- `<input.html>`: 带 `<style>` 标签的 HTML 文件
- `[output.html]`: 可选，默认为 `<input>-wechat.html`

脚本做了四件事：

1. **CSS Inlining** — 用 [Juice](https://github.com/Automattic/juice) 将 `<style>` 中的样式转为内联 `style` 属性
2. **伪元素转换** — 将 `li::before` 等伪元素转为真实 `<span>` 元素
3. **`<div>` 转 `<section>`** — 将带背景样式的 `<div>` 转为 `<section>`（微信编辑器不保留 `<div>` 的 `background`，但 `<section>` 可以）
4. **过滤不支持的属性** — 移除 `position`, `display`, `flex`, `transform` 等微信不支持的 CSS 属性

### 转换后使用

1. 在浏览器中打开输出的 HTML 文件
2. 全选（Cmd/Ctrl + A）并复制
3. 粘贴到微信公众号编辑器
4. 手机预览并微调

## 微信公众号的限制

了解这些限制有助于在编写原始 HTML 时就避免问题：

### 支持的 CSS 属性

颜色、字体、间距、边框、背景、圆角、文本对齐等基础属性都能正常工作。

### 不支持的特性

- `<style>` 标签和外部 CSS（会被过滤）
- 伪元素 `::before` / `::after`（脚本会自动转换 `li::before`）
- 伪类 `:hover` / `:focus` / `:nth-child`
- 布局属性: `position`, `display`, `float`, `flex`, `grid`
- 动画和变换: `transform`, `animation`, `transition`
- `box-shadow`, `text-shadow`, `overflow`, `z-index`, `opacity`

### 推荐写法

```css
/* 用这些 — 微信完整支持 */
color: #10a5ff;
background-color: #e8f5e9;
font-size: 16px;
margin: 15px 0;
padding: 10px 20px;
border: 1px solid #ddd;
border-left: 4px solid #10a5ff;
border-radius: 8px;
text-align: center;
line-height: 1.8;
```

## 给 Claude 的工作指引

当用户需要将 HTML 内容发到微信公众号时：

1. 确认用户有 HTML 文件需要转换
2. 检查 skill 根目录的 `node_modules` 是否存在，不存在则运行 `npm install`
3. 执行转换脚本
4. 告诉用户输出文件路径，以及如何在微信编辑器中使用

如果用户还没有 HTML 文件，而是想从头创建公众号文章，帮助他们生成符合微信限制的 HTML（只用内联样式、避免不支持属性），然后同样可以用脚本做最终检查和转换。

如果转换后样式不满意，检查脚本输出中"过滤的属性"数量，可能需要调整原始 HTML 中被过滤掉的属性。
