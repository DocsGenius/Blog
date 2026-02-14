import { useState, useEffect } from 'react'
import { getAllArticles } from '../utils/articleUtils'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import ArticlePreview from '../components/ArticlePreview'
import SEO from '../components/SEO'
import '../styles/article-preview.css'

export default function ArticleList() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useDocumentTitle('Articles - Genius Docs')

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
    <>
      <SEO 
        title="Articles"
        description="Discover insights, tutorials, and best practices in modern web development"
        ogUrl="https://geniusdocs.blog/articles"
        keywords={['articles', 'web development', 'programming', 'tutorials', 'guides']}
      />
      <div className="article-list-container">
      <div className="article-list-header">
        <h1>Latest Articles</h1>
        <p>Discover insights, tutorials, and best practices in modern web development</p>
      </div>
      
      <div className="article-grid">
        {articles.map((article) => (
          <ArticlePreview key={article.id} article={article} showAuthor={true} />
        ))}
      </div>
    </div>
    </>
  )
}
