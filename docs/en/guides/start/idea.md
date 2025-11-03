# Philosophy

This section introduces the design philosophy and core technical points of Tachybase, and how it differs technically from other low-code platforms.

## Design Philosophy
Tachybase's initial users were internal developers at the company, so its most important design philosophy is "developer-first".

We believe that zero-code platforms for non-developers have limited use cases and can only create simple office applications, which are often not as simple and convenient as online Excel. Therefore, Tachybase is not a zero-code platform; it is aimed at users with some development experience.

Tachybase's goal is not to replace developers, but to assist developers in completing their work more efficiently.

Because of its focus on developers, Tachybase has three distinctive features compared to other low-code platforms:

1. High flexibility - We prioritize flexibility and functional extensibility, allowing developers to maximize their potential, rather than limiting everywhere for the sake of ease of use. This is reflected in both frontend and backend design.
2. Open and transparent - The biggest risk of low-code platforms is vendor lock-in and black boxes. As developers ourselves, we don't like closed low-code platforms either. Therefore, Tachybase emphasizes openness. The frontend renderer is open-source, and the backend also uses traditional database technology that developers are most familiar with, without any middleware layer, completely transparent to developers. Moreover, Tachybase's backend doesn't depend on any cloud vendor and can be deployed to any environment.
3. Loosely coupled architecture - Rather than a large integrated system, we chose a loosely coupled architecture, allowing developers more choices. You can choose to use only the frontend, only the visual editor, or only the backend, and it can integrate well with existing development.

Next, we'll introduce the core designs of Tachybase's frontend, backend, and editor.

## Frontend
Tachybase's frontend uses the popular open-source project Formily, which has 11.5k stars and is continuously updated. It is currently used by a large number of internet and financial companies, including but not limited to: Meituan, Didi, Yuewen Group, Beike, China Everbright Bank, and other well-known enterprises.

The core of the Formily renderer is to render JSON configuration into interactive pages. For example, the following simple configuration:

```json
{
  "type": "void",
  "x-acl-action-props": {
    "skipScopeCheck": true
  },
  "x-acl-action": "newTasks:create",
  "x-decorator": "FormBlockProvider",
  "x-use-decorator-props": "useCreateFormBlockDecoratorProps",
  "x-decorator-props": {
    "dataSource": "main",
    "collection": "newTasks",
    "association": null
  },
  "x-toolbar": "BlockSchemaToolbar",
  "x-settings": "blockSettings:createForm",
  "x-component": "CardItem",
  "x-template-key": "jd7idnyhz3w",
  "properties": {
    "uq8jz1sqsjf": {
      "type": "void",
      "x-component": "FormV2",
      "x-use-component-props": "useCreateFormBlockProps",
      "properties": {
        "f3gjcyexjqv": {
          "type": "void",
          "x-initializer": "createForm:configureActions",
          "x-component": "ActionBar",
          "properties": {
            "wmhuxhvc2hc": {
              "title": "{{ t(\"Submit\") }}",
              "x-action": "submit",
              "x-component": "Action",
              "x-use-component-props": "useCreateActionProps",
              "x-toolbar": "ActionSchemaToolbar",
              "x-settings": "actionSettings:createSubmit",
              "x-component-props": {
                "type": "primary",
                "htmlType": "submit"
              },
              "x-action-settings": {
                "assignedValues": {},
                "triggerWorkflows": [],
                "pageMode": false
              },
              "type": "void"
            }
          }
        },
        "grid": {
          "type": "void",
          "x-component": "BlockTemplate",
          "x-component-props": {
            "templateId": "jd7idnyhz3w"
          }
        }
      }
    }
  }
}
```

After rendering with Formily, it becomes a form:

![formily1.png](/formily1.png)

As you can see, the Formily configuration is very concise with no unnecessary content, and is easy to understand even for those who have never studied it.

Formily can support multiple scenarios. You can use it to create:

Multi-page applications with navigation.
Single pages.
Small areas of existing pages (any frontend framework), such as using Formily only for forms.

Formily's core technical points:

Supports unlimited nesting levels, enabling complex frontend interfaces.
In addition to interfaces, includes low-code configuration for data fetching, form validation, data linkage, show/hide toggling, and interactions.
Large number of built-in components (120+), ready to use out of the box.
Easy to extend using standard React components

## Backend Data Model
Tachybase's backend data model is based on traditional databases, which differs from common practices in the industry. There are two common approaches in the industry:

- Based on NoSQL databases, with MongoDB being the most commonly used, with many zero-code platforms built on it.
- Based on pre-created wide tables, such as creating 500 columns in advance and then allocating these columns to different fields.

But both approaches have obvious drawbacks:

- Data becomes siloed - Because of the special data type, it can only be stored in the platform and is difficult to integrate with existing application data. Data can only be exchanged via APIs, meaning these low-code platforms are only suitable for completely new applications and cannot be used for developing existing core systems or directly connecting to existing system databases.
- Developers are unfamiliar - MongoDB is still niche in China. Schema-less design is both an advantage and a disadvantage. Without schema, it's easy for new and old data structures to become inconsistent, causing problems. We haven't heard of any large companies using MongoDB in core systems, and its query syntax is far less popular than SQL.
- Many limitations - Using pre-created wide tables means you cannot use all SQL statements, usually only supporting queries, cannot use select *, cannot create views, etc. Almost all advanced database features cannot be used.
- Performance is hard to predict - Also, because of the middleware conversion layer, there will be performance loss. For developers, it's a black box, and performance issues will be difficult to troubleshoot.

Tachybase's data model uses a more traditional approach. Its principle is dynamic database ORM mapping, which can be understood as dynamically creating Entity classes and then using these classes to operate the database.

This means in Tachybase:
- Data models are database tables, fields in them are fields in tables, and modifications to fields automatically generate database table structure alteration operations, just like traditional development, which developers are familiar with.
- Can directly connect to existing databases, data is no longer siloed, Tachybase can be mixed with traditional development and can be used in existing mature systems, not just for new applications.
- Can operate data conveniently like objects, and can also use any SQL statements to implement complex functions, achieving the same flexibility as regular development.
- Performance and stability are predictable, because there's no middleware conversion layer, the performance ceiling depends on the database itself.

## Multi-Environment Independence
Tachybase application backend supports multiple environments, each environment is completely independent:
- All page information, navigation, API center, etc. become read-only after publishing, each environment is independent.
- Data models will use different databases, data will not affect each other.
- After publishing, all frontend static files will save historical versions at that time, even if the platform undergoes incompatible upgrades, it won't cause application page issues.

## Business Orchestration
Business orchestration is the ability to visualize backend logic. Many low-code products use graph and connection-based editing, such as the screenshot below from an open-source orchestration tool:

![idea1](/idea1.png)

While using graph connections looks nice, the actual user experience is poor, especially when the business is complex, the connections become messy. For example, below is a slightly more complex example, where it's already very difficult to understand the execution logic:

![idea2](/idea2.png)

Therefore, Tachybase chose a tree structure more familiar to developers for business orchestration:

![idea3](/idea3.png)

Using this approach has the following advantages:

1. Easier for developers to understand and comprehend, it's the same thinking process as writing code, executing from top to bottom.
2. Tachybase also supports generating pseudo-code, making it convenient for developers to review. [TODO]
3. Can build deep structures and collapse them for layer-by-layer reading, more concise and easy to understand than connections.

## Tachybase Within the Company

Tachybase is primarily used for frontend development of middle and back-office systems within the company. It's used across all core business departments, including operations, product, technology, artificial intelligence, and big data, and has even been applied to multiple key projects. For example, two years ago during a major event, its real-time scheduling control interface was developed based on Tachybase.

The widespread adoption of Tachybase within the company is not due to mandatory use, but rather the autonomous choice of various business teams, demonstrating Tachybase's high recognition as a frontend development platform.

The larger business lines within the company have created thousands of pages based on Tachybase, with the most complex pages containing over 10,000 lines of configuration.

Due to the company's own large-scale use, Tachybase's reliability and long-term maintenance are fully guaranteed.
