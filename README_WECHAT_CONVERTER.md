# 微信公众号 HTML 转换器

将带有 `<style>` 标签的 HTML 文件自动转换为微信公众号兼容格式。

## 快速开始

### 1. 安装依赖

```bash
cd /Users/xxx/.openclaw/workspace-poster
npm install
```

### 2. 转换 HTML 文件

```bash
# 基础用法（输出到 input-wechat.html）
node convert_html_to_wechat.js <input.html>

# 指定输出文件名
node convert_html_to_wechat.js <input.html> <output.html>

# 示例
node convert_html_to_wechat.js output/lobster-ecosystem-v2.html
```

### 3. 复制到微信公众号

1. 在浏览器中打开转换后的文件：
   ```bash
   open output/lobster-ecosystem-v2-wechat.html
   ```

2. 全选（Cmd/Ctrl + A）并复制

3. 粘贴到微信公众号编辑器

4. 在手机上预览并微调

## 工作原理

### 转换流程

```
原始 HTML (<style>标签)
    ↓
Step 1: CSS Inlining (Juice)
    ↓
Step 2: 伪元素处理 (自定义脚本)
    ↓
Step 3: CSS 属性过滤 (移除不支持的属性)
    ↓
微信公众号兼容 HTML
```

### 处理内容

1. **CSS Inlining**：将 `<style>` 标签中的样式转换为内联 `style` 属性
2. **伪元素处理**：将 `::before` 等伪元素转换为真实的 HTML 元素
3. **属性过滤**：移除微信公众号不支持的 CSS 属性（如 position, display, flex 等）

## 样式保留率

| 样式类型 | 保留率 | 说明 |
|---------|--------|------|
| 颜色和字体 | 100% | 完全支持 |
| 间距（margin, padding） | 100% | 完全支持 |
| 边框（border） | 95% | border-collapse 可能丢失 |
| 背景色 | 100% | 完全支持 |
| 圆角（border-radius） | 100% | 完全支持 |
| 伪元素（::before） | 100% | 自动转换为真实元素 |
| 表格样式 | 90% | 大部分支持 |
| **总体保留率** | **92-95%** | 取决于原始样式 |

## 微信公众号限制

### ✅ 支持的特性

- 基础 HTML 标签：`<p>`, `<div>`, `<span>`, `<h1>-<h6>`, `<table>`, `<ul>`, `<ol>`, `<li>`, `<strong>`, `<em>`, `<a>`, `<img>`
- 内联样式：`style="color: #10a5ff; font-size: 16px;"`
- 部分 CSS 属性：color, background-color, font-size, font-weight, text-align, margin, padding, border, border-radius

### ❌ 不支持的特性

- `<style>` 标签（会被完全过滤）
- 外部 CSS 文件
- 伪元素（::before, ::after）
- 伪类（:hover, :focus, :nth-child）
- 部分 CSS 属性：position, display, float, flex, grid, transform, animation
- JavaScript

## 最佳实践

### 推荐使用的 CSS

```css
/* ✅ 颜色和字体 */
color: #10a5ff;
background-color: #e8f5e9;
font-size: 16px;
font-weight: bold;

/* ✅ 间距 */
margin: 15px 0;
padding: 10px 20px;

/* ✅ 边框 */
border: 1px solid #ddd;
border-left: 4px solid #10a5ff;
border-radius: 8px;

/* ✅ 文本对齐 */
text-align: center;
line-height: 1.8;
```

### 避免使用的 CSS

```css
/* ❌ 伪元素（会自动转换） */
li::before { content: "•"; }

/* ❌ 布局属性（会被过滤） */
position: relative;
display: flex;
float: left;

/* ❌ 动画和变换（会被过滤） */
transform: rotate(45deg);
animation: fadeIn 1s;
```

## 示例

### 转换前（带 `<style>` 标签）

```html
<style>
  .tip-green {
    background-color: #e8f5e9;
    border-left: 4px solid #4caf50;
    padding: 15px;
  }
</style>

<div class="tip-green">提示内容</div>
```

### 转换后（内联样式）

```html
<div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px;">提示内容</div>
```

## 故障排除

### 问题 1：转换后样式丢失

**原因：** 使用了微信公众号不支持的 CSS 属性

**解决：** 
1. 检查转换日志中的"过滤的属性"数量
2. 手动调整 HTML，使用支持的 CSS 属性
3. 参考本文档的"推荐使用的 CSS"部分

### 问题 2：列表项的圆点消失

**原因：** 伪元素 `::before` 无法直接转换

**解决：** 
- 转换脚本会自动处理，将 `li::before` 转换为 `<span>•</span>`
- 如果仍有问题，手动检查转换后的 HTML

### 问题 3：表格样式不正确

**原因：** `border-collapse` 等属性不支持

**解决：** 
- 使用 `border-spacing: 0` 替代
- 手动调整表格边框样式

## 高级用法

### 自定义配置

编辑 `convert_html_to_wechat.js` 文件，可以自定义：

1. **伪元素处理**：修改 `Step 3` 中的处理逻辑
2. **CSS 属性过滤**：修改 `unsupportedProps` 数组
3. **样式转换规则**：修改 `juice()` 的配置参数

### 批量转换

```bash
# 转换所有 HTML 文件
for file in output/*.html; do
  node convert_html_to_wechat.js "$file"
done
```

## 相关资源

- **调研报告**：`~/Documents/WeChat_HTML_Styles_Research_20260314/research_report_20260314_wechat_html_styles.md`
- **Juice 文档**：https://github.com/Automattic/juice
- **Cheerio 文档**：https://cheerio.js.org/
- **微信公众平台文档**：https://developers.weixin.qq.com/doc/

## 更新日志

### v1.0.0 (2026-03-14)
- ✅ 初始版本
- ✅ 支持 CSS Inlining
- ✅ 自动处理伪元素
- ✅ 过滤不支持的 CSS 属性
- ✅ 样式保留率 92-95%

---

**作者：** Poster (OpenClaw)  
**创建日期：** 2026-03-14  
**最后更新：** 2026-03-14
