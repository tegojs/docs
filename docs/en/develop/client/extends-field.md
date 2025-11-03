# Extending Field Components

## 1. Introduction

### Background

In existing projects, we support custom field functionality by extending field types. While this mechanism is flexible, it has certain limitations:

In some scenarios, we don't need to add a new field type, but rather want to change the display form of existing fields to adapt to different business needs or user experience optimization.

Taking the URL field as an example, it is currently usually displayed as plain text. But we may need the following display methods:
- As a clickable link;
- Display link preview (such as web page title or thumbnail);
- Display only the domain part;
- Custom formatted output, etc.

These types of requirements do not need to create new field types, but should be regarded as an extension capability of the field display layer.

### Solution

Through the extension mechanism provided by `CollectionFieldInterfaceManager`, we can add multiple display component options for existing field types, allowing users to choose the appropriate display method according to specific needs.

## 2. Core Concepts

### Field Interface Component Option

```tsx
interface CollectionFieldInterfaceComponentOption {
  label: string;           // Label name displayed to the user
  value: string;           // Unique identifier for the component
  useVisible?: () => boolean;  // Control whether the option is visible
  useProps?: () => any;    // Return properties passed to the component
}
```

### Manager Interface

```tsx
class CollectionFieldInterfaceManager {
  // Add display component option for specified field type
  addFieldInterfaceComponentOption(
    interfaceName: string, 
    componentOption: CollectionFieldInterfaceComponentOption
  ): void;
}
```

## 3. Basic Usage

```tsx
// Definition
interface CollectionFieldInterfaceComponentOption {
  label: string;
  value: string;
  useVisible?: () => boolean;
  useProps?: () => any;
}

class CollectionFieldInterfaceManager {
  addFieldInterfaceComponentOption(
    interfaceName: string, 
    componentOption:CollectionFieldInterfaceComponentOption
  ): void
}

// Usage
class MyPlugin extends Plugin {
  async load() {
    this.app.dataSourceManager.
    collectionFieldInterfaceManager.
    addFieldInterfaceComponentOption('url', {
      label: 'Preview',
      value: 'Input.Preview',
    });
  }
}
```

## 4. Use Cases

### 4.1 Multiple Display Forms for URL Fields

```tsx
class UrlDisplayPlugin extends Plugin {
  async load() {
    const manager = this.app.dataSourceManager.collectionFieldInterfaceManager;
    
    // 1. Clickable link display
    manager.addFieldInterfaceComponentOption('url', {
      label: 'Clickable Link',
      value: 'UrlField.ClickableLink',
      useProps: () => ({
        target: '_blank',
        rel: 'noopener noreferrer'
      })
    });
    
    // 2. Link preview display
    manager.addFieldInterfaceComponentOption('url', {
      label: 'Link Preview',
      value: 'UrlField.Preview',
      useProps: () => ({
        showTitle: true,
        showThumbnail: true,
        maxWidth: 300
      })
    });
    
    // 3. Domain display
    manager.addFieldInterfaceComponentOption('url', {
      label: 'Domain Only',
      value: 'UrlField.DomainOnly',
      useProps: () => ({
        showProtocol: false,
        showPath: false
      })
    });
    
    // 4. Formatted display
    manager.addFieldInterfaceComponentOption('url', {
      label: 'Formatted Display',
      value: 'UrlField.Formatted',
      useProps: () => ({
        format: 'short',
        maxLength: 50
      })
    });
  }
}
```

### 4.2 Multiple Display Forms for Number Fields

```tsx
class NumberDisplayPlugin extends Plugin {
  async load() {
    const manager = this.app.dataSourceManager.collectionFieldInterfaceManager;
    
    // 1. Currency format
    manager.addFieldInterfaceComponentOption('number', {
      label: 'Currency Format',
      value: 'NumberField.Currency',
      useProps: () => ({
        currency: 'CNY',
        precision: 2
      })
    });
    
    // 2. Percentage format
    manager.addFieldInterfaceComponentOption('number', {
      label: 'Percentage',
      value: 'NumberField.Percentage',
      useProps: () => ({
        precision: 1,
        suffix: '%'
      })
    });
    
    // 3. Scientific notation
    manager.addFieldInterfaceComponentOption('number', {
      label: 'Scientific Notation',
      value: 'NumberField.Scientific',
      useProps: () => ({
        notation: 'scientific',
        precision: 3
      })
    });
  }
}
```

### 4.3 Multiple Display Forms for Date Fields

```tsx
class DateDisplayPlugin extends Plugin {
  async load() {
    const manager = this.app.dataSourceManager.collectionFieldInterfaceManager;
    
    // 1. Relative time
    manager.addFieldInterfaceComponentOption('datetime', {
      label: 'Relative Time',
      value: 'DateField.Relative',
      useProps: () => ({
        format: 'relative',
        updateInterval: 60000 // Update every minute
      })
    });
    
    // 2. Custom format
    manager.addFieldInterfaceComponentOption('datetime', {
      label: 'Custom Format',
      value: 'DateField.Custom',
      useProps: () => ({
        format: 'YYYY年MM月DD日 HH:mm:ss'
      })
    });
    
    // 3. Time range
    manager.addFieldInterfaceComponentOption('datetime', {
      label: 'Time Range',
      value: 'DateField.Range',
      useProps: () => ({
        showRange: true,
        rangeFormat: 'YYYY-MM-DD'
      })
    });
  }
}
```

## 5. Conditional Display

### 5.1 Control Display Based on Field Values

```tsx
manager.addFieldInterfaceComponentOption('url', {
  label: 'Advanced Preview',
  value: 'UrlField.AdvancedPreview',
  useVisible: () => {
    // Only show this option under specific conditions
    const currentUser = this.app.getCurrentUser();
    return currentUser.hasPermission('advanced_preview');
  },
  useProps: () => ({
    showMetadata: true,
    showSecurityInfo: true
  })
});
```

### 5.2 Control Display Based on Environment

```tsx
manager.addFieldInterfaceComponentOption('url', {
  label: 'Development Mode Preview',
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

## 6. Complete Example

### 6.1 Plugin Definition

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
    
    // Basic link display
    manager.addFieldInterfaceComponentOption('url', {
      label: 'Basic Link',
      value: 'UrlField.Basic',
      useProps: () => ({
        target: '_blank',
        className: 'url-link'
      })
    });
    
    // Smart preview
    manager.addFieldInterfaceComponentOption('url', {
      label: 'Smart Preview',
      value: 'UrlField.SmartPreview',
      useProps: () => ({
        fetchMetadata: true,
        showFavicon: true,
        showDescription: true,
        maxDescriptionLength: 100
      })
    });
    
    // Secure link
    manager.addFieldInterfaceComponentOption('url', {
      label: 'Secure Link',
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
    
    // Thousands separator
    manager.addFieldInterfaceComponentOption('number', {
      label: 'Thousands Separator',
      value: 'NumberField.Thousands',
      useProps: () => ({
        separator: ',',
        precision: 0
      })
    });
    
    // File size
    manager.addFieldInterfaceComponentOption('number', {
      label: 'File Size',
      value: 'NumberField.FileSize',
      useProps: () => ({
        format: 'fileSize',
        precision: 2
      })
    });
  }
  
  private registerDateFieldExtensions() {
    const manager = this.app.dataSourceManager.collectionFieldInterfaceManager;
    
    // Countdown
    manager.addFieldInterfaceComponentOption('datetime', {
      label: 'Countdown',
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

### 6.2 Usage

```tsx
// Register plugin in application
import { FieldDisplayExtensionsPlugin } from './plugins/FieldDisplayExtensionsPlugin';

const app = new Application({
  plugins: [
    FieldDisplayExtensionsPlugin,
    // Other plugins...
  ]
});
```

## 7. Best Practices

### 7.1 Naming Conventions

- Use `FieldType.ComponentName` format for component values
- Use concise and clear descriptions for labels
- Maintain consistency and readability in naming

### 7.2 Performance Optimization

- Avoid complex calculations in `useProps`
- Use `useVisible` reasonably to control option display
- Cache calculation results to avoid repeated calculations

### 7.3 User Experience

- Provide reasonable default options
- Dynamically adjust options based on user permissions and environment
- Keep options simple and avoid excessive complexity

### 7.4 Extensibility

- Design reusable component options
- Support configurable property passing
- Consider possible future extension needs

## 8. Notes

1. **Component Registration**: Ensure the corresponding display components are correctly registered in the system
2. **Property Compatibility**: Properties passed to components need to be compatible with component interfaces
3. **Performance Impact**: Too many display options may affect user selection experience
4. **Maintenance Cost**: Need to maintain implementation and testing of multiple display components

## 9. Summary

Through the field display extension mechanism, we can provide rich display forms for existing fields without changing the field type. This design maintains system flexibility while avoiding unnecessary complexity, and is an effective way to enhance user experience.
