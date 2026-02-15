// article-worker.js

// FALLBACK Configuration
const CONFIG = {
  MAX_ARTICLE_SIZE: 1024 * 1024, // 1MB default
  RATE_LIMIT_WINDOW_MS: 60 * 1000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 10, // requests per window per IP
};

// Rate limiter
const rateLimits = new Map();

function checkRateLimit(ip, env) {
  const now = Date.now();
  const windowMs = CONFIG.RATE_LIMIT_WINDOW_MS;
  const maxRequests = CONFIG.RATE_LIMIT_MAX_REQUESTS;
  
  // Clean up old entries
  if (!rateLimits.has('cleanup') || now - rateLimits.get('cleanup') > 60000) {
    for (const [key, timestamps] of rateLimits.entries()) {
      if (key === 'cleanup') continue; // Skip the cleanup marker
      const validTimestamps = timestamps.filter(t => now - t < windowMs);
      if (validTimestamps.length === 0) {
        rateLimits.delete(key);
      } else {
        rateLimits.set(key, validTimestamps);
      }
    }
    rateLimits.set('cleanup', now);
  }
  
  const requests = rateLimits.get(ip) || [];
  const recentRequests = requests.filter(t => now - t < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimits.set(ip, recentRequests);
  return true;
}

function validateApiKey(request, env) {
  const apiKey = request.headers.get('X-API-Key');
  const validApiKey = env.API_KEY;
  
  // Skip API key check if not configured (useful for development)
  if (!validApiKey) {
    console.warn('API_KEY not set in environment - skipping authentication');
    return true;
  }
  
  return apiKey && apiKey === validApiKey;
}

export default {
  async fetch(request, env) {
    // Update config with environment variables if available
    if (env.MAX_ARTICLE_SIZE) {
      CONFIG.MAX_ARTICLE_SIZE = parseInt(env.MAX_ARTICLE_SIZE);
    }
    if (env.RATE_LIMIT_MAX_REQUESTS) {
      CONFIG.RATE_LIMIT_MAX_REQUESTS = parseInt(env.RATE_LIMIT_MAX_REQUESTS);
    }
    if (env.RATE_LIMIT_WINDOW_MS) {
      CONFIG.RATE_LIMIT_WINDOW_MS = parseInt(env.RATE_LIMIT_WINDOW_MS);
    }
    
    // Get client IP from Cloudflare header
    const clientIP = request.headers.get('CF-Connecting-IP') || 
                     request.headers.get('X-Forwarded-For') || 
                     'unknown';
    
    // Apply rate limiting to all requests
    if (!checkRateLimit(clientIP, env)) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded. Please try again later.' 
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Retry-After': '60',
        },
      });
    }
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // POST /api/articles - Submit new article (requires authentication)
    if (request.method === 'POST' && path === '/api/articles') {
      // Check API key for article submissions
      if (!validateApiKey(request, env)) {
        return new Response(JSON.stringify({ 
          error: 'Unauthorized - Invalid or missing API key' 
        }), {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
      
      return handleArticleSubmission(request, env);
    }
    
    // Admin endpoints (require API key)
    if (path.startsWith('/api/admin/') && !validateApiKey(request, env)) {
      return new Response(JSON.stringify({ 
        error: 'Unauthorized - Admin access requires valid API key' 
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // GET /api/admin/pending - List pending articles
    if (request.method === 'GET' && path === '/api/admin/pending') {
      return handleListPendingArticles(env);
    }

    // PUT /api/admin/approve/:slug - Approve an article
    if (request.method === 'PUT' && path.startsWith('/api/admin/approve/')) {
      const slug = path.replace('/api/admin/approve/', '');
      return handleApproveArticle(slug, env);
    }

    // DELETE /api/admin/reject/:slug - Reject an article
    if (request.method === 'DELETE' && path.startsWith('/api/admin/reject/')) {
      const slug = path.replace('/api/admin/reject/', '');
      return handleRejectArticle(slug, env);
    }
    
    // GET endpoints - no authentication required
    if (request.method === 'GET' && path === '/api/articles') {
      return handleListArticles(env);
    }
    
    if (request.method === 'GET' && path.startsWith('/api/articles/')) {
      const slug = path.replace('/api/articles/', '');
      return handleGetArticle(slug, env);
    }

    return new Response('Not found', { status: 404 });
  },
};

async function handleArticleSubmission(request, env) {
  try {
    // Check content length header first
    const contentLength = request.headers.get('Content-Length');
    if (contentLength && parseInt(contentLength) > CONFIG.MAX_ARTICLE_SIZE) {
      return new Response(JSON.stringify({ 
        error: `Article too large. Maximum size is ${CONFIG.MAX_ARTICLE_SIZE / 1024 / 1024}MB` 
      }), {
        status: 413, // Payload Too Large
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    const articleData = await request.json();
    
    // Additional size check for the parsed JSON
    const articleSize = new TextEncoder().encode(JSON.stringify(articleData)).length;
    if (articleSize > CONFIG.MAX_ARTICLE_SIZE) {
      return new Response(JSON.stringify({ 
        error: `Article too large. Maximum size is ${CONFIG.MAX_ARTICLE_SIZE / 1024 / 1024}MB` 
      }), {
        status: 413,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    // Validate required fields
    const requiredFields = ['title', 'subtitle', 'content', 'author', 'category', 'date'];
    for (const field of requiredFields) {
      if (!articleData[field]) {
        return new Response(JSON.stringify({ 
          error: `Missing required field: ${field}` 
        }), {
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
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
      status: 'pending', // Add status for moderation
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in R2 (use pending folder for unapproved articles)
    const key = `articles/pending/${slug}.json`;
    await env.ARTICLE_BUCKET.put(key, JSON.stringify(article, null, 2), {
      httpMetadata: { contentType: 'application/json' },
      customMetadata: {
        title: article.title,
        author: article.author,
        category: article.category,
        date: article.date,
        status: article.status,
        createdAt: article.createdAt,
      },
    });

    return new Response(JSON.stringify({ 
      success: true, 
      slug,
      status: 'pending',
      message: 'Article submitted successfully and is pending review' 
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

async function handleListPendingArticles(env) {
  try {
    const articles = [];
    const listed = await env.ARTICLE_BUCKET.list({ prefix: 'articles/pending/' });
    
    for (const object of listed.objects) {
      if (object.key.endsWith('.json')) {
        const articleObj = await env.ARTICLE_BUCKET.get(object.key);
        if (articleObj) {
          const article = JSON.parse(await articleObj.text());
          articles.push(article);
        }
      }
    }

    // Sort by date (newest first)
    articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return new Response(JSON.stringify(articles), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to list pending articles',
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

async function handleApproveArticle(slug, env) {
  try {
    // Get the pending article
    const pendingKey = `articles/pending/${slug}.json`;
    const pendingObj = await env.ARTICLE_BUCKET.get(pendingKey);
    
    if (!pendingObj) {
      return new Response(JSON.stringify({ error: 'Pending article not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const article = JSON.parse(await pendingObj.text());
    
    // Update status
    article.status = 'live';
    article.approvedAt = new Date().toISOString();
    
    // Store in live folder
    const liveKey = `articles/live/${slug}.json`;
    await env.ARTICLE_BUCKET.put(liveKey, JSON.stringify(article, null, 2), {
      httpMetadata: { contentType: 'application/json' },
      customMetadata: {
        title: article.title,
        author: article.author,
        category: article.category,
        date: article.date,
        status: 'live',
        approvedAt: article.approvedAt,
      },
    });

    // Delete from pending folder
    await env.ARTICLE_BUCKET.delete(pendingKey);

    // Update live index
    await updateLiveArticleIndex(env, article);

    // Update full index
    await updateArticleIndex(env, article);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Article approved successfully' 
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to approve article',
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

async function handleRejectArticle(slug, env) {
  try {
    const pendingKey = `articles/pending/${slug}.json`;
    
    // Check if article exists
    const pendingObj = await env.ARTICLE_BUCKET.get(pendingKey);
    
    if (!pendingObj) {
      return new Response(JSON.stringify({ error: 'Pending article not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Delete from pending folder
    await env.ARTICLE_BUCKET.delete(pendingKey);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Article rejected and removed' 
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to reject article',
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
    console.log("Building articles list from live folder");
    
    // Always build articles list from live folder to ensure freshness
    const articles = [];
    const listed = await env.ARTICLE_BUCKET.list({ prefix: 'articles/live/' });
    
    console.log(`Found ${listed.objects.length} objects in live folder`);
    
    for (const object of listed.objects) {
      console.log(`Processing object: ${object.key}`);
      
      if (object.key.endsWith('.json')) {
        const articleObj = await env.ARTICLE_BUCKET.get(object.key);
        if (articleObj) {
          const article = JSON.parse(await articleObj.text());
          console.log(`Loaded article: ${article.title}`);
          
          // Remove content for index
          const { content, ...metadata } = article;
          articles.push(metadata);
        }
      }
    }

    console.log(`Built articles list with ${articles.length} articles`);

    // Sort by date (newest first)
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Cache the live index
    await env.ARTICLE_BUCKET.put('index/live-articles.json', JSON.stringify(articles, null, 2), {
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
    console.error('Failed to list articles:', error);
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
    // Only serve approved articles
    const key = `articles/live/${slug}.json`;
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
        'Cache-Control': 'public, max-age=3600',
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

async function updateLiveArticleIndex(env, article) {
  try {
    // Get current live index
    const indexObj = await env.ARTICLE_BUCKET.get('index/live-articles.json');
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
    await env.ARTICLE_BUCKET.put('index/live-articles.json', JSON.stringify(articles, null, 2), {
      httpMetadata: { contentType: 'application/json' },
    });
  } catch (error) {
    console.error('Failed to update live article index:', error);
  }
}

async function updateArticleIndex(env, article) {
  try {
    // Get current full index
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