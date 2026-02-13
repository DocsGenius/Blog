import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getAllArticles } from '../utils/articleUtils'
import Features from './Features'
import '../styles/home.css'

export default function Home() {
  const [latestArticles, setLatestArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadLatestArticles() {
      try {
        const articles = await getAllArticles(3) // Only load first 3 articles
        setLatestArticles(articles)
      } catch (error) {
        console.error('Error loading latest articles:', error)
      } finally {
        setLoading(false)
      }
    }

    loadLatestArticles()
  }, [])

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Genius Docs</h1>
          <p className="hero-subtitle">
            Discover insights, tutorials, and best practices in modern web development
          </p>
          <div className="hero-actions">
            <Link to="/articles" className="btn btn-primary">
              Browse Articles
            </Link>
            <a href="#about" className="btn btn-secondary">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="latest-articles">
        <div className="section-header">
          <h2>Latest Articles</h2>
          <p>Stay updated with our newest content</p>
        </div>
        
        {loading ? (
          <div className="loading">Loading articles...</div>
        ) : (
          <div className="articles-preview">
            {latestArticles.map((article) => (
              <article key={article.id} className="article-preview-card">
                <Link to={`/article/${article.slug}`} className="article-preview-link">
                  {article.coverImage && (
                    <div className="article-preview-image">
                      <img src={article.coverImage} alt={article.title} />
                    </div>
                  )}
                  
                  <div className="article-preview-content">
                    <div className="article-preview-meta">
                      <span className="article-category">{article.category}</span>
                      <span className="article-date">{article.date}</span>
                    </div>
                    
                    <h3 className="article-preview-title">{article.title}</h3>
                    <p className="article-preview-subtitle">{article.subtitle}</p>
                    
                    <div className="article-preview-footer">
                      <span className="reading-time">{article.readingTime}</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
        
        <div className="view-all">
          <Link to="/articles" className="btn btn-outline">
            View All Articles →
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <Features />
    </div>
  )
}
