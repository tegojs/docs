import { useDark, usePageData } from '@rspress/core/runtime'
import { Link } from '@rspress/theme-default'
import { Button } from 'antd'

export const Introduction = () => {
  const { page } = usePageData()
  const isDark = useDark()
  const isEnglish = page.lang === 'en'
  const content = isEnglish
    ? {
      title: 'Technical Architecture',
      buttonIntro: 'Introduction',
      buttonQuickStart: 'Quick Start',
      heading1: 'Tachybase',
      heading2: 'Create your next app',
      description: 'Quickly build new apps based on Typescript + Node.js',
    }
    : {
      title: '技术架构',
      buttonIntro: '介绍',
      buttonQuickStart: '快速开始',
      heading1: '灵矶空间',
      heading2: '创造你的下一个应用',
      description: '基于 Typescript+Node.js 快速构建新的应用',
    }

  return (
    <div
      className={`
                relative text-center
                ${isDark ? 'bg-[#06042C]' : 'bg-gradient-to-b from-white to-[#F8FAFF]'}
            `}
    >
      <div className="md:flex w-full justify-between max-h-[500px]">
        <div className="w-fill md:w-1/2 pb-[50px] md:mt-[50px]">
          <div className="md:ml-[50%] md:text-left text-center">
            <div>
              <p className="text-[#3279FE] font-semibold text-[clamp(1rem,2.5vw,2.5rem)]">
                {content.heading1}
              </p>
              <p
                className={`font-semibold text-[clamp(1rem,2.5vw,2.5rem)] ${isDark ? 'text-white/90' : 'text-[#2F2F2F]'
                  }`}
              >
                {content.heading2}
              </p>
              <p className="text-[#767A7F] text-[clamp(0.6rem,1.5vw,1rem)]">
                {content.description}
              </p>
            </div>

            <div className="flex flex-wrap mt-8 gap-10 relative z-10  justify-center md:justify-start">
              <Button type="primary" shape="round" size="middle" className="px-[30px]">
                <Link href="/guides/start/introduction">{content.buttonIntro}</Link>
              </Button>
              <Button type="primary" shape="round" size="middle" ghost className="px-[30px]">
                <Link href="/guides/start/quick-started-from-engine">
                  {content.buttonQuickStart}
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <img
            src="/homepage/homepage.png"
            alt="homepage"
            className="relative z-10 h-full object-contain"
          />
        </div>
      </div>
      <svg
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-[40%] block pointer-events-none z-0"
      >
        <path d="M0,0 Q50,30 100,0 L100,40 L0,40 Z" fill={isDark ? '#1C1D38' : 'white'} />
      </svg>
    </div>
  )
}
