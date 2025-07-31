import { usePageData } from 'rspress/runtime'
import { chineseContent, englishContent, bussinessLink } from './constants'

export const BusinessSection = () => {
  const { page } = usePageData()
  const isEnglish = page.lang === 'en'
  const content = isEnglish ? englishContent : chineseContent

  return (
    <div
      style={{
        margin: '80px 0',
        padding: '60px 0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textAlign: 'center' as const,
        color: 'white',
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
            fontSize: '2.5rem',
            marginBottom: '1rem',
            fontWeight: 700,
          }}
        >
          {content.title}
        </h2>
        <p
          style={{
            fontSize: '1.2rem',
            marginBottom: '3rem',
            opacity: 0.9,
          }}
        >
          {content.subtitle}
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '2rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h3
              style={{
                fontSize: '1.3rem',
                marginBottom: '1rem',
                fontWeight: 600,
              }}
            >
              {content.consulting.title}
            </h3>
            <p
              style={{
                fontSize: '1rem',
                margin: 0,
                opacity: 0.8,
              }}
            >
              {content.consulting.desc}
            </p>
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '2rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h3
              style={{
                fontSize: '1.3rem',
                marginBottom: '1rem',
                fontWeight: 600,
              }}
            >
              {content.development.title}
            </h3>
            <p
              style={{
                fontSize: '1rem',
                margin: 0,
                opacity: 0.8,
              }}
            >
              {content.development.desc}
            </p>
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '2rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h3
              style={{
                fontSize: '1.3rem',
                marginBottom: '1rem',
                fontWeight: 600,
              }}
            >
              {content.support.title}
            </h3>
            <p
              style={{
                fontSize: '1rem',
                margin: 0,
                opacity: 0.8,
              }}
            >
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
              backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {content.buttonText}
          </a>
        </div>
      </div>
    </div>
  )
}
