import { Link } from 'react-router-dom';

export default function ArticleCard({ article, showAuthor = true }) {
  // Ensure article has all required fields with defaults
  const {
    slug,
    title = 'Untitled',
    subtitle = '',
    author = 'Anonymous',
    authorAvatar = '/authors/default.png',
    date = new Date().toLocaleDateString(),
    category = 'Uncategorized',
    readingTime = '5 min read',
    coverImage,
  } = article;

  return (
    <article className="article-card">
      <Link to={`/article/${slug}`} className="article-link">
        {coverImage && (
          <div className="article-card-image">
            <img src={coverImage} alt={title} />
          </div>
        )}
        
        <div className="article-card-content">
          <div className="article-card-meta">
            <span className="article-category">{category}</span>
            <span className="article-date">{date}</span>
          </div>
          
          <h2 className="article-card-title">{title}</h2>
          <p className="article-card-subtitle">{subtitle}</p>
          
          <div className="article-card-footer">
            {showAuthor && (
              <div className="article-author-mini">
                <img 
                  src={authorAvatar} 
                  alt={author}
                  className="author-avatar-mini"
                  onError={(e) => {
                    e.target.src = '/authors/default.png';
                  }}
                />
                <span>{author}</span>
              </div>
            )}
            <span className="reading-time">{readingTime}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
