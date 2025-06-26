import { useEffect } from "react";

// 需要默认导出一个组件
// 通过 props 来拿到配置中传入的 props 数据
export default function Footer() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.setAttribute("repo", "tachybase/docs");
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
    <div>
      <span id="busuanzi_container_site_pv">
        本站总访问量
        <span id="busuanzi_value_site_pv" />次
      </span>
      <span id="busuanzi_container_site_uv">
        本站访客数
        <span id="busuanzi_value_site_uv" />
        人次
      </span>
      <span id="busuanzi_container_page_pv">
        本文总阅读量
        <span id="busuanzi_value_page_pv" />次
      </span>
      <div id="utterances-container" />
    </div>
  );
}
