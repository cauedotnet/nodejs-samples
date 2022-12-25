const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');

const secretsManager = new AWS.SecretsManager();

exports.handler = async (event) => {
	
  // Get the secret key from the AWS Secrets Manager
  const secret = await secretsManager.getSecretValue({
    SecretId: 'JWT_SECRET_KEY'
  }).promise();
  
  // Extract the JWT from the request
  const token = event.headers.Authorization;
  
  // Verify the JWT and decode its payload
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return {
      statusCode: 401,
      body: 'Unauthorized'
    };
  }
  
  // Check if the decoded JWT contains the user's ID
  if (!decoded.userId) {
    return {
      statusCode: 401,
      body: 'Unauthorized'
    };
  }
  
  // If the JWT is valid and contains the user's ID,
  // check if the user is authorized to access the resource
  let authorized = false;
  const user = await getUserById(decoded.userId);
  if (user.role === 'admin') {
    authorized = true;
  } else if (event.resource === '/protected' && user.role === 'member') {
    authorized = true;
  }
  
  if (!authorized) {
    return {
      statusCode: 403,
      body: 'Forbidden'
    };
  }
  
  // If the user is authorized, proceed with the request
  return {
    statusCode: 200,
    body: 'Authenticated'
  };
};

async function getUserById(userId) {
  // Get the user's details from the database or cache
  // For simplicity, this function just returns a hard-coded user object
  return {
    id: userId,
    name: 'John Doe',
    role: 'admin'
  };
}