import { usePageData } from '@rspress/core/runtime';
import { Layout as BasicLayout } from '@rspress/theme-default';
import { useEffect } from 'react';
import { AlgoliaSearch } from './components/AlgoliaSearch';

// 以下展示所有的 Props
const Layout = () => {
  const { page } = usePageData();
  const isEnglish = page.lang === 'en';
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', 'tegojs/docs');
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('theme', 'github-light');
    script.crossOrigin = 'anonymous';
    script.async = true;

    const commentsEl = document.getElementById('utterances-container');
    if (commentsEl) {
      commentsEl.innerHTML = ''; // 清空旧内容（避免重复加载）
      commentsEl.appendChild(script);
    }
  }, []);
  return (
    <BasicLayout
      afterNavTitle={<AlgoliaSearch containerId="docsearch" />}
      afterDocContent={<div id="utterances-container" />}
      bottom={
        <div className="pb-5" style={{ textAlign: 'center' }}>
          <span id="busuanzi_container_site_pv">
            {isEnglish ? 'Total visits' : '本站总访问量'}&nbsp;
            <span id="busuanzi_value_site_pv" />
            &nbsp;{isEnglish ? 'times' : '次'}
          </span>
          &nbsp; &nbsp; &nbsp;
          <span id="busuanzi_container_site_uv">
            {isEnglish ? 'Total visitors' : '本站访客数'}&nbsp;
            <span id="busuanzi_value_site_uv" />
            &nbsp;{isEnglish ? 'times' : '人次'}
          </span>
          &nbsp; &nbsp; &nbsp;
          <span id="busuanzi_container_page_pv">
            {isEnglish ? 'Total reading' : '本文总阅读量'}&nbsp;
            <span id="busuanzi_value_page_pv" />
            &nbsp;{isEnglish ? 'times' : '次'}.
          </span>
          &nbsp;&nbsp;&nbsp;
          {isEnglish ? 'Powered by Tego Team' : '由灵矶团队提供技术支持'}
        </div>
      }
    />
  );
};

export { Layout };
