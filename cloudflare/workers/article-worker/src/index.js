// article-worker.js
export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400', // 24 hours
        },
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // POST /api/articles - Submit new article
    if (request.method === 'POST' && path === '/api/articles') {
      return handleArticleSubmission(request, env);
    }
    
    // GET /api/articles - List all articles
    if (request.method === 'GET' && path === '/api/articles') {
      return handleListArticles(env);
    }
    
    // GET /api/articles/:slug - Get specific article
    if (request.method === 'GET' && path.startsWith('/api/articles/')) {
      const slug = path.replace('/api/articles/', '');
      return handleGetArticle(slug, env);
    }

    return new Response('Not found', { status: 404 });
  },
};

async function handleArticleSubmission(request, env) {
  try {
    const articleData = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'subtitle', 'content', 'author', 'category', 'date'];
    for (const field of requiredFields) {
      if (!articleData[field]) {
        return new Response(JSON.stringify({ 
          error: `Missing required field: ${field}` 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Generate slug from title
    const slug = generateSlug(articleData.title);
    
    // Add metadata
    const article = {
      ...articleData,
      slug,
      id: slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in R2
    const key = `articles/${slug}.json`;
    await env.ARTICLE_BUCKET.put(key, JSON.stringify(article, null, 2), {
      httpMetadata: { contentType: 'application/json' },
      customMetadata: {
        title: article.title,
        author: article.author,
        category: article.category,
        date: article.date,
        createdAt: article.createdAt,
      },
    });

    // Also store a reference in the article list index
    await updateArticleIndex(env, article);

    return new Response(JSON.stringify({ 
      success: true, 
      slug,
      message: 'Article submitted successfully' 
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to submit article',
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

async function handleListArticles(env) {
  try {
    // Try to get from cache first
    const cache = await env.ARTICLE_BUCKET.get('index/articles.json');
    if (cache) {
      const articles = JSON.parse(await cache.text());
      return new Response(JSON.stringify(articles), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        },
      });
    }

    // If no cache, list all articles
    const articles = [];
    const listed = await env.ARTICLE_BUCKET.list({ prefix: 'articles/' });
    
    for (const object of listed.objects) {
      if (object.key.endsWith('.json') && object.key !== 'index/articles.json') {
        const articleObj = await env.ARTICLE_BUCKET.get(object.key);
        if (articleObj) {
          const article = JSON.parse(await articleObj.text());
          // Remove content for list view to reduce size
          const { content, ...metadata } = article;
          articles.push(metadata);
        }
      }
    }

    // Sort by date (newest first)
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Cache the index
    await env.ARTICLE_BUCKET.put('index/articles.json', JSON.stringify(articles, null, 2), {
      httpMetadata: { contentType: 'application/json' },
    });

    return new Response(JSON.stringify(articles), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to list articles',
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

async function handleGetArticle(slug, env) {
  try {
    const key = `articles/${slug}.json`;
    const object = await env.ARTICLE_BUCKET.get(key);
    
    if (!object) {
      return new Response(JSON.stringify({ error: 'Article not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const article = JSON.parse(await object.text());
    
    return new Response(JSON.stringify(article), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to get article',
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

async function updateArticleIndex(env, article) {
  try {
    // Get current index
    const indexObj = await env.ARTICLE_BUCKET.get('index/articles.json');
    let articles = [];
    
    if (indexObj) {
      articles = JSON.parse(await indexObj.text());
    }

    // Remove content for index
    const { content, ...metadata } = article;
    
    // Check if article already exists in index
    const existingIndex = articles.findIndex(a => a.slug === article.slug);
    if (existingIndex !== -1) {
      articles[existingIndex] = metadata;
    } else {
      articles.push(metadata);
    }

    // Sort by date (newest first)
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Update index
    await env.ARTICLE_BUCKET.put('index/articles.json', JSON.stringify(articles, null, 2), {
      httpMetadata: { contentType: 'application/json' },
    });
  } catch (error) {
    console.error('Failed to update article index:', error);
    // Don't throw - this is non-critical
  }
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}