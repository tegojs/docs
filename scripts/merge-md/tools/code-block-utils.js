/**
 * 代码块检测工具
 * 
 * 用于在 Markdown 内容处理时识别和保护代码块，
 * 避免对代码块内的内容进行错误的处理（如链接转换、图片处理等）
 */

/**
 * 提取 Markdown 文档中所有代码块的位置
 * 
 * 支持三种类型的代码块：
 * 1. 围栏代码块（fenced）：```...```
 * 2. 缩进代码块（indented）：每行至少4个空格或1个tab
 * 3. 行内代码（inline）：`code` 或 ``code``
 * 
 * @param {string} content - Markdown 文档内容
 * @returns {Array<{start: number, end: number, type: string}>} 代码块位置数组
 */
function extractCodeBlocks(content) {
  const blocks = [];
  
  // 1. 围栏代码块 (```) - 最高优先级
  let regex = /```[\s\S]*?```/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    blocks.push({
      start: match.index,
      end: match.index + match[0].length,
      type: 'fenced',
    });
  }
  
  // 2. 缩进代码块（每行至少4个空格或1个tab）
  // 按行分析，连续的缩进行视为一个代码块
  // 但需要排除已在围栏代码块内的区域
  const lines = content.split('\n');
  let inIndentedBlock = false;
  let blockStart = 0;
  let currentPos = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isIndented = /^( {4,}|\t)/.test(line);
    const isEmpty = /^\s*$/.test(line);
    
    // 检查当前位置是否在围栏代码块内
    const inFencedBlock = blocks.some(
      block => block.type === 'fenced' && currentPos >= block.start && currentPos < block.end
    );
    
    if (isIndented && !inIndentedBlock && !inFencedBlock) {
      // 开始新的缩进代码块（不在围栏代码块内）
      inIndentedBlock = true;
      blockStart = currentPos;
    } else if (!isIndented && !isEmpty && inIndentedBlock) {
      // 结束缩进代码块（非空且非缩进行）
      blocks.push({
        start: blockStart,
        end: currentPos,
        type: 'indented',
      });
      inIndentedBlock = false;
    } else if (inFencedBlock && inIndentedBlock) {
      // 如果进入围栏代码块，结束当前的缩进代码块
      blocks.push({
        start: blockStart,
        end: currentPos,
        type: 'indented',
      });
      inIndentedBlock = false;
    }
    
    currentPos += line.length + 1; // +1 for newline
  }
  
  // 处理文件末尾的缩进代码块
  if (inIndentedBlock) {
    blocks.push({
      start: blockStart,
      end: content.length,
      type: 'indented',
    });
  }
  
  // 3. 行内代码（单个或多个反引号）
  // 只在非代码块区域检测
  regex = /`[^`\n]+`/g;
  while ((match = regex.exec(content)) !== null) {
    // 检查是否在已有的代码块内
    const inExistingBlock = blocks.some(
      block => match.index >= block.start && match.index < block.end
    );
    if (!inExistingBlock) {
      blocks.push({
        start: match.index,
        end: match.index + match[0].length,
        type: 'inline',
      });
    }
  }
  
  // 多反引号行内代码（2个或更多）
  regex = /``+[^\n]*?``+/g;
  while ((match = regex.exec(content)) !== null) {
    const inExistingBlock = blocks.some(
      block => match.index >= block.start && match.index < block.end
    );
    if (!inExistingBlock) {
      blocks.push({
        start: match.index,
        end: match.index + match[0].length,
        type: 'inline',
      });
    }
  }
  
  return blocks;
}

/**
 * 检查指定偏移量是否在代码块内
 * 
 * @param {number} offset - 要检查的字符偏移量
 * @param {Array<{start: number, end: number}>} codeBlocks - 代码块位置数组
 * @returns {boolean} 如果在代码块内返回 true，否则返回 false
 */
function isInCodeBlock(offset, codeBlocks) {
  return codeBlocks.some(block => offset >= block.start && offset <= block.end);
}

/**
 * 在代码块外部进行内容替换
 * 
 * 这个函数会查找所有匹配项，但只替换代码块外的内容，
 * 保护代码块内的内容不被修改
 * 
 * @param {string} content - 要处理的内容
 * @param {Array<{start: number, end: number}>} codeBlocks - 代码块位置数组
 * @param {RegExp} pattern - 要匹配的正则表达式
 * @param {string|function} replacement - 替换内容或替换函数
 * @returns {string} 处理后的内容
 */
function replaceOutsideCodeBlocks(content, codeBlocks, pattern, replacement) {
  // 如果没有代码块，直接替换
  if (codeBlocks.length === 0) {
    return content.replace(pattern, replacement);
  }
  
  // 收集所有匹配项
  const matches = [];
  let match;
  const regex = new RegExp(pattern.source, pattern.flags);
  
  while ((match = regex.exec(content)) !== null) {
    // 检查是否在代码块内
    if (!isInCodeBlock(match.index, codeBlocks)) {
      matches.push({
        index: match.index,
        length: match[0].length,
        replacement: typeof replacement === 'string' 
          ? replacement 
          : match[0].replace(pattern, replacement),
      });
    }
  }
  
  // 从后向前替换（避免索引变化）
  matches.reverse();
  for (const m of matches) {
    content = content.substring(0, m.index) + m.replacement + content.substring(m.index + m.length);
  }
  
  return content;
}

module.exports = {
  extractCodeBlocks,
  isInCodeBlock,
  replaceOutsideCodeBlocks,
};

