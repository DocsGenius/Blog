import { Link } from 'react-router-dom'

export default function ArticlePreview({ article, showAuthor = true }) {
  return (
    <article className="article-card">
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
            {showAuthor && article.author && article.authorAvatar && (
              <div className="article-author-mini">
                <img 
                  src={article.authorAvatar} 
                  alt={article.author}
                  className="author-avatar-mini"
                />
                <span>{article.author}</span>
              </div>
            )}
            <span className="reading-time">{article.readingTime}</span>
          </div>
        </div>
      </Link>
    </article>
  )
}
