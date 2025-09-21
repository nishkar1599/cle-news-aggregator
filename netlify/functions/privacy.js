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

  // Return privacy policy information
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      policy: {
        title: 'Privacy Policy',
        version: '1.0',
        lastUpdated: '2024-12-01',
        gdprCompliant: true
      },
      message: 'Privacy policy information (demo mode)'
    })
  };
};
