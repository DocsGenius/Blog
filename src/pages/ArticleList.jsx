import { useState, useEffect } from 'react';
import { getAllArticles } from '../utils/articleUtils';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import ArticleCard from '../components/ArticleCard';
import SEO from '../components/SEO';
import '../styles/article-card.css';

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useDocumentTitle('Articles - Genius Docs');

  useEffect(() => {
    async function loadArticles() {
      try {
        setLoading(true);
        setError(null);
        const loadedArticles = await getAllArticles();
        setArticles(loadedArticles);

        if (loadedArticles.length === 0) {
          console.log('No articles found');
        }
      } catch (error) {
        console.error('Error loading articles:', error);
        setError('Failed to load articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  if (loading) {
    return (
      <div className="article-list-container">
        <div className="loading">Loading articles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="article-list-container">
        <div className="error-message">{error}</div>
      </div>
    );
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

        {articles.length === 0 ? (
          <div className="no-articles">
            <p>No articles published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="article-grid">
            {articles.map((article) => (
              <ArticleCard key={article.id || article.slug} article={article} showAuthor={true} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
