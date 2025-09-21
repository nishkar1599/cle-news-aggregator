const express = require('express');
const axios = require('axios');
const Parser = require('rss-parser');
const cheerio = require('cheerio');

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

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { category = 'general', limit = 20, source } = event.queryStringParameters || {};

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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        articles: limitedArticles,
        total: limitedArticles.length,
        sources: sourcesToUse.map(s => s.name),
        timestamp: new Date().toISOString(),
        compliance: {
          gdpr: true,
          dataProcessing: 'Minimal data collection for service provision',
          retention: 'No personal data stored'
        }
      })
    };

  } catch (error) {
    console.error('Error fetching news:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch news',
        message: 'Please try again later'
      })
    };
  }
};
