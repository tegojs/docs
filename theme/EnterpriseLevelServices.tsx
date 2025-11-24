import { usePageData } from '@rspress/core/runtime';
import { DescriptionCard } from './components/DescriptionCard';

export const EnterpriseLevelServices = () => {
  const { page } = usePageData();
  const isEnglish = page.lang === 'en';
  const content = isEnglish
    ? {
        title: 'Technical Highlights',
        highScalability: {
          title: 'High Scalability',
          desc: 'Enterprises can customize data structures, business logic, and even integrate external services as needed.',
          icon: '/homepage/highScalability.png',
        },
        rapidDevelopment: {
          title: 'Rapid Development & Deployment',
          desc: 'Low-code features significantly shorten the development process and improve efficiency.',
          icon: '/homepage/rapidDevAndDeploy.png',
        },
        crossEnvCompatibility: {
          title: 'Cross-Environment Compatibility',
          desc: 'Ensures stable operation across development, testing, and production environments, guaranteeing high availability.',
          icon: '/homepage/crossEnvCompatibility.png',
        },
      }
    : {
        title: '技术亮点',
        highScalability: {
          title: '高度可扩展性',
          desc: '企业可以根据需求调整数据结构、业务逻辑，甚至接入外部服务',
          icon: '/homepage/highScalability.png',
        },
        rapidDevelopment: {
          title: '快速开发与部署',
          desc: '低代码特性使得开发过程大大缩短，提高了开发效率',
          icon: '/homepage/rapidDevAndDeploy.png',
        },
        crossEnvCompatibility: {
          title: '跨环境适配性',
          desc: '支持在多个环境（如开发、测试、生产）下稳定运行，确保高可用性',
          icon: '/homepage/crossEnvCompatibility.png',
        },
      };

  return (
    <div
      style={{
        padding: '60px 0',
        textAlign: 'center' as const,
        backgroundColor: '#F8FAFF',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
        }}
      >
        <h2
          style={{
            fontSize: '2rem',
            marginBottom: '2rem',
            fontWeight: 500,
          }}
        >
          {content.title}
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem',
          }}
        >
          <DescriptionCard
            title={content.highScalability.title}
            desc={content.highScalability.desc}
            icon={content.highScalability.icon}
          />
          <DescriptionCard
            title={content.rapidDevelopment.title}
            desc={content.rapidDevelopment.desc}
            icon={content.rapidDevelopment.icon}
          />
          <DescriptionCard
            title={content.crossEnvCompatibility.title}
            desc={content.crossEnvCompatibility.desc}
            icon={content.crossEnvCompatibility.icon}
          />
        </div>
      </div>
    </div>
  );
};
