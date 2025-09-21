const express = require('express');
const axios = require('axios');
const Parser = require('rss-parser');
const cheerio = require('cheerio');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// RSS Parser instance
const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'UK-Compliant-News-Aggregator/1.0 (GDPR Compliant)'
  }
});

// News sources configuration (UK-focused, reputable sources)
const newsSources = [
  {
    name: 'BBC News',
    url: 'http://feeds.bbci.co.uk/news/rss.xml',
    category: 'general',
    trusted: true
  },
  {
    name: 'The Guardian',
    url: 'https://www.theguardian.com/uk/rss',
    category: 'general',
    trusted: true
  },
  {
    name: 'Sky News',
    url: 'http://feeds.skynews.com/feeds/rss/uk.xml',
    category: 'general',
    trusted: true
  },
  {
    name: 'Financial Times',
    url: 'https://www.ft.com/rss/home/uk',
    category: 'business',
    trusted: true
  },
  {
    name: 'Reuters UK',
    url: 'https://feeds.reuters.com/reuters/UKdomesticNews',
    category: 'general',
    trusted: true
  }
];

// Validation middleware
const validateNewsRequest = [
  body('category').optional().isIn(['general', 'business', 'technology', 'sports', 'politics']),
  body('limit').optional().isInt({ min: 1, max: 100 }),
  body('source').optional().isString().trim().escape()
];

// Get news from multiple sources
router.get('/', validateNewsRequest, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Invalid request parameters',
        details: errors.array()
      });
    }

    const { category = 'general', limit = 20, source } = req.query;
    
    // Filter sources based on category and source preference
    let sourcesToUse = newsSources;
    if (category !== 'general') {
      sourcesToUse = newsSources.filter(s => s.category === category);
    }
    if (source) {
      sourcesToUse = sourcesToUse.filter(s => s.name.toLowerCase().includes(source.toLowerCase()));
    }

    const allArticles = [];
    const promises = sourcesToUse.map(async (source) => {
      try {
        const feed = await parser.parseURL(source.url);
        const articles = await Promise.all(feed.items.slice(0, 5).map(async (item) => {
          // Extract image from RSS item
          let imageUrl = null;
          
          // Try multiple methods to find images
          if (item.enclosure && item.enclosure.type && item.enclosure.type.startsWith('image/')) {
            imageUrl = item.enclosure.url;
          } else if (item.content) {
            // Try to extract image from content using regex
            const imgMatch = item.content.match(/<img[^>]+src="([^"]+)"/i);
            if (imgMatch) {
              imageUrl = imgMatch[1];
            }
          } else if (item.contentSnippet) {
            // Try to extract image from contentSnippet
            const imgMatch = item.contentSnippet.match(/<img[^>]+src="([^"]+)"/i);
            if (imgMatch) {
              imageUrl = imgMatch[1];
            }
          }
          
          // If no image found in RSS, try to fetch from the article page
          if (!imageUrl && item.link) {
            try {
              const response = await axios.get(item.link, {
                timeout: 5000,
                headers: {
                  'User-Agent': 'UK-Compliant-News-Aggregator/1.0 (GDPR Compliant)'
                }
              });
              
              const $ = cheerio.load(response.data);
              
              // Try multiple selectors for images
              const imgSelectors = [
                'meta[property="og:image"]',
                'meta[name="twitter:image"]',
                'img[class*="hero"]',
                'img[class*="featured"]',
                'img[class*="main"]',
                'img[class*="article"]',
                'img[class*="story"]',
                '.article img',
                '.story img',
                '.content img',
                'article img'
              ];
              
              for (const selector of imgSelectors) {
                const img = $(selector).first();
                if (img.length) {
                  const src = img.attr('content') || img.attr('src');
                  if (src && src.startsWith('http')) {
                    imageUrl = src;
                    break;
                  }
                }
              }
            } catch (error) {
              console.log(`Could not fetch image for ${item.title}: ${error.message}`);
            }
          }

          return {
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            description: item.contentSnippet || item.content,
            image: imageUrl,
            source: source.name,
            category: source.category,
            trusted: source.trusted
          };
        }));
        return articles;
      } catch (error) {
        console.error(`Error fetching from ${source.name}:`, error.message);
        return [];
      }
    });

    const results = await Promise.all(promises);
    results.forEach(articles => allArticles.push(...articles));

    // Sort by publication date (newest first)
    allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    // Apply limit
    const limitedArticles = allArticles.slice(0, parseInt(limit));

    // GDPR compliance: Log data processing
    console.log(`News request processed: ${limitedArticles.length} articles, category: ${category}, IP: ${req.ip}`);

    res.json({
      articles: limitedArticles,
      total: limitedArticles.length,
      sources: sourcesToUse.map(s => s.name),
      timestamp: new Date().toISOString(),
      compliance: {
        gdpr: true,
        dataProcessing: 'Minimal data collection for service provision',
        retention: 'No personal data stored'
      }
    });

  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ 
      error: 'Failed to fetch news',
      message: 'Please try again later'
    });
  }
});

// Get specific article content (with proper attribution)
router.get('/article', [
  body('url').isURL().withMessage('Valid URL required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Invalid URL provided',
        details: errors.array()
      });
    }

    const { url } = req.query;
    
    // Verify URL is from trusted sources
    const isTrustedSource = newsSources.some(source => 
      url.includes(new URL(source.url).hostname)
    );

    if (!isTrustedSource) {
      return res.status(403).json({ 
        error: 'Content from untrusted sources not allowed',
        message: 'Only content from verified news sources is accessible'
      });
    }

    // Fetch article content
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'UK-Compliant-News-Aggregator/1.0 (GDPR Compliant)'
      }
    });

    const $ = cheerio.load(response.data);
    
    // Extract article content with proper attribution
    const article = {
      title: $('h1').first().text().trim(),
      content: $('article, .article-content, .story-body').text().trim(),
      author: $('.byline, .author').text().trim(),
      publishedDate: $('time, .date').attr('datetime') || $('time, .date').text().trim(),
      source: url,
      attribution: {
        originalUrl: url,
        accessedAt: new Date().toISOString(),
        aggregator: 'UK-Compliant-News-Aggregator'
      }
    };

    res.json(article);

  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ 
      error: 'Failed to fetch article content',
      message: 'Please try again later'
    });
  }
});

// Get available news sources
router.get('/sources', (req, res) => {
  res.json({
    sources: newsSources.map(source => ({
      name: source.name,
      category: source.category,
      trusted: source.trusted
    })),
    total: newsSources.length,
    compliance: {
      gdpr: true,
      dataProtection: 'Sources verified for content quality and reliability'
    }
  });
});

// Test endpoint to check image extraction
router.get('/test-images', async (req, res) => {
  try {
    const source = newsSources[0]; // Test with first source
    const feed = await parser.parseURL(source.url);
    const testItem = feed.items[0];
    
    console.log('Test item structure:', {
      title: testItem.title,
      hasEnclosure: !!testItem.enclosure,
      hasContent: !!testItem.content,
      hasContentSnippet: !!testItem.contentSnippet,
      enclosure: testItem.enclosure,
      content: testItem.content ? testItem.content.substring(0, 200) + '...' : null
    });
    
    res.json({
      item: {
        title: testItem.title,
        link: testItem.link,
        hasEnclosure: !!testItem.enclosure,
        hasContent: !!testItem.content,
        hasContentSnippet: !!testItem.contentSnippet,
        enclosure: testItem.enclosure,
        contentPreview: testItem.content ? testItem.content.substring(0, 200) + '...' : null
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
