import { getAllArticles } from '../src/utils/articleUtils.js'
import { writeFileSync } from 'fs'
import { join } from 'path'

const SITE_URL = 'https://geniusdocs.blog'

async function generateSitemap() {
  try {
    const articles = await getAllArticles()
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

generateSitemap()
