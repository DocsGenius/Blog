import { writeFileSync } from 'fs'
import { join } from 'path'

const SITE_URL = 'https://geniusdocs.blog'
const API_BASE_URL = 'https://genius-docs-worker.k2tfbvzgpm.workers.dev'

// Parse human-readable dates and convert to ISO format
function parseDateToISO(dateString) {
  try {
    // Handle various date formats from the API
    // Examples: "February 15, 2026", "February 14th, 2026", "2026-02-15"
    
    // If it's already an ISO date, return as-is
    if (dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
      return new Date(dateString).toISOString();
    }
    
    // Remove ordinal suffixes (st, nd, rd, th) from day numbers
    const cleanDateString = dateString.replace(/(\d+)(st|nd|rd|th)/, '$1');
    
    // Parse human-readable dates like "February 15, 2026"
    const date = new Date(cleanDateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
    
    // Fallback: return current date if parsing fails
    console.warn(`Could not parse date: ${dateString}, using current date`);
    return new Date().toISOString();
  } catch (error) {
    console.warn(`Error parsing date: ${dateString}, using current date`);
    return new Date().toISOString();
  }
}

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
      lastmod: parseDateToISO(article.date)
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
