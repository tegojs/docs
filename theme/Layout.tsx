import { Layout as BasicLayout } from "@rspress/theme-default";
import { useEffect } from "react";

// 以下展示所有的 Props
const Layout = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.setAttribute("repo", "tegojs/docs");
    script.setAttribute("issue-term", "pathname");
    script.setAttribute("theme", "github-light");
    script.crossOrigin = "anonymous";
    script.async = true;

    const commentsEl = document.getElementById("utterances-container");
    if (commentsEl) {
      commentsEl.innerHTML = ""; // 清空旧内容（避免重复加载）
      commentsEl.appendChild(script);
    }
  }, []);
  return (
    <BasicLayout
      afterDocContent={<div id="utterances-container" />}
      bottom={
        // TODO: 多国语言 + 样式优化
        <div style={{ textAlign: "center" }}>
          <span id="busuanzi_container_site_pv">
            本站总访问量&nbsp;
            <span id="busuanzi_value_site_pv" />&nbsp;次
          </span>
          &nbsp; &nbsp; &nbsp;
          <span id="busuanzi_container_site_uv">
            本站访客数&nbsp;
            <span id="busuanzi_value_site_uv" />
            &nbsp;人次
          </span>
          &nbsp; &nbsp; &nbsp;
          <span id="busuanzi_container_page_pv">
            本文总阅读量&nbsp;
            <span id="busuanzi_value_page_pv" />&nbsp;次
          </span>
          &nbsp;&nbsp;&nbsp;Powered by Tego Team
        </div>
      }
    />
  );
};

export { Layout };
