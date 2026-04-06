# convert-html-to-wechat

将带 `<style>` 标签的 HTML 自动转换为微信公众号编辑器兼容的纯内联样式格式。

微信公众号编辑器会过滤掉 `<style>` 标签、伪元素、大部分布局属性，导致粘贴 HTML 后样式全丢。这个工具解决了这个问题。

## 安装

```bash
npm install
```

## 使用

```bash
# 基础用法（输出为 input-wechat.html）
node scripts/convert_html_to_wechat.js <input.html>

# 指定输出文件名
node scripts/convert_html_to_wechat.js <input.html> <output.html>
```

转换完成后：

1. 在浏览器中打开输出的 HTML 文件
2. 全选（Cmd/Ctrl + A）并复制
3. 粘贴到微信公众号编辑器
4. 手机预览并微调

## 转换流程

```
原始 HTML (<style>标签)
    ↓ CSS Inlining (Juice)
    ↓ 伪元素转换 (li::before → <span>)
    ↓ 过滤不支持的 CSS 属性
微信公众号兼容 HTML
```

脚本做了三件事：

1. **CSS Inlining** — 用 [Juice](https://github.com/Automattic/juice) 将 `<style>` 中的样式转为内联 `style` 属性
2. **伪元素转换** — 将 `li::before` 等伪元素转为真实 `<span>` 元素
3. **过滤不支持的属性** — 移除 `position`, `display`, `flex`, `transform` 等微信不支持的 CSS 属性

## 微信公众号的限制

### 支持的 CSS

颜色、字体、间距、边框、背景、圆角、文本对齐等基础属性。

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

### 不支持的特性

- `<style>` 标签和外部 CSS（会被过滤）
- 伪元素 `::before` / `::after`（脚本会自动转换 `li::before`）
- 伪类 `:hover` / `:focus` / `:nth-child`
- 布局属性: `position`, `display`, `float`, `flex`, `grid`
- 动画和变换: `transform`, `animation`, `transition`
- `box-shadow`, `text-shadow`, `overflow`, `z-index`, `opacity`

## 许可

[Apache License 2.0](LICENSE)
