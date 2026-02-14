import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getArticleBySlug } from '../utils/articleUtils'
import ReactMarkdown from 'react-markdown'
import { getMarkdownComponents } from '../components/MarkdownComponents'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function Article() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useDocumentTitle(article?.title + ' - Genius Docs' || 'Genius Docs')

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
      <div className="article-container">
        <div className="loading">Loading article...</div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="article-container">
        <div className="article-error">
          <h1>Article Not Found</h1>
          <p>The article you're looking for doesn't exist.</p>
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </div>
    )
  }

  return (
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
                    <img src={article.authorAvatar} alt={article.author} />
                  </a>
                ) : (
                  <img src={article.authorAvatar} alt={article.author} />
                )}
              </div>
              <div className="author-info">
                <div className="author-name">{article.author}</div>
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
  )
}
