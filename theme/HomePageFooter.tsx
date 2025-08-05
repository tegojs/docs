import { useDark, usePageData } from '@rspress/core/runtime'
import { EMAIL, PHONE, USER_MANUAL_URL_FEISHU, WECHAT } from './constants'

export const HomePageFooter = () => {
  const { page } = usePageData()
  const isEnglish = page.lang === 'en'
  const isDark = useDark()
  const content = isEnglish
    ? {
        about: 'About Tachybase',
        explore: 'Explore Tachybase',
        manual: 'User Manual',
        contact: 'Contact Us',
        phone: 'Phone',
        email: 'Email',
        wechat: 'WeChat',
        group: 'WeChat Group',
        official: 'Official Account',
      }
    : {
        about: '关于灵矶',
        explore: '了解灵矶',
        manual: '产品使用手册',
        contact: '联系我们',
        phone: '电话',
        email: '邮箱',
        wechat: '微信',
        group: '微信交流群',
        official: '关注公众号',
      }

  const linkStyle = isDark ? '!text-[#FFFFFFDB]' : '!text-gray-700'

  return (
    <footer
      className={`px-5 py-10 flex flex-wrap text-[#333] ${isDark ? 'bg-[#1C1D38]' : 'bg-white'}`}
    >
      <div className="flex-1 md:flex-[2] flex flex-wrap md:justify-end gap-5 md:gap-10 mr-[10%]">
        <div className="min-w-[150px] mb-5">
          <ul className="flex flex-col gap-5 list-none p-0 m-0">
            <li>
              <a href="https://tachybase.com/" className={`${linkStyle} no-underline font-medium`}>
                {content.about}
              </a>
            </li>
            <li>
              <a
                href="https://apps.tachybase.com/"
                className={`${linkStyle} no-underline font-medium`}
              >
                {content.explore}
              </a>
            </li>
            <li>
              <a href={USER_MANUAL_URL_FEISHU} className={`${linkStyle} no-underline font-medium`}>
                {content.manual}
              </a>
            </li>
          </ul>
        </div>
        <div className="min-w-[200px]">
          <h4 className={`mb-3 text-base font-medium ${linkStyle}`}>{content.contact}</h4>
          <p className={`my-1 ${linkStyle}`}>
            {content.phone}：{PHONE}
          </p>
          <p className={`my-1 ${linkStyle}`}>
            {content.email}：{EMAIL}
          </p>
          <p className={`my-1 ${linkStyle}`}>
            {content.wechat}：{WECHAT}
          </p>

          <div className="flex flex-2 mt-3 gap-3">
            <div className="flex flex-col items-center">
              <img src="/homepage/chatGroup.png" alt="WechatGroup" className="w-20 h-20 mb-2" />
              <p className={`text-sm text-center ${linkStyle}`}>{content.group}</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="/homepage/officialAccount.png"
                alt="officialAccount"
                className="w-20 h-20 mb-2"
              />
              <p className={`text-sm text-center ${linkStyle}`}>{content.official}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
