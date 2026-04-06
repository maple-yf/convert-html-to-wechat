#!/usr/bin/env node
/**
 * HTML to WeChat Converter
 * 将带 <style> 标签的 HTML 转换为微信公众号兼容格式
 * 
 * 使用方法：
 *   node convert_html_to_wechat.js <input.html> [output.html]
 * 
 * 示例：
 *   node convert_html_to_wechat.js output/lobster-ecosystem-v2.html
 */

const juice = require('juice');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// 检查参数
if (process.argv.length < 3) {
  console.log('❌ 用法: node convert_html_to_wechat.js <input.html> [output.html]');
  console.log('\n示例:');
  console.log('  node convert_html_to_wechat.js output/lobster-ecosystem-v2.html');
  console.log('  node convert_html_to_wechat.js input.html output-wechat.html');
  process.exit(1);
}

const inputFile = process.argv[2];
const outputFile = process.argv[3] || inputFile.replace('.html', '-wechat.html');

// 检查文件是否存在
if (!fs.existsSync(inputFile)) {
  console.log(`❌ 文件不存在: ${inputFile}`);
  process.exit(1);
}

console.log('🔄 开始转换...');
console.log(`📥 输入: ${inputFile}`);
console.log(`📤 输出: ${outputFile}\n`);

try {
  // 1. 读取 HTML
  console.log('Step 1: 读取 HTML 文件...');
  const html = fs.readFileSync(inputFile, 'utf8');
  
  // 2. CSS Inlining
  console.log('Step 2: CSS Inlining (转换 <style> 标签为内联样式)...');
  const inlinedHtml = juice(html, {
    extraCss: '',
    applyStyleTags: true,
    removeStyleTags: true,
    preserveImportant: true,
    widthElements: [],
    heightElements: [],
  });
  
  // 3. 处理伪元素
  console.log('Step 3: 处理伪元素 (::before, ::after)...');
  const $ = cheerio.load(inlinedHtml);
  
  // 处理 li::before { content: "•" }
  let processedCount = 0;
  $('li').each((i, elem) => {
    const $li = $(elem);
    // 检查是否已经有 bullet
    if (!$li.find('span.wechat-bullet').length) {
      $li.prepend('<span class="wechat-bullet" style="color: #10a5ff; font-weight: bold; margin-right: 8px; display: inline-block;">•</span>');
      processedCount++;
    }
  });
  
  console.log(`   处理了 ${processedCount} 个列表项的伪元素`);
  
  // 4. 过滤不支持的 CSS 属性
  console.log('Step 4: 过滤不支持的 CSS 属性...');
  const unsupportedProps = [
    'position', 'display', 'float', 'flex', 'grid', 'transform',
    'animation', 'transition', 'box-shadow', 'text-shadow',
    'overflow', 'z-index', 'opacity', 'visibility'
  ];
  
  let filteredCount = 0;
  $('*').each((i, elem) => {
    const $elem = $(elem);
    const style = $elem.attr('style');
    if (style) {
      const filteredStyle = style
        .split(';')
        .filter(prop => {
          if (!prop.trim()) return false;
          const propName = prop.split(':')[0].trim().toLowerCase();
          const isUnsupported = unsupportedProps.some(u => propName.startsWith(u));
          if (isUnsupported) filteredCount++;
          return !isUnsupported;
        })
        .join(';');
      
      if (filteredStyle.trim()) {
        $elem.attr('style', filteredStyle);
      } else {
        $elem.removeAttr('style');
      }
    }
  });
  
  console.log(`   过滤了 ${filteredCount} 个不支持的 CSS 属性`);
  
  // 5. 保存结果
  console.log('\nStep 5: 保存转换结果...');
  const finalHtml = $.html();
  fs.writeFileSync(outputFile, finalHtml);
  
  // 统计信息
  const stats = {
    originalSize: (html.length / 1024).toFixed(2),
    finalSize: (finalHtml.length / 1024).toFixed(2),
    lines: finalHtml.split('\n').length,
  };
  
  console.log('\n✅ 转换完成！\n');
  console.log('📊 统计信息:');
  console.log(`   原始大小: ${stats.originalSize} KB`);
  console.log(`   转换后大小: ${stats.finalSize} KB`);
  console.log(`   行数: ${stats.lines}`);
  console.log(`   处理的伪元素: ${processedCount}`);
  console.log(`   过滤的属性: ${filteredCount}`);
  
  console.log('\n📋 下一步操作:');
  console.log(`   1. 在浏览器中打开: open ${outputFile}`);
  console.log('   2. 全选（Cmd/Ctrl + A）并复制');
  console.log('   3. 粘贴到微信公众号编辑器');
  console.log('   4. 在手机上预览并微调\n');
  
} catch (error) {
  console.error('\n❌ 转换失败:', error.message);
  console.error('\n可能的原因:');
  console.error('   - HTML 文件格式错误');
  console.error('   - CSS 语法错误');
  console.error('   - 缺少依赖（请运行: npm install juice cheerio）');
  process.exit(1);
}
