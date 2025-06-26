import React from "react";

// 需要默认导出一个组件
// 通过 props 来拿到配置中传入的 props 数据
export default function PluginUI() {
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
      <div className="utterances"  />
    </div>
  )
}
