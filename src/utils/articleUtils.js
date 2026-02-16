// src/utils/articleUtils.js

const API_BASE_URL = 'https://genius-docs-worker.k2tfbvzgpm.workers.dev';

export async function getAllArticles(limit) {
  try {
    console.log('Fetching articles from:', `${API_BASE_URL}/api/articles`);
    
    const response = await fetch(`${API_BASE_URL}/api/articles`);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch articles: ${response.status} - ${errorText}`);
    }
    
    const articles = await response.json();
    console.log('Raw articles from API:', articles);
    
    // API already sorts by date (newest first), so no need to sort again
    
    // Apply limit if specified
    const limitedArticles = limit ? articles.slice(0, limit) : articles;
    
    // Transform the data to match what ArticleCard expects
    const transformedArticles = limitedArticles.map(article => ({
      id: article.slug || article.id,
      slug: article.slug,
      title: article.title,
      subtitle: article.subtitle,
      author: article.author,
      authorAvatar: article.authorAvatar || '/authors/default.png',
      authorLinkedin: article.authorLinkedin,
      date: article.date,
      category: article.category,
      tags: article.tags || [],
      readingTime: article.readingTime,
      coverImage: article.coverImage,
    }));
    
    console.log('Transformed articles:', transformedArticles);
    return transformedArticles;
  } catch (error) {
    console.error('Error in getAllArticles:', error);
    return []; // Return empty array on error to prevent UI breaking
  }
}

export async function getArticleBySlug(slug) {
  try {
    console.log(`Fetching article: ${slug}`);
    
    const response = await fetch(`${API_BASE_URL}/api/articles/${slug}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`Article ${slug} not found`);
        return null;
      }
      throw new Error(`Failed to fetch article: ${response.status}`);
    }
    
    const article = await response.json();
    console.log(`Loaded article:`, article);
    return article;
  } catch (error) {
    console.error(`Error in getArticleBySlug for ${slug}:`, error);
    return null;
  }
}
