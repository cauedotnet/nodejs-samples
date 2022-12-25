const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  // Extract the JWT from the request
  const token = event.headers.Authorization;
  
  // Verify the JWT and decode its payload
  const decoded = jwt.verify(token, 'SECRET_KEY');
  
  // Check if the decoded JWT contains the user's ID
  if (!decoded.userId) {
    return {
      statusCode: 401,
      body: 'Unauthorized'
    };
  }
  
  // If the JWT is valid and contains the user's ID,
  // proceed with the request
  return {
    statusCode: 200,
    body: 'Authenticated'
  };
};