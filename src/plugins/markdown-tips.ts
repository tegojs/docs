import type { Plugin } from '@rspress/shared';

export interface MarkdownTipsOptions {
  // 自定义提示框样式
  customStyles?: Record<string, string>;
  // 是否启用图标
  enableIcons?: boolean;
  // 自定义图标映射
  iconMap?: Record<string, string>;
}

export function pluginMarkdownTips(options: MarkdownTipsOptions = {}): Plugin {
  const {
    customStyles = {},
    enableIcons = true,
    iconMap = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      success: '✅',
      tip: '💡',
      note: '📝',
      important: '🔥',
      question: '❓',
      example: '💡',
      quote: '💬',
    },
  } = options;

  return {
    name: 'markdown-tips',

    // 添加 Markdown 处理器
    markdown: {
      remarkPlugins: [
        () => (tree: any) => {
          // 处理自定义容器语法
          const visit = (node: any) => {
            if (node.type === 'containerDirective') {
              const type = node.name;
              const title = node.children?.[0]?.children?.[0]?.value || type;
              const content = node.children?.slice(1) || [];

              // 创建自定义提示框
              const tipNode = {
                type: 'html',
                value: `
                  <div class="markdown-tip ${type}">
                    <div class="markdown-tip-header">
                      ${enableIcons && iconMap[type] ? `<span class="markdown-tip-icon">${iconMap[type]}</span>` : ''}
                      <span>${title}</span>
                    </div>
                    <div class="markdown-tip-content">
                      ${content
                        .map((child: any) => {
                          if (child.type === 'paragraph') {
                            return `<p>${child.children?.map((c: any) => c.value || '').join('') || ''}</p>`;
                          }
                          return '';
                        })
                        .join('')}
                    </div>
                  </div>
                `,
              };

              // 替换原始节点
              Object.assign(node, tipNode);
            }

            if (node.children) {
              node.children.forEach(visit);
            }
          };

          visit(tree);
        },
      ],
    },
  };
}
