// Utility functions for loading and parsing markdown articles

import yaml from 'js-yaml'
import authorsData from '../data/authorsData.js'

// Import all markdown files as raw text
const markdownFiles = import.meta.glob('../articles/*.md', { query: '?raw', import: 'default' })

// Parse date string to timestamp
function parseDate(dateStr) {
  // Handle format like "February 12th, 2026"
  // Remove ordinal suffix AND handle comma
  const cleanedDate = dateStr
    .replace(/(\d+)(st|nd|rd|th)/, '$1')  // Remove st, nd, rd, th
    .replace(',', '');  // Remove comma
  const date = new Date(cleanedDate)
  return isNaN(date.getTime()) ? 0 : date.getTime()
}

export async function getAllArticles(limit = null, offset = 0) {
  const articles = []
  
  for (const path in markdownFiles) {
    const content = await markdownFiles[path]()
    const article = parseArticle(content, path)
    articles.push(article)
  }
  
  // Sort by date (newest first)
  const sortedArticles = articles.sort((a, b) => parseDate(b.date) - parseDate(a.date))
  
  // Apply limit and offset if specified
  if (limit !== null) {
    return sortedArticles.slice(offset, offset + limit)
  }
  
  return sortedArticles
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
  
  // USE JS-YAML INSTEAD OF MANUAL LOOP
  const frontmatter = yaml.load(match[1]); 
  const markdownContent = match[2];
  
  // Extract slug from file path
  const slug = filePath.split('/').pop().replace('.md', '')
  
  // Resolve author if authorId is present
  if (frontmatter.authorId) {
    const resolvedAuthor = resolveAuthor(frontmatter.authorId);
    if (resolvedAuthor) {
      frontmatter.author = resolvedAuthor.name;
      frontmatter.authorBio = resolvedAuthor.bio;
      frontmatter.authorAvatar = resolvedAuthor.avatar;
      frontmatter.authorLinkedin = resolvedAuthor.linkedin;
    }
  }
  
  return {
    id: slug,
    slug,
    ...frontmatter,
    content: markdownContent
  }
}
