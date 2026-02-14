import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import yaml from 'js-yaml'

const SITE_URL = 'https://geniusdocs.blog'

// Node.js compatible article loading (not using Vite's import.meta.glob)
function loadArticlesNodeJS() {
  const articlesDir = join(process.cwd(), 'src', 'articles')
  const articles = []
  
  try {
    const files = readdirSync(articlesDir).filter(file => file.endsWith('.md'))
    
    for (const file of files) {
      const filePath = join(articlesDir, file)
      const content = readFileSync(filePath, 'utf-8')
      
      // Parse frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
      if (frontmatterMatch) {
        const frontmatter = yaml.load(frontmatterMatch[1])
        const slug = file.replace('.md', '')
        
        articles.push({
          ...frontmatter,
          slug,
          id: slug
        })
      }
    }
  } catch (error) {
    console.error('Error loading articles:', error)
  }
  
  return articles
}

function generateSitemap() {
  try {
    const articles = loadArticlesNodeJS()
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
