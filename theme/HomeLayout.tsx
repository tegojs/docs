import type React from "react";
import { HomeLayout as DefaultHomeLayout } from "@rspress/theme-default";
import { usePageData } from "@rspress/core/runtime";

const bussinessLink = 'https://tachybase.com';

const BusinessSection = () => {
  const { page } = usePageData();
  const isEnglish = page.lang === 'en';

  const content = isEnglish ? {
    title: '🏢 Enterprise Services',
    subtitle: 'Need professional technical support and customized solutions?',
    consulting: {
      title: '🎯 Professional Consulting',
      desc: 'Senior technical experts provide architecture design and best practice guidance'
    },
    development: {
      title: '🔧 Custom Development', 
      desc: 'Professional plugin and feature customization based on your business needs'
    },
    support: {
      title: '🛡️ Technical Support',
      desc: '24/7 technical support to ensure your business runs stably'
    },
    buttonText: 'Learn About Enterprise Services →'
  } : {
    title: '🏢 企业级服务',
    subtitle: '需要专业的技术支持和定制化解决方案？',
    consulting: {
      title: '🎯 专业咨询',
      desc: '资深技术专家为您提供架构设计和最佳实践指导'
    },
    development: {
      title: '🔧 定制开发',
      desc: '根据您的业务需求，提供专业的插件和功能定制'
    },
    support: {
      title: '🛡️ 技术支持',
      desc: '7×24小时技术支持，确保您的业务稳定运行'
    },
    buttonText: '了解企业级服务 →'
  };

  return (
    <div style={{
      margin: '80px 0',
      padding: '60px 0',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textAlign: 'center' as const,
      color: 'white'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          marginBottom: '1rem',
          fontWeight: 700
        }}>
          {content.title}
        </h2>
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '3rem',
          opacity: 0.9
        }}>
          {content.subtitle}
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '2rem',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              marginBottom: '1rem',
              fontWeight: 600
            }}>
              {content.consulting.title}
            </h3>
            <p style={{
              fontSize: '1rem',
              margin: 0,
              opacity: 0.8
            }}>
              {content.consulting.desc}
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '2rem',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              marginBottom: '1rem',
              fontWeight: 600
            }}>
              {content.development.title}
            </h3>
            <p style={{
              fontSize: '1rem',
              margin: 0,
              opacity: 0.8
            }}>
              {content.development.desc}
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '2rem',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              marginBottom: '1rem',
              fontWeight: 600
            }}>
              {content.support.title}
            </h3>
            <p style={{
              fontSize: '1rem',
              margin: 0,
              opacity: 0.8
            }}>
              {content.support.desc}
            </p>
          </div>
        </div>
        <div style={{ marginTop: '3rem' }}>
          <a
            href={bussinessLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '16px 32px',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '1.1rem',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {content.buttonText}
          </a>
        </div>
      </div>
    </div>
  );
};

export const HomeLayout = (
  props: React.ComponentProps<typeof DefaultHomeLayout>
) => (
  <>
    <DefaultHomeLayout {...props} />
    <BusinessSection />
  </>
);
