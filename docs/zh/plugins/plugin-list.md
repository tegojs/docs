# 插件列表

| 序号 | 包名 | 插件名 | 描述 |
| --- | --- | --- | --- |
| 1 | `@tachybase/plugin-action-bulk-edit` | 操作：批量编辑 | 对全部数据或选中的数据进行批量编辑。 |
| 2 | `@tachybase/plugin-action-bulk-update` | 操作：批量更新 | 对全部数据或选中的数据进行批量更新。 |
| 3 | `@tachybase/plugin-action-custom-request` | 操作：自定义请求 | 向任意 HTTP 服务发送请求，支持将上下文数据发送给目标服务。 |
| 4 | `@tachybase/plugin-action-duplicate` | 操作：复制记录 | 复制一条记录，可以复制到表单中编辑后再提交，也可以直接复制并生成一条新记录。 |
| 5 | `@tachybase/plugin-action-export` | 操作：导出记录 | 导出筛选后的记录到 Excel 中，可以配置导出哪些字段。 |
| 6 | `@tachybase/plugin-action-import` | 操作：导入记录 | 使用 Excel 模板导入数据，可以配置导入哪些字段，自动生成模板。 |
| 7 | `@tachybase/plugin-action-print` | 操作：打印 | 调用浏览器的打印功能实现单条数据的打印。 |
| 8 | `@tachybase/plugin-action-share` | 动作：对外分享 | 与外部用户分享页面。 |
| 9 | `@tachybase/plugin-adapter-bullmq` | BullMQ管理 | 集成和管理BullMQ消息队列 |
| 10 | `@tachybase/plugin-adapter-red-node` | Node-RED 管理 | 集成和管理 Node-RED 流程自动化引擎 |
| 11 | `@tachybase/plugin-adapter-remix` | Remix管理 | 集成和管理 Remix 服务器 |
| 12 | `@tachybase/plugin-ai-chat` | AI聊天 | AI聊天机器人,提供操作帮助,智能问答 |
| 13 | `@tachybase/plugin-api-keys` | 认证：API 密钥 | 允许用户使用 API 密钥访问应用的 HTTP API |
| 14 | `@tachybase/plugin-api-logs` | Api 日志 | Api Logs通过增强的用户界面组件、配置面板和仪表板提供对 API 操作的无缝跟踪 |
| 15 | `@tachybase/plugin-audit-logs` | 审计日志 | 审计日志。 |
| 16 | `@tachybase/plugin-auth-cas` | 认证：CAS | 通过 CAS 协议认证身份。 |
| 17 | `@tachybase/plugin-auth-dingtalk` | 认证：钉钉 | 认证：钉钉 |
| 18 | `@tachybase/plugin-auth-lark` | 认证Lark | 认证: Lark |
| 19 | `@tachybase/plugin-auth-main-app` | 多应用统一登录 | 通过主应用登录子应用,子应用可关闭登录 |
| 20 | `@tachybase/plugin-auth-oidc` | 认证：OIDC | 通过 OIDC (OpenID Connect) 协议认证身份。 |
| 21 | `@tachybase/plugin-auth-pages` | 认证页面 | 认证：页面 |
| 22 | `@tachybase/plugin-auth-saml` | 认证：SAML 2.0 | 通过 SAML 2.0 协议认证身份。 |
| 23 | `@tachybase/plugin-auth-sms` | 认证：短信 | 通过短信验证码认证身份。 |
| 24 | `@tachybase/plugin-auth-wechat` | 认证：微信 | 通过微信扫码认证身份。 |
| 25 | `@tachybase/plugin-auth-wecom` | 认证：企业微信 | 提供企业微信的认证支持 |
| 26 | `@tachybase/plugin-block-calendar` | 日历 | 提供日历数据表模板和卡片，用于管理日期数据，通常用于事件、约会、任务等与日期/时间相关的信息。 |
| 27 | `@tachybase/plugin-block-charts` | 卡片：图表 | 提供数据可视化功能，包含图表卡片和图表筛选卡片，支持折线图、面积图、柱状图等十几种图表，你也可以扩展更多图表类型。 |
| 28 | `@tachybase/plugin-block-comments` | 评论 | 评论 |
| 29 | `@tachybase/plugin-block-gantt` | 卡片：甘特图 | 提供甘特图卡片。 |
| 30 | `@tachybase/plugin-block-kanban` | 卡片：看板 | 提供看板卡片。 |
| 31 | `@tachybase/plugin-block-map` | 卡片：地图 | 地图卡片，支持高德地图和 Google 地图，你也可以扩展更多地图类型。 |
| 32 | `@tachybase/plugin-block-presentation` | 卡片：presentation | 在页面上创建和管理，用于嵌入和展示外部网页或内容。 |
| 33 | `@tachybase/plugin-block-step-form` | 卡片：分步表单 | 提供分步表单卡片。 |
| 34 | `@tachybase/plugin-data-source-common` | 外部数据源支持 | 支持更多的数据源 |
| 35 | `@tachybase/plugin-database-clean` | 数据库清理工具 | 数据库清理。 |
| 36 | `@tachybase/plugin-demos-game-runesweeper` | Runesweeper | Game runesweeper demo |
| 37 | `@tachybase/plugin-department` | 部门 | 将用户划分在树状的部门里,也可以给部门分配角色 |
| 38 | `@tachybase/plugin-devtools` | 开发工具 | 开发工具,用于查看Api文档,中间件,环境变量,事件等信息 |
| 39 | `@tachybase/plugin-field-bank-card-number` | 数据表字段：银行卡号 | 银行卡号字段，提供格式化显示（每4位一组）、智能输入和智能复制功能。支持最长21位银行卡号。 |
| 40 | `@tachybase/plugin-field-china-region` | 字段：中国行政区划 | 提供中国行政区划数据和字段类型。 |
| 41 | `@tachybase/plugin-field-encryption` | 数据表字段：加密字段 | 加密字段 |
| 42 | `@tachybase/plugin-field-formula` | 数据表字段：公式 | 可以配置并存储同一条记录的多字段值之间的计算结果，支持 Math.js 和 Excel formula functions 两种引擎 |
| 43 | `@tachybase/plugin-field-markdown-vditor` | 数据表字段：Markdown(Vditor) | 用于存储 Markdown，并使用 Vditor 编辑器渲染，支持常见 Markdown 语法，如列表，代码，引用等，并支持上传图片，录音等。同时可以做到即时渲染，所见即所得。 |
| 44 | `@tachybase/plugin-field-sequence` | 数据表字段：自动编码 | 根据配置的规则自动生成编码，支持日期、数字、文本的组合。 |
| 45 | `@tachybase/plugin-field-snapshot` | 数据表字段：关系快照 | 在添加数据时，为它的关系数据创建快照，并保存在当前的数据中。关系数据更新时，快照不会更新。 |
| 46 | `@tachybase/plugin-form-design` | Form Design | 所见即所得的表单设计插件 |
| 47 | `@tachybase/plugin-full-text-search` | 全文搜索 | 提供全字段搜索能力 |
| 48 | `@tachybase/plugin-i18n-editor` | 本地化 | 支持管理应用程序的本地化资源。 |
| 49 | `@tachybase/plugin-icon-pickerv2` | 图标选择器 V2 | 一个灵活的图标选择插件，为 Tachybase 提供简单集成和可定制的图标选择功能。 |
| 50 | `@tachybase/plugin-log-viewer` | 日志 | 服务端日志，主要包括接口请求日志和系统运行日志，并支持打包和下载日志文件。 |
| 51 | `@tachybase/plugin-manual-notification` | 广播通知 | 用于给所有在线人员发送通知，包括系统更新，重要事件 |
| 52 | `@tachybase/plugin-mock-collections` | mock-collections | mock-collections |
| 53 | `@tachybase/plugin-multi-app-share-collection` | 多应用数据共享 | 多应用数据共享 |
| 54 | `@tachybase/plugin-ocr-convert` | OCR 转换 | OCR 转换插件 |
| 55 | `@tachybase/plugin-online-user` | 在线用户管理（建设中） | 在线用户管理（建设中） |
| 56 | `@tachybase/plugin-otp` | 验证码 | 验证码配置。 |
| 57 | `@tachybase/plugin-pagespy` | 页面监控 | PageSpy 插件, 方便前端测试和记录 |
| 58 | `@tachybase/plugin-password-policy` | 密码策略 | 密码策略, 包含密码强度、密码尝试次数限制、密码锁定时间、ip黑白名单等 |
| 59 | `@tachybase/plugin-print-template` | @tachybase/plugin-print-template |  |
| 60 | `@tachybase/plugin-simple-cms` | 内容管理 | 内容管理 |
| 61 | `@tachybase/plugin-sub-accounts` | 子账户和合成角色 | 生成合成角色,每个用户可以生成自己的子账户(未完成) |
| 62 | `@tachybase/plugin-text-copy` | 文本复制 | 为文本字段添加复制按钮 |
| 63 | `@tachybase/plugin-theme-editor` | 主题编辑器 | 自定义 UI 的颜色、尺寸等，并将结果保存为主题，可在多个主题间切换。 |
| 64 | `@tachybase/plugin-user-manual-feishu` | 飞书使用手册 | 飞书使用手册 |
| 65 | `@tachybase/plugin-wechat-official-account` | @tachybase/plugin-wechat-official-account |  |
| 66 | `@tachybase/plugin-workflow-analysis` | 工作流分析工具 | 工作流分析工具：用于时间消耗和错误分析 |
| 67 | `@tachybase/plugin-workflow-approval` | 审批 | 审批系统是一个强大的BPM工具，为业务流程自动化提供基础支持，同时具备高度灵活性和可扩展性，确保审批流程的效率和合规性，助力企业释放创新潜力。 |
| 68 | `@tachybase/plugin-workflow-test` | 工作流：测试工具包 | 工作流测试工具包 |
