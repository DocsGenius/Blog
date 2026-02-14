import { useLocation } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { getMarkdownComponents } from '../components/MarkdownComponents'
import SEO from '../components/SEO'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import html2canvas from 'html2canvas'

export default function PreviewArticle() {
  const location = useLocation()
  let article = location.state?.articleData

  if (!article) {
    const saved = localStorage.getItem('previewArticleData')
    if (saved) {
      try {
        article = JSON.parse(saved)
        // Removed removal for debugging
      } catch (error) {
        console.error('Error loading preview data:', error)
      }
    }
  }

  useDocumentTitle(`${article?.title || 'Preview Article'} - Genius Docs`)

  // Auto-download functionality
  useEffect(() => {
    if (article?.autoDownload) {
      // Wait for content to render, then capture and download
      const timer = setTimeout(async () => {
        try {
          const articleElement = document.querySelector('.article')
          if (articleElement) {
            const canvas = await html2canvas(articleElement, {
              backgroundColor: null, // Use element's background
              useCORS: true,
              allowTaint: false,
              scale: 2, // Higher quality
              width: articleElement.offsetWidth,
              height: articleElement.scrollHeight,
              scrollX: 0,
              scrollY: 0,
              windowWidth: articleElement.offsetWidth,
              windowHeight: articleElement.scrollHeight
            })
            
            const link = document.createElement('a')
            link.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'article'}.png`
            link.href = canvas.toDataURL('image/png')
            link.click()
            
            // Close the window after download
            setTimeout(() => window.close(), 1000)
          }
        } catch (error) {
          console.error('Auto-download failed:', error)
        }
      }, 2000) // Wait 2 seconds for rendering
      
      return () => clearTimeout(timer)
    }
  }, [article])

  // Preprocess content to replace {chart-name} or {chart-name} with chart markdown
  const processContent = (rawContent) => {
    return rawContent.replace(/\{\s*([^}]+)\s*\}/g, (match, chartId) => {
      return `\`\`\`chart-bar\n${chartId.trim()}\n\`\`\``
    })
  }

  if (!article) {
    return (
      <>
        <SEO title="Preview Not Found" />
        <div className="article-container">
          <div className="article-error">
            <h1>Preview Not Available</h1>
            <p>No article data provided for preview.</p>
            <Link to="/create-article" className="back-link">← Back to Create Article</Link>
          </div>
        </div>
      </>
    )
  }

  const processedContent = processContent(article.content)

  return (
    <>
      <SEO 
        title={article.title}
        description={article.subtitle}
        ogImage={article.coverImage}
        ogUrl="https://geniusdocs.blog/preview"
        type="article"
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
              {article?.autoDownload ? (
                <div className="copyright-text">© Genius Docs</div>
              ) : (
                <Link to="/create-article" className="back-link">← Back to Editor</Link>
              )}
            </div>
          </footer>
        </article>
      </div>
    </>
  )
}
