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

  // For demo purposes, return success for consent operations
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      message: 'Consent preferences saved (demo mode)',
      timestamp: new Date().toISOString()
    })
  };
};
