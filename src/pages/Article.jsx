import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getArticleBySlug } from '../utils/articleUtils'
import ReactMarkdown from 'react-markdown'
import { getMarkdownComponents } from '../components/MarkdownComponents'
import SEO from '../components/SEO'

export default function Article() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadArticle() {
      try {
        const loadedArticle = await getArticleBySlug(slug)
        setArticle(loadedArticle)
      } catch (error) {
        console.error('Error loading article:', error)
      } finally {
        setLoading(false)
      }
    }

    loadArticle()
  }, [slug])

  if (loading) {
    return (
      <>
        <SEO title="Loading Article" />
        <div className="article-container">
          <div className="loading">Loading article...</div>
        </div>
      </>
    )
  }

  if (!article) {
    return (
      <>
        <SEO title="Article Not Found" description="The article you're looking for doesn't exist." />
        <div className="article-container">
          <div className="article-error">
            <h1>Article Not Found</h1>
            <p>The article you're looking for doesn't exist.</p>
            <Link to="/" className="back-link">← Back to Home</Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO 
        title={article.title}
        description={article.subtitle}
        ogImage={article.coverImage}
        ogUrl={`https://geniusdocs.blog/article/${article.slug}`}
        type="article"
        article={article}
        keywords={[article.category, 'web development', 'programming', 'tutorial']}
      />
      <div className="article-container">
      <article className="article">
        <header className="article-header">
          <div className="article-meta">
            <time className="article-date">{article.date}</time>
            <span className="article-category">{article.category}</span>
            <span className="reading-time">{article.readingTime}</span>
          </div>
          <h1 className="article-title">{article.title}</h1>
          <p className="article-subtitle">{article.subtitle}</p>
          {article.author && (
            <div className="article-author">
              <div className="author-avatar">
                {article.authorLinkedin ? (
                  <a 
                    href={article.authorLinkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="View LinkedIn Profile"
                  >
                    <img src={article.authorAvatar} alt={article.author} onError={(e) => { e.target.src = '/authors/default.png'; }} />
                  </a>
                ) : (
                  <img src={article.authorAvatar} alt={article.author} onError={(e) => { e.target.src = '/authors/default.png'; }} />
                )}
              </div>
              <div className="author-info">
                <div className="author-name-row">
                  <div className="author-name">{article.author}</div>
                  {console.log('authorLinkedin:', article.authorLinkedin) || (article.authorLinkedin && (
                    <a
                      href={article.authorLinkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View LinkedIn Profile"
                      className="linkedin-button"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  ))}
                </div>
                <div className="author-bio">{article.authorBio}</div>
              </div>
            </div>
          )}
        </header>

        {article.coverImage && (
          <div className="article-cover">
            <img src={article.coverImage} alt={article.title} />
          </div>
        )}

        <div className="article-content">
          <ReactMarkdown components={getMarkdownComponents(article.chartData)}>
            {article.content}
          </ReactMarkdown>
        </div>

        <footer className="article-footer">
          <div className="article-tags">
            {article.tags && article.tags.map((tag, index) => (
              <span key={index} className="article-tag">
                #{tag}
              </span>
            ))}
          </div>
          <div className="article-actions">
            <Link to="/" className="back-link">← Back to Articles</Link>
          </div>
        </footer>
      </article>
    </div>
    </>
  )
}
