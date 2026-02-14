import { Helmet } from 'react-helmet-async'

const SEO = ({ 
  title, 
  description, 
  ogImage, 
  ogUrl, 
  type = 'website',
  article = null,
  keywords = []
}) => {
  const siteTitle = 'Genius Docs'
  const fullTitle = title ? `${title} - ${siteTitle}` : siteTitle
  const siteUrl = 'https://geniusdocs.blog'
  const defaultImage = `${siteUrl}/og-default.jpg`
  const defaultDescription = 'Discover insights, tutorials, and best practices in modern web development'

  // Generate structured data for articles
  const getStructuredData = () => {
    if (!article) return null

    const articleData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.subtitle || description,
      "image": article.coverImage ? `${siteUrl}${article.coverImage}` : defaultImage,
      "datePublished": article.date,
      "dateModified": article.date,
      "author": {
        "@type": "Person",
        "name": article.author,
        "image": article.authorAvatar ? `${siteUrl}${article.authorAvatar}` : null
      },
      "publisher": {
        "@type": "Organization",
        "name": "Genius Docs",
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/logo.png`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${siteUrl}/article/${article.slug}`
      }
    }

    // Add category/tags if available
    if (article.category) {
      articleData.about = article.category
    }

    return JSON.stringify(articleData)
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      
      {/* Canonical URL */}
      {ogUrl && <link rel="canonical" href={ogUrl} />}
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={ogImage || defaultImage} />
      <meta property="og:url" content={ogUrl || siteUrl} />
      <meta property="og:site_name" content={siteTitle} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={ogImage || defaultImage} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content={article?.author || siteTitle} />
      
      {/* Structured Data */}
      {article && (
        <script type="application/ld+json">
          {getStructuredData()}
        </script>
      )}
    </Helmet>
  )
}

export default SEO
