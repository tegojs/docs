import { useDark, usePageData } from "@rspress/core/runtime";
import { chineseContent, englishContent, bussinessLink } from './constants'

export const BusinessSection = () => {
  const { page } = usePageData();
  const isEnglish = page.lang === 'en';
  const isDark = useDark();
  const content = isEnglish ? englishContent : chineseContent

  return (
    <div style={{
      padding: '60px 0',
      backgroundColor: isDark ? '#06042CFF' : '#F8FAFF',
      textAlign: 'center' as const,
      color: '#2F2F2F'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          marginBottom: '1rem',
          fontWeight: 500,
          color: isDark ? '#FFFFFFDB' : '#444444FF'
        }}>
          {content.title}
        </h2>
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '3rem',
          opacity: 0.9,
          color: isDark ? '#FFFFFFDB' : '#444444FF'
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
            background: '#d8dfff50 ',
            padding: '2rem',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: isDark ? '2px solid #6778ca80' : '2px solid #d8dfff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', justifyContent: 'center' }}>
              <img
                src="homepage/consultation.png"
                alt={content.consulting.title}
                style={{ width: 24, height: 24, marginRight: 8 }}
              />
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 500,
                color: isDark ? '#FFFFFFDB' : '#444444FF'
              }}>
                {content.consulting.title}
              </h3>
            </div>
            <p style={{
              fontSize: '1rem',
              margin: 0,
              opacity: 0.8,
              color: isDark ? '#FFFFFFDB' : '#444444FF'
            }}>
              {content.consulting.desc}
            </p>
          </div>
          <div style={{
            background: '#d8dfff50 ',
            padding: '2rem',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: isDark ? '2px solid #6778ca80' : '2px solid #d8dfff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', justifyContent: 'center' }}>
              <img
                src="homepage/customization.png"
                alt={content.development.title}
                style={{ width: 24, height: 24, marginRight: 8 }}
              />
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 500,
                color: isDark ? '#FFFFFFDB' : '#444444FF'
              }}>
                {content.development.title}
              </h3>
            </div>
            <p style={{
              fontSize: '1rem',
              margin: 0,
              opacity: 0.8,
              color: isDark ? '#FFFFFFDB' : '#444444FF'
            }}>
              {content.development.desc}
            </p>
          </div>
          <div style={{
            background: '#d8dfff50 ',
            padding: '2rem',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: isDark ? '2px solid #6778ca80' : '2px solid #d8dfff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', justifyContent: 'center' }}>
              <img
                src="homepage/support.png"
                alt={content.support.title}
                style={{ width: 24, height: 24, marginRight: 8 }}
              />
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 500,
                color: isDark ? '#FFFFFFDB' : '#444444FF'
              }}>
                {content.support.title}
              </h3>
            </div>
            <p style={{
              fontSize: '1rem',
              margin: 0,
              opacity: 0.8,
              color: isDark ? '#FFFFFFDB' : '#444444FF'
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
              background: '#d8dfff50', // 稍加不透明感
              color: isDark ? '#FFFFFFDB' : '#444444FF',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '1.1rem',
              border: isDark ? '2px solid #6778ca80' : '2px solid #d8dfff',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#d8dfff20';
              e.currentTarget.style.borderColor = '#d8dfff50';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#d8dfff50';
              e.currentTarget.style.borderColor = isDark ? '2px solid #6778ca80' : '2px solid #d8dfff';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {content.buttonText}
          </a>
        </div>
      </div>
    </div>
  );
};