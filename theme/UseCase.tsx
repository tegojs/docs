import { useDark } from "@rspress/core/runtime";
import { usePageData } from "rspress/runtime";
import clsx from "clsx";

const scenarios = [
    { zh: "CRM", en: "CRM" },
    { zh: "ERP", en: "ERP" },
    { zh: "HRM", en: "HRM" },
    { zh: "在线教育平台", en: "Online Education" },
    { zh: "智能协同办公", en: "Smart Collaboration" },
    { zh: "财务管理", en: "Financial Management" },
    { zh: "项目管理", en: "Project Management" },
    { zh: "私有定制", en: "Custom Solutions" },
];

export const UseCase = () => {
    const { page } = usePageData();
    const isEnglish = page.lang === "en";
    const isDark = useDark();

    return (
        <div
            className={clsx(
                "relative text-center pb-[200px] px-4 sm:px-6 lg:px-8 pt-10",
                isDark ? "bg-[#1C1D38]" : "bg-white"
            )}
        >
            <div className="max-w-screen-xl mx-auto">
                <p className="text-2xl sm:text-3xl font-medium"
                    style={{
                        fontSize: '2rem',
                        fontWeight: 500,
                        marginBottom: '3rem',
                        color: isDark ? '#FFFFFFDB' : '#444444'
                    }}>
                    {isEnglish ? "Use Cases" : "应用场景"}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 justify-items-center">
                    {scenarios.map((item, idx) => (
                        <div
                            key={idx}
                            className={clsx(
                                "rounded-xl p-4 w-[150px] xl:w-[200px] flex justify-center items-center shadow-md",
                                isDark ? "bg-[#393A50]" : "bg-[#F8FAFF]"
                            )}
                        >
                            <div className="flex items-center">
                                <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mr-2.5" />
                                <span
                                    className={clsx(
                                        "text-sm xl:text-base font-medium",
                                        isDark ? "text-white/60" : "text-[#2F2F2F]"
                                    )}
                                >
                                    {isEnglish ? item.en : item.zh}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <svg
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
                className="absolute bottom-0 left-0 w-full h-[20%] pointer-events-none !hidden md:!block"
            >
                <path
                    d="M0,10 Q50,30 100,0 L100,20 L0,20 Z"
                    fill={isDark ? "#06042CFF" : "#F8FAFFFF"}
                />
            </svg>
        </div>
    );
};
