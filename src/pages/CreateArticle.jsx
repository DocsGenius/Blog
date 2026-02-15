import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { getMarkdownComponents } from '../components/MarkdownComponents'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import SEO from '../components/SEO'
import '../styles/article.css'
import yaml from 'js-yaml'
import html2canvas from 'html2canvas'
import domtoimage from 'dom-to-image-more'
import { renderToString } from 'react-dom/server'
import { createRoot } from 'react-dom/client'
import { render } from 'react-dom'

export default function CreateArticle() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [authorLinkedin, setAuthorLinkedin] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [date, setDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))
  const [authorAvatar, setAuthorAvatar] = useState('')
  const [authorWebsite, setAuthorWebsite] = useState('')
  const [readingTime, setReadingTime] = useState('')
  const [chartDataYaml, setChartDataYaml] = useState('')
  const [loading, setLoading] = useState(false)
  const [extraSettingsExpanded, setExtraSettingsExpanded] = useState(false)

  const saveData = () => {
    const processedContent = processChartPlaceholders(content)
    const data = {
      title,
      subtitle,
      content: processedContent,
      author,
      authorAvatar,
      authorWebsite,
      authorLinkedin,
      category,
      tags,
      coverImage,
      date,
      readingTime,
      chartDataYaml,
      timestamp: Date.now()
    }
    localStorage.setItem('createArticleDraft', JSON.stringify(data))
  }

  const loadData = () => {
    const saved = localStorage.getItem('createArticleDraft')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setTitle(parsed.title || '')
        setSubtitle(parsed.subtitle || '')
        setContent(parsed.content || '')
        setAuthor(parsed.author || '')
        setAuthorAvatar(parsed.authorAvatar || '')
        setAuthorWebsite(parsed.authorWebsite || '')
        setAuthorLinkedin(parsed.authorLinkedin || '')
        setCategory(parsed.category || '')
        setTags(parsed.tags || '')
        setCoverImage(parsed.coverImage || '')
        setDate(parsed.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))
        setReadingTime(parsed.readingTime || '')
        setChartDataYaml(parsed.chartDataYaml || '')
      } catch (error) {
        console.error('Error loading draft:', error)
        localStorage.removeItem('createArticleDraft')
      }
    }
  }

  const clearDraft = () => {
    localStorage.removeItem('createArticleDraft')
    setTitle('')
    setSubtitle('')
    setContent('')
    setAuthor('')
    setAuthorAvatar('')
    setAuthorWebsite('')
    setAuthorLinkedin('')
    setCategory('')
    setTags('')
    setCoverImage('')
    setDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))
    setReadingTime('')
    setChartDataYaml('')
  }

  useEffect(() => {
    loadData()
  }, [])

  // Parse chart data from YAML string using js-yaml for consistency with articleUtils
  const parseChartData = (yamlStr) => {
    if (!yamlStr.trim()) return {}
    try {
      return yaml.load(yamlStr) || {}
    } catch (error) {
      console.error('Error parsing chart data YAML:', error)
      return {}
    }
  }

  // Replace { chart-name } placeholders with chart markdown syntax
  const processChartPlaceholders = (text) => {
    return text.replace(/\{([^}]+)\}/g, (match, chartName) => {
      const trimmedName = chartName.trim()
      if (trimmedName) {
        return `\`\`\`chart-bar\n${trimmedName}\n\`\`\``
      }
      return match
    })
  }

  const chartData = parseChartData(chartDataYaml)

  const handleDownload = async () => {
    const processedContent = processChartPlaceholders(content)
    const articleData = {
      title: title || 'Untitled Article',
      subtitle: subtitle || 'No subtitle provided',
      content: processedContent || 'No content written yet.',
      author: author || 'Anonymous',
      authorAvatar: authorAvatar || '/authors/default.png',
      authorBio: 'Author bio not provided',
      authorLinkedin: authorLinkedin || null,
      category: category || 'Uncategorized',
      date: date || new Date().toLocaleDateString(),
      readingTime: readingTime || '5 min read',
      coverImage: coverImage || null,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      chartData: chartData,
      slug: 'download',
      autoDownload: true // Flag to trigger automatic download
    }
    
    try {
      localStorage.setItem('previewDraftData', JSON.stringify(articleData))
      // Open preview in new window which will auto-download
      window.open('/#/preview', '_blank')
    } catch (error) {
      alert('Failed to prepare download data. Please try again.')
    }
  }

  const handlePreview = () => {
    const processedContent = processChartPlaceholders(content)
    const articleData = {
      title: title || 'Untitled Article',
      subtitle: subtitle || 'No subtitle provided',
      content: processedContent || 'No content written yet.',
      author: author || 'Anonymous',
      authorAvatar: authorAvatar || '/authors/default.png', // Default avatar
      authorWebsite: authorWebsite || null,
      authorBio: 'Author bio not provided',
      authorLinkedin: authorLinkedin || null,
      category: category || 'Uncategorized',
      date: date || new Date().toLocaleDateString(),
      readingTime: readingTime || '5 min read',
      coverImage: coverImage || null,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      chartData: chartData,
      slug: 'preview'
    }
    try {
      localStorage.setItem('previewDraftData', JSON.stringify(articleData))
      window.open('/#/preview', '_blank')
    } catch (error) {
      alert('Failed to save preview data. The article may be too large: ' + error.message)
    }
  }

  const handleSubmitToWorker = async () => {
    const processedContent = processChartPlaceholders(content);
    
    const articleData = {
      title: title || 'Untitled Article',
      subtitle: subtitle || 'No subtitle provided',
      content: processedContent || 'No content written yet.',
      author: author || 'Anonymous',
      authorAvatar: authorAvatar || '/authors/default.png',
      authorWebsite: authorWebsite || null,
      authorBio: 'Author bio not provided',
      authorLinkedin: authorLinkedin || null,
      category: category || 'Uncategorized',
      date: date || new Date().toLocaleDateString(),
      readingTime: readingTime || '5 min read',
      coverImage: coverImage || null,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      chartData: chartData,
    };

    try {
      setLoading(true);
      
      const response = await fetch('https://genius-docs-worker.k2tfbvzgpm.workers.dev/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify(articleData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Article submitted successfully, now in manual review! Slug: ${result.slug}`);
        // Optionally clear the form
        if (confirm('Clear the form?')) {
          clearDraft();
        }
      } else {
        alert(`Failed to submit: ${result.error}`);
      }
    } catch (error) {
      alert(`Error submitting article: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO 
        title="Create Article"
        description="Write and preview your article"
        ogUrl="https://geniusdocs.blog/create-article"
      />
      <div className="article-container">
        <div className="create-article-wrapper" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}>
          <div className="create-article-editor">
            <header className="article-header">
              <div className="article-meta">
                <input
                  type="text"
                  placeholder="Category (e.g., Newsletter)"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="category-input"
                />
                <input
                  type="text"
                  placeholder="Date (e.g., February 11th, 2026)"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="date-input"
                />
                <input
                  type="text"
                  placeholder="Reading Time (e.g., 5 min read)"
                  value={readingTime}
                  onChange={(e) => setReadingTime(e.target.value)}
                  className="reading-time-input"
                />
              </div>
              <input
                type="text"
                placeholder="Article Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="article-title-input"
              />
              <input
                type="text"
                placeholder="Article Subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="article-subtitle-input"
              />
              <div className="article-author">
                <div className="author-info">
                  <input
                    type="text"
                    placeholder="Author Name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="author-name-input"
                  />
                </div>
              </div>
              <div className="extra-settings-section">
                <button
                  type="button"
                  className="extra-settings-toggle"
                  onClick={() => setExtraSettingsExpanded(!extraSettingsExpanded)}
                >
                  {extraSettingsExpanded ? '▼' : '▶'} Extra Settings
                </button>
                {extraSettingsExpanded && (
                  <div className="extra-settings-content">
                    <input
                      type="url"
                      placeholder="Author LinkedIn URL (optional)"
                      value={authorLinkedin}
                      onChange={(e) => setAuthorLinkedin(e.target.value)}
                      className="author-linkedin-input"
                    />
                    <input
                      type="url"
                      placeholder="Author Website URL (optional)"
                      value={authorWebsite}
                      onChange={(e) => setAuthorWebsite(e.target.value)}
                      className="author-website-input"
                    />
                    <input
                      type="url"
                      placeholder="Author Avatar URL (optional)"
                      value={authorAvatar}
                      onChange={(e) => setAuthorAvatar(e.target.value)}
                      className="author-avatar-input"
                    />
                    <input
                      type="text"
                      placeholder="Cover Image URL"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="cover-image-input"
                    />
                  </div>
                )}
              </div>
              <input
                type="text"
                placeholder="Tags (comma-separated, e.g., Technology, Writing)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="tags-input"
              />
            </header>

            <div className="create-article-content">
              <div className="editor-section">
                <h3>Markdown Editor</h3>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onBlur={(e) => setContent(processChartPlaceholders(e.target.value))}
                  placeholder="Write your article content in Markdown... Use { chart-id } to insert charts easier, pie or bar"
                  className="markdown-editor"
                  rows={20}
                />
                <h3>Chart Data (YAML)</h3>
                <textarea
                  value={chartDataYaml}
                  onChange={(e) => setChartDataYaml(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab' && !e.shiftKey) {
                      e.preventDefault()
                      const template = `monthly-sales:
  - month: 'Jan'
    revenue: 400
    costs: 200
  - month: 'Feb'
    revenue: 600
    costs: 300`
                      const start = e.target.selectionStart
                      const end = e.target.selectionEnd
                      const insertText = "\n" + template
                      const newValue = chartDataYaml.slice(0, start) + insertText + chartDataYaml.slice(end)
                      setChartDataYaml(newValue)
                      // Set cursor after the inserted template
                      setTimeout(() => {
                        e.target.selectionStart = e.target.selectionEnd = start + insertText.length
                      }, 0)
                    }
                  }}
                  placeholder="(Tab to use template) Enter chart data in YAML format, e.g.:
monthly-sales:
  - month: 'Jan'
    revenue: 400
    costs: 200
  - month: 'Feb'
    revenue: 600
    costs: 300"
                  className="chart-data-editor"
                  rows={10}
                />
              </div>
            </div>

            <footer className="article-footer">
              <div className="article-actions">
                <button 
                  className="back-link" 
                  onClick={() => { 
                    if (confirm('Are you sure you want to discard your current draft?')) { 
                      clearDraft(); 
                    } 
                  }}
                >
                  Discard Draft
                </button>
                <button className="download-button" onClick={handleDownload}>Download as Image</button>
                <button className="preview-button" onClick={handlePreview}>Preview Article</button>
                <button className="save-button" onClick={saveData}>Save Draft</button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSubmitToWorker}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit to Blog'}
                </button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  )
}
