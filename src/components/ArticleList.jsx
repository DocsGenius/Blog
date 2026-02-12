import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getAllArticles } from '../utils/articleUtils'

export default function ArticleList() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadArticles() {
      try {
        const loadedArticles = await getAllArticles()
        setArticles(loadedArticles)
      } catch (error) {
        console.error('Error loading articles:', error)
      } finally {
        setLoading(false)
      }
    }

    loadArticles()
  }, [])

  if (loading) {
    return (
      <div className="article-list-container">
        <div className="loading">Loading articles...</div>
      </div>
    )
  }
  return (
    <div className="article-list-container">
      <div className="article-list-header">
        <h1>Latest Articles</h1>
        <p>Discover insights, tutorials, and best practices in modern web development</p>
      </div>
      
      <div className="article-grid">
        {articles.map((article) => (
          <article key={article.id} className="article-card">
            <Link to={`/article/${article.slug}`} className="article-link">
              {article.coverImage && (
                <div className="article-card-image">
                  <img src={article.coverImage} alt={article.title} />
                </div>
              )}
              
              <div className="article-card-content">
                <div className="article-card-meta">
                  <span className="article-category">{article.category}</span>
                  <span className="article-date">{article.date}</span>
                </div>
                
                <h2 className="article-card-title">{article.title}</h2>
                <p className="article-card-subtitle">{article.subtitle}</p>
                
                <div className="article-card-footer">
                  <div className="article-author-mini">
                    {article.author && (
                      <>
                        <img 
                          src={article.author.avatar} 
                          alt={article.author.name}
                          className="author-avatar-mini"
                        />
                        <span>{article.author.name}</span>
                      </>
                    )}
                  </div>
                  <span className="reading-time">{article.readingTime}</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
