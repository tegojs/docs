import { useDark, usePageData } from "@rspress/core/runtime";
import { DescriptionCard } from "./components/DescriptionCard";
export const FeaturesSection = () => {
    const isDark = useDark();
    const { page } = usePageData();
    const isEnglish = page.lang === 'en';
    const content = isEnglish ? {
        title: 'Features',
        flexibility: {
            title: 'Flexibility',
            desc: 'Flexible and extensible features that empower developers to maximize their potential.'
        },
        openness: {
            title: 'Openness & Transparency',
            desc: 'Open-source frontend renderer, traditional database backend, no middle layer or cloud vendor lock-in, deployable in any environment!'
        },
        looseCoupling: {
            title: 'Loose Coupling',
            desc: 'Offers diverse options for developers: pure frontend usage, visual editor reliance, or backend-focused development — easily integrates with existing workflows.'
        },
    } : {
        title: '功能特点',
        flexibility: {
            title: '灵活性',
            desc: '灵活性和功能可扩展，让开发人员可以最大程度发挥',
            icon: 'homepage/flexibility.png',
        },
        openness: {
            title: '开放透明',
            desc: '前端渲染器开源，后端选择传统数据库技术，没有中间层且不依赖任何云厂商，可以部署到任何环境！',
            icon: 'homepage/openness.png'
        },
        looseCoupling: {
            title: '松耦合',
            desc: '为开发者提供多元选择；可纯用前端、仅依托可视化编辑器，或专注后端开发，轻松无缝衔接现有开发体系',
            icon: 'homepage/flexibility.png'
        },
    };

    return (
        <div style={{
            padding: '60px 0',
            textAlign: 'center' as const,
            backgroundColor: isDark ? '#1C1D38' : 'white'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 20px'
            }}>
                <h2 style={{
                    fontSize: '2rem',
                    marginBottom: '2rem',
                    fontWeight: 500,
                    color: isDark ? '#FFFFFFDB' : '#444444'
                }}>
                    {content.title}
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                    marginBottom: '3rem'
                }}>
                    <DescriptionCard
                        title={content.flexibility.title}
                        desc={content.flexibility.desc}
                        icon={content.flexibility.icon}
                    />
                    <DescriptionCard
                        title={content.openness.title}
                        desc={content.openness.desc}
                        icon={content.openness.icon}
                    />
                    <DescriptionCard
                        title={content.looseCoupling.title}
                        desc={content.looseCoupling.desc}
                        icon={content.looseCoupling.icon}
                    />
                </div>
            </div>
        </div>
    )
}