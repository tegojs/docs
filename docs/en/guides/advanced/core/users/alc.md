# Access Control

## Introduction

Tachybase's ACL module consists of two main parts:

- `@tachybase/acl` in the core, providing core functionality
- `@tachybase/plugin-acl` in the plugins, providing dynamic configuration capabilities

## Installation

Built-in plugin, no separate installation required.

## Development Guide

### Extending a New Permission Configuration Tab

The following example demonstrates how to extend a new permission configuration tab using the "Mobile Menu" configuration item. The effect is shown in the image below:

![](/core/tachybase-core-alc-1.png)

Code:

```typescript
import { Plugin } from '@tachybase/client';
import PluginACLClient from '@tachybase/plugin-acl/client';

class PluginMobileClient extends Plugin {
  async load() {
    const aclInstance = this.app.pm.get(PluginACLClient);

    aclInstance?.settingsUI.addPermissionsTab(({ t, TabLayout, activeKey }) => ({
      key: 'mobile-menu',
      label: t('Mobile menu', {
        ns: 'plugin-mobile',
      }),
      children: (
        <TabLayout>
          <MenuPermissions />
        </TabLayout>
      ),
    }));
  }
}
```

First, we need to get the instance of the `PluginACLClient` plugin, and add a new permission configuration tab through the `settingsUI.addPermissionsTab` method. In this example, we added a permission configuration tab named "Mobile Menu".

The value of the `settingsUI` property is an instance of a class named `ACLSettingsUI`, with the following type information:

```typescript
import { TabsProps } from 'antd/es/tabs/index';

interface ACLSettingsUI {
  addPermissionsTab(tab: Tab | TabCallback): void;
  getPermissionsTabs(props: PermissionsTabsProps): Tab[];
}

type Tab = TabsProps['items'][0];

type TabCallback = (props: PermissionsTabsProps) => Tab;

interface PermissionsTabsProps {
  /**
   * the key of the currently active tab panel
   */
  activeKey: string;
  /**
   * the currently selected role
   */
  role: Role;
  /**
   * translation function
   */
  t: TFunction;
  /**
   * used to constrain the size of the container in the Tab
   */
  TabLayout: React.FC;
}
```
