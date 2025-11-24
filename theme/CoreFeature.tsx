import { useDark, usePageData } from '@rspress/core/runtime';
import React, { useState } from 'react';

const contentList = {
  zh: [
    {
      foreground: '/homepage/formDesign.png',
      title: '表单设计',
      description:
        '在表单设计模块中，系统配备了丰富多样的字段及属性选项。用户仅需通过简便的字段拖拽操作，或者导入预先准备好的 Excel 表格，就能依据自身特定的业务需求，迅速构建出符合要求的表单。',
    },
    {
      foreground: '/homepage/workflow.png',
      title: '流程设计',
      description:
        '系统配备了直观的可视化流程设计功能，用户能够依据自身业务规则，通过自定义方式对流程节点及其连线进行灵活设置。',
    },
    {
      foreground: '/homepage/dashBoard.png',
      title: '仪表盘',
      description:
        '在仪表盘模块内，系统集成了丰富多样的图表类型与实用组件。借助这些工具，用户能够对所收集的数据展开多维度、深层次的分析，并以实时动态的方式进行直观展示。',
    },
  ],
  en: [
    {
      foreground: '/homepage/formDesign.png',
      title: 'Form Design',
      description:
        'The Form Design module offers a rich variety of fields and attribute options. Users can quickly build customized forms tailored to their specific business needs simply by dragging fields or importing pre-prepared Excel sheets.',
    },
    {
      foreground: '/homepage/workflow.png',
      title: 'Workflow Design',
      description:
        'The system provides an intuitive visual workflow design feature, allowing users to flexibly configure workflow nodes and connections according to their business rules.',
    },
    {
      foreground: '/homepage/dashBoard.png',
      title: 'Dashboard',
      description:
        'The Dashboard module integrates a wide range of chart types and practical components, enabling users to perform multidimensional and in-depth analysis of collected data and present it dynamically in real time.',
    },
  ],
};

export const CoreFeature = () => {
  const { page } = usePageData();
  const isDark = useDark();
  const isEnglish = page.lang === 'en';
  const currentList = isEnglish ? contentList.en : contentList.zh;

  const [currentIndex, setCurrentIndex] = useState(0);
  const current = currentList[currentIndex];
  const mainTitle = isEnglish ? 'Core Feature' : '核心功能';

  const next = () => {
    setCurrentIndex((idx) => (idx === currentList.length - 1 ? 0 : idx + 1));
  };

  return (
    <div
      className={`relative pb-[100px] md:pb-[250px] px-4 sm:px-8  pt-30 text-center ${isDark ? 'bg-[#06042C]' : 'bg-[#F8FAFF]'}`}
    >
      <div className="max-w-screen-xl mx-auto">
        <p
          className={`text-3xl font-medium mb-10 ${isDark ? 'text-white/90' : 'text-[#444]'}`}
        >
          {mainTitle}
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-10 mt-10">
          <div className="relative w-[300px] md:w-[500px] h-[200px] md:h-[300px]">
            <img
              src={current.foreground}
              alt="foreground"
              className="absolute top-[10px] left-[10px] w-[calc(100%-20px)] h-[calc(100%-35px)] object-contain z-10"
            />
          </div>
          <div className="max-w-md text-left">
            <h3
              className={`text-lg font-semibold mb-6 ${
                isDark ? 'text-white/60' : 'text-[#767A7F]'
              }`}
            >
              {current.title}
            </h3>
            <p className={`${isDark ? 'text-white/70' : 'text-[#767A7F]'}`}>
              {current.description}
            </p>
            <div className="flex items-center justify-end gap-5 mt-8">
              <div className="flex gap-2">
                {currentList.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-[6px] h-[6px] rounded-full cursor-pointer transition-colors ${
                      i === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                    aria-label={`切换到第${i + 1}页`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                aria-label={isEnglish ? 'Next' : '下一张'}
                className="w-6 h-6 text-white text-sm bg-blue-500 hover:bg-blue-400 transition-colors rounded-full flex items-center justify-center shadow-md"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      </div>
      <svg
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-[40%] pointer-events-none !hidden md:!block"
      >
        <path
          d="M0,10 Q70,30 100,0 L100,20 L0,20 Z"
          fill={isDark ? '#1C1D38' : 'white'}
        />
      </svg>
    </div>
  );
};
