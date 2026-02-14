import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getAllArticles } from '../utils/articleUtils'
import Features from "../components/Features";
import ArticlePreview from '../components/ArticlePreview'
import SEO from '../components/SEO'
import '../styles/home.css'
import '../styles/article-preview.css'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function Home() {
  useDocumentTitle('Home - Genius Docs')
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
    <>
      <SEO 
        title="Home"
        description="Welcome to Genius Docs - Discover insights, tutorials, and best practices in modern web development"
        ogUrl="https://geniusdocs.blog"
        keywords={['genius docs', 'web development', 'programming tutorials', 'coding guides', 'tech articles']}
      />
      <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Genius Docs</h1>
          <p className="hero-subtitle">
            Discover insights, tutorials, and best practices in modern web development
          </p>
          <div className="hero-actions">
            <Link to="/articles" className="btn browse-btn">
              Browse Articles
            </Link>
            <a href="#about" className="btn learn-btn">
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
              <ArticlePreview key={article.id} article={article} showAuthor={true} />
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
    </>
  )
}
