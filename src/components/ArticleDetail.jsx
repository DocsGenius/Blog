import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getArticleBySlug } from '../utils/articleUtils'
import ReactMarkdown from 'react-markdown'

export default function ArticleDetail() {
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
      <div className="article-detail-container">
        <div className="loading">Loading article...</div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="article-detail-container">
        <div className="not-found">
          <h1>Article not found</h1>
          <Link to="/articles" className="back-link">← Back to articles</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="article-detail-container">
      <Link to="/articles" className="back-link">← Back to articles</Link>
      
      <article className="article-detail">
        {article.coverImage && (
          <div className="article-detail-image">
            <img src={article.coverImage} alt={article.title} />
          </div>
        )}
        
        <header className="article-detail-header">
          <div className="article-detail-meta">
            <span className="article-category">{article.category}</span>
            <span className="article-date">{article.date}</span>
            <span className="reading-time">{article.readingTime}</span>
          </div>
          
          <h1 className="article-detail-title">{article.title}</h1>
          <p className="article-detail-subtitle">{article.subtitle}</p>
          
          {article.author && (
            <div className="article-author">
              <img 
                src={article.authorAvatar} 
                alt={article.author}
                className="author-avatar"
              />
              <div className="author-info">
                <div className="author-name">{article.author}</div>
                {article.authorBio && (
                  <div className="author-bio">{article.authorBio}</div>
                )}
              </div>
            </div>
          )}
          
          {article.tags && (
            <div className="article-tags">
              {article.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </header>
        
        <div className="article-detail-content">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  )
}
