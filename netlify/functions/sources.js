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

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
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
    })
  };
};
