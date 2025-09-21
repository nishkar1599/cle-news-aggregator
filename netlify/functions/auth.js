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

  // For demo purposes, return success for registration
  if (event.httpMethod === 'POST' && event.path.includes('register')) {
    const body = JSON.parse(event.body || '{}');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Registration successful (demo mode)',
        userId: 'demo-user-' + Date.now()
      })
    };
  }

  // For other auth endpoints, return not implemented
  return {
    statusCode: 501,
    headers,
    body: JSON.stringify({
      error: 'Authentication endpoints not implemented in demo',
      message: 'This is a demo deployment. Full authentication will be available in production.'
    })
  };
};
