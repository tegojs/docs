# 扩展字段组件

## 1. 介绍

### 背景说明

在现有项目中，我们通过扩展字段类型的方式支持自定义字段功能。这种机制虽然灵活，但存在一定的局限性：

某些场景下，我们并不需要新增一种字段类型，而是希望改变现有字段的展示形式，以适应不同的业务需求或用户体验优化。

以 URL 字段为例，目前它通常以纯文本方式展示。但我们可能需要以下多种展示方式：
- 作为可点击的链接；
- 显示链接预览（如网页标题或缩略图）；
- 仅展示域名部分；
- 自定义格式化输出等。

这类需求并不需要新建字段类型，而应视为字段展示层的扩展能力。

### 解决方案

通过 `CollectionFieldInterfaceManager` 提供的扩展机制，我们可以为现有字段类型添加多种展示组件选项，让用户能够根据具体需求选择合适的展示方式。

## 2. 核心概念

### 字段接口组件选项

```tsx
interface CollectionFieldInterfaceComponentOption {
  label: string;           // 展示给用户的标签名称
  value: string;           // 组件的唯一标识符
  useVisible?: () => boolean;  // 控制该选项是否可见
  useProps?: () => any;    // 返回传递给组件的属性
}
```

### 管理器接口

```tsx
class CollectionFieldInterfaceManager {
  // 为指定字段类型添加展示组件选项
  addFieldInterfaceComponentOption(
    interfaceName: string, 
    componentOption: CollectionFieldInterfaceComponentOption
  ): void;
}
```

## 3. 基础用法

```tsx
// 定义
interface CollectionFieldInterfaceComponentOption {
  label: string;
  value: string;
  useVisible?: () => boolean;
  useProps?: () => any;
}

class CollectionFieldInterfaceManager {
  addFieldInterfaceComponentOption(interfaceName: string, componentOption: CollectionFieldInterfaceComponentOption): void
}

// 用法
class MyPlugin extends Plugin {
  async load() {
    this.app.dataSourceManager.collectionFieldInterfaceManager.addFieldInterfaceComponentOption('url', {
      label: 'Preview',
      value: 'Input.Preview',
    });
  }
}
```

## 4. 使用场景

### 4.1 URL 字段多展示形式

```tsx
class UrlDisplayPlugin extends Plugin {
  async load() {
    const manager = this.app.dataSourceManager.collectionFieldInterfaceManager;
    
    // 1. 可点击链接展示
    manager.addFieldInterfaceComponentOption('url', {
      label: '可点击链接',
      value: 'UrlField.ClickableLink',
      useProps: () => ({
        target: '_blank',
        rel: 'noopener noreferrer'
      })
    });
    
    // 2. 链接预览展示
    manager.addFieldInterfaceComponentOption('url', {
      label: '链接预览',
      value: 'UrlField.Preview',
      useProps: () => ({
        showTitle: true,
        showThumbnail: true,
        maxWidth: 300
      })
    });
    
    // 3. 域名展示
    manager.addFieldInterfaceComponentOption('url', {
      label: '仅显示域名',
      value: 'UrlField.DomainOnly',
      useProps: () => ({
        showProtocol: false,
        showPath: false
      })
    });
    
    // 4. 格式化展示
    manager.addFieldInterfaceComponentOption('url', {
      label: '格式化显示',
      value: 'UrlField.Formatted',
      useProps: () => ({
        format: 'short',
        maxLength: 50
      })
    });
  }
}
```

### 4.2 数字字段多展示形式

```tsx
class NumberDisplayPlugin extends Plugin {
  async load() {
    const manager = this.app.dataSourceManager.collectionFieldInterfaceManager;
    
    // 1. 货币格式
    manager.addFieldInterfaceComponentOption('number', {
      label: '货币格式',
      value: 'NumberField.Currency',
      useProps: () => ({
        currency: 'CNY',
        precision: 2
      })
    });
    
    // 2. 百分比格式
    manager.addFieldInterfaceComponentOption('number', {
      label: '百分比',
      value: 'NumberField.Percentage',
      useProps: () => ({
        precision: 1,
        suffix: '%'
      })
    });
    
    // 3. 科学计数法
    manager.addFieldInterfaceComponentOption('number', {
      label: '科学计数法',
      value: 'NumberField.Scientific',
      useProps: () => ({
        notation: 'scientific',
        precision: 3
      })
    });
  }
}
```

### 4.3 日期字段多展示形式

```tsx
class DateDisplayPlugin extends Plugin {
  async load() {
    const manager = this.app.dataSourceManager.collectionFieldInterfaceManager;
    
    // 1. 相对时间
    manager.addFieldInterfaceComponentOption('datetime', {
      label: '相对时间',
      value: 'DateField.Relative',
      useProps: () => ({
        format: 'relative',
        updateInterval: 60000 // 每分钟更新
      })
    });
    
    // 2. 自定义格式
    manager.addFieldInterfaceComponentOption('datetime', {
      label: '自定义格式',
      value: 'DateField.Custom',
      useProps: () => ({
        format: 'YYYY年MM月DD日 HH:mm:ss'
      })
    });
    
    // 3. 时间范围
    manager.addFieldInterfaceComponentOption('datetime', {
      label: '时间范围',
      value: 'DateField.Range',
      useProps: () => ({
        showRange: true,
        rangeFormat: 'YYYY-MM-DD'
      })
    });
  }
}
```

## 5. 条件显示

### 5.1 基于字段值控制显示

```tsx
manager.addFieldInterfaceComponentOption('url', {
  label: '高级预览',
  value: 'UrlField.AdvancedPreview',
  useVisible: () => {
    // 只在特定条件下显示此选项
    const currentUser = this.app.getCurrentUser();
    return currentUser.hasPermission('advanced_preview');
  },
  useProps: () => ({
    showMetadata: true,
    showSecurityInfo: true
  })
});
```

### 5.2 基于环境控制显示

```tsx
manager.addFieldInterfaceComponentOption('url', {
  label: '开发模式预览',
  value: 'UrlField.DevPreview',
  useVisible: () => {
    return process.env.NODE_ENV === 'development';
  },
  useProps: () => ({
    showDebugInfo: true,
    showPerformance: true
  })
});
```

## 6. 完整示例

### 6.1 插件定义

```tsx
import { Plugin } from '@tachybase/client';

export class FieldDisplayExtensionsPlugin extends Plugin {
  async load() {
    this.registerUrlFieldExtensions();
    this.registerNumberFieldExtensions();
    this.registerDateFieldExtensions();
  }
  
  private registerUrlFieldExtensions() {
    const manager = this.app.dataSourceManager.collectionFieldInterfaceManager;
    
    // 基础链接展示
    manager.addFieldInterfaceComponentOption('url', {
      label: '基础链接',
      value: 'UrlField.Basic',
      useProps: () => ({
        target: '_blank',
        className: 'url-link'
      })
    });
    
    // 智能预览
    manager.addFieldInterfaceComponentOption('url', {
      label: '智能预览',
      value: 'UrlField.SmartPreview',
      useProps: () => ({
        fetchMetadata: true,
        showFavicon: true,
        showDescription: true,
        maxDescriptionLength: 100
      })
    });
    
    // 安全链接
    manager.addFieldInterfaceComponentOption('url', {
      label: '安全链接',
      value: 'UrlField.Secure',
      useProps: () => ({
        showSecurityBadge: true,
        validateSSL: true,
        showDomainInfo: true
      })
    });
  }
  
  private registerNumberFieldExtensions() {
    const manager = this.app.dataSourceManager.collectionFieldInterfaceManager;
    
    // 千分位分隔
    manager.addFieldInterfaceComponentOption('number', {
      label: '千分位分隔',
      value: 'NumberField.Thousands',
      useProps: () => ({
        separator: ',',
        precision: 0
      })
    });
    
    // 文件大小
    manager.addFieldInterfaceComponentOption('number', {
      label: '文件大小',
      value: 'NumberField.FileSize',
      useProps: () => ({
        format: 'fileSize',
        precision: 2
      })
    });
  }
  
  private registerDateFieldExtensions() {
    const manager = this.app.dataSourceManager.collectionFieldInterfaceManager;
    
    // 倒计时
    manager.addFieldInterfaceComponentOption('datetime', {
      label: '倒计时',
      value: 'DateField.Countdown',
      useProps: () => ({
        format: 'countdown',
        showDays: true,
        showHours: true,
        showMinutes: true
      })
    });
  }
}
```

### 6.2 使用方式

```tsx
// 在应用中注册插件
import { FieldDisplayExtensionsPlugin } from './plugins/FieldDisplayExtensionsPlugin';

const app = new Application({
  plugins: [
    FieldDisplayExtensionsPlugin,
    // 其他插件...
  ]
});
```

## 7. 最佳实践

### 7.1 命名规范

- 组件值使用 `FieldType.ComponentName` 格式
- 标签使用简洁明了的中文描述
- 保持命名的一致性和可读性

### 7.2 性能优化

- 在 `useProps` 中避免复杂的计算
- 合理使用 `useVisible` 控制选项显示
- 缓存计算结果避免重复计算

### 7.3 用户体验

- 提供合理的默认选项
- 根据用户权限和环境动态调整选项
- 保持选项的简洁性，避免过度复杂

### 7.4 扩展性

- 设计可复用的组件选项
- 支持配置化的属性传递
- 考虑未来可能的扩展需求

## 8. 注意事项

1. **组件注册**：确保相应的展示组件已经正确注册到系统中
2. **属性兼容性**：传递给组件的属性需要与组件接口兼容
3. **性能影响**：过多的展示选项可能影响用户选择体验
4. **维护成本**：需要维护多个展示组件的实现和测试

## 9. 总结

通过字段展示扩展机制，我们可以在不改变字段类型的情况下，为现有字段提供丰富的展示形式。这种设计既保持了系统的灵活性，又避免了不必要的复杂性，是提升用户体验的有效方式。
