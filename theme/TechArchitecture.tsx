import { useDark, usePageData } from '@rspress/core/runtime';

export const TechArchitecture = () => {
  const { page } = usePageData();
  const isDark = useDark();
  const isEnglish = page.lang === 'en';

  const content = isEnglish
    ? {
        title: 'Technical Architecture',
        module:
          'Module Layer: Implements data approval flows via "workflow modules", with "cloud function triggers" enabling automation.',
        core: 'Core Layer: Provides standardized ORM interfaces and transaction management, supporting cross-database consistency.',
        plugin:
          'Plugin Layer: Extends GraphQL APIs and encryption plugins to meet compliance in finance, healthcare, etc.',
      }
    : {
        title: '技术架构',
        module:
          '通过「工作流模块」实现数据变更审批链，结合「云函数模块触发」自动化数据处理逻辑。',
        core: '提供标准化 ORM 接口与事务管理机制，支持跨数据库事务一致性。',
        plugin:
          '扩展 GraphQL 接口、数据加密插件等，满足金融、医疗等行业的合规需求。',
      };

  return (
    <div
      className={`
                relative text-center py-[100px]
                ${isDark ? 'bg-[#1C1D38]' : 'bg-white'}
            `}
    >
      <div className="max-w-[1200px] mx-auto px-5 grid place-items-center gap-5">
        <p
          className={`
                        text-3xl font-medium mb-10 
                        ${isDark ? 'text-white/85' : 'text-neutral-700'}
                `}
        >
          {content.title}
        </p>

        <img
          src={
            isDark
              ? '/homepage/technicalArchitecture_dark.png'
              : '/homepage/technicalArchitecture.png'
          }
          alt="technicalArchitecture"
          className="w-1/2 h-auto mb-3 mt-5 !hidden md:!block"
        />
        {/* 模块层浮动说明 */}
        <div
          className={`
                        md:absolute top-[70%] left-[calc(50%-25%-80px)]
                        transform-translate-y-1/2
                        w-[200px] p-2 rounded text-sm font-medium whitespace-normal
                        ${isDark ? 'text-[#FFFFFF99]' : 'text-[#767A7FFF]'}
                    `}
        >
          <strong
            className={`${isDark ? 'text-white/80' : 'text-[#000000dd]'}`}
          >
            {isEnglish ? 'Module Layer:' : '模块层：'}
          </strong>{' '}
          {content.module}
        </div>
        <div
          className={`
                        md:absolute top-[20%] right-[calc(50%-25%-150px)]
                        w-[300px] p-1.5 rounded text-sm font-medium
                        ${isDark ? 'text-[#FFFFFF99]' : 'text-[#767A7FFF]'}
                    `}
        >
          <strong
            className={`${isDark ? 'text-white/80' : 'text-[#000000dd]'}`}
          >
            {isEnglish ? 'Core Layer:' : '内核层：'}
          </strong>{' '}
          {content.core}
        </div>
        <div
          className={`
                        md:absolute bottom-[20%] right-[calc(50%-25%-10px)]
                        w-[220px] p-1.5 rounded text-sm font-medium
                        ${isDark ? 'text-[#FFFFFF99]' : 'text-[#767A7FFF]'}
                    `}
        >
          <strong
            className={`${isDark ? 'text-white/80' : 'text-[#000000dd]'}`}
          >
            {isEnglish ? 'Plugin Layer:' : '插件层：'}
          </strong>{' '}
          {content.plugin}
        </div>
      </div>
      <svg
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-1/2 !hidden md:!block"
      >
        <path
          d="M0,10 Q50,30 100,0 L100,20 L0,20 Z"
          fill={isDark ? '#06042C' : '#F8FAFF'}
        />
      </svg>
    </div>
  );
};
