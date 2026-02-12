// Utility functions for loading and parsing markdown articles

import authorsData from '../data/authorsData.js'

// Import all markdown files as raw text
const markdownFiles = import.meta.glob('../articles/*.md', { query: '?raw', import: 'default' })

// Parse date string to timestamp
function parseDate(dateStr) {
  // Handle format like "February 12th, 2026"
  const cleanedDate = dateStr.replace(/(\d+)(st|nd|rd|th)/, '$1')
  const date = new Date(cleanedDate)
  return isNaN(date.getTime()) ? 0 : date.getTime()
}

export async function getAllArticles() {
  const articles = []
  
  for (const path in markdownFiles) {
    const content = await markdownFiles[path]()
    const article = parseArticle(content, path)
    articles.push(article)
  }
  
  // Sort by date (newest first)
  return articles.sort((a, b) => parseDate(b.date) - parseDate(a.date))
}

export async function getArticleBySlug(slug) {
  const path = `../articles/${slug}.md`
  
  if (!markdownFiles[path]) {
    return null
  }
  
  const content = await markdownFiles[path]()
  return parseArticle(content, path)
}

function resolveAuthor(authorId) {
  const author = authorsData[authorId]
  if (!author) {
    console.warn(`Author with ID "${authorId}" not found`)
    return null
  }
  return author
}

function parseArticle(content, filePath) {
  // Split frontmatter from content
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    throw new Error(`Invalid frontmatter in ${filePath}`)
  }
  
  const frontmatterStr = match[1]
  const markdownContent = match[2]
  
  // Parse frontmatter
  const frontmatter = {}
  frontmatterStr.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      let value = line.slice(colonIndex + 1).trim()
      
      // Remove quotes if present
      if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1)
      } else if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1)
      }
      
      // Parse arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(item => item.trim().replace(/['"]/g, ''))
      }
      
      frontmatter[key] = value
    }
  })
  
  // Extract slug from file path
  const slug = filePath.split('/').pop().replace('.md', '')
  
  // Resolve author if authorId is present
  let resolvedAuthor = null
  if (frontmatter.authorId) {
    resolvedAuthor = resolveAuthor(frontmatter.authorId)
    if (resolvedAuthor) {
      frontmatter.author = resolvedAuthor.name
      frontmatter.authorBio = resolvedAuthor.bio
      frontmatter.authorAvatar = resolvedAuthor.avatar
      frontmatter.authorLinkedin = resolvedAuthor.linkedin
    }
  }
  
  return {
    id: slug,
    slug,
    ...frontmatter,
    content: markdownContent
  }
}
