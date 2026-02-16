import { writeFileSync } from 'fs'
import { join } from 'path'

const SITE_URL = 'https://geniusdocs.blog'
const API_BASE_URL = 'https://genius-docs-worker.k2tfbvzgpm.workers.dev'

// Fetch articles from Cloudflare Worker API
async function loadArticlesFromAPI() {
  try {
    console.log('Fetching articles from:', `${API_BASE_URL}/api/articles`);
    
    const response = await fetch(`${API_BASE_URL}/api/articles`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status} - ${response.statusText}`);
    }
    
    const articles = await response.json();
    console.log(`Fetched ${articles.length} articles from API`);
    
    // Transform API response to match expected format
    return articles.map(article => ({
      slug: article.slug,
      title: article.title,
      subtitle: article.subtitle,
      author: article.author,
      date: article.date,
      category: article.category,
      tags: article.tags || [],
      id: article.slug
    }));
  } catch (error) {
    console.error('Error loading articles from API:', error);
    throw error;
  }
}

async function generateSitemap() {
  try {
    const articles = await loadArticlesFromAPI()
    const currentDate = new Date().toISOString()
    
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/articles', priority: '0.9', changefreq: 'weekly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' }
    ]
    
    const articlePages = articles.map(article => ({
      url: `/article/${article.slug}`,
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: article.date || currentDate
    }))
    
    const allPages = [...staticPages, ...articlePages]
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod || currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`
    
    writeFileSync(join(process.cwd(), 'public', 'sitemap.xml'), sitemap)
    console.log('✅ Sitemap generated successfully!')
    console.log(`📍 Location: ${join(process.cwd(), 'public', 'sitemap.xml')}`)
    console.log(`📊 Generated ${allPages.length} URLs (${articles.length} articles + ${staticPages.length} static pages)`)
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error)
    process.exit(1)
  }
}

await generateSitemap()
