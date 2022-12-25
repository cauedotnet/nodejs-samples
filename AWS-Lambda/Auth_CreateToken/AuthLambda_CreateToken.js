const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');

exports.lambdaHandler = async (event) => {
  // Extract user ID and password hash from event
  const userId = event.userId;
  const passwordHash = event.passwordHash;

  // Retrieve user from DynamoDB
  const dynamodb = new AWS.DynamoDB();
  const user = await dynamodb.getItem({
    TableName: "users",
    Key: {
      "id": {
        S: userId
      }
    }
  }).promise();

  // Verify that user exists
  if (!user) {
    return {
      statusCode: 404,
      body: "User not found"
    };
  }

  // Verify password hash
  if (user.passwordHash !== passwordHash) {
    return {
      statusCode: 401,
      body: "Incorrect password"
    };
  }

  // Retrieve secret from Secret Manager
  const secretName = "jwt-secret";
  const region = "us-east-1";

  const secretsManager = new AWS.SecretsManager({ region: region });
  const secret = await secretsManager.getSecretValue({ SecretId: secretName }).promise();

  // Create JWT using user ID and claims
  const token = jwt.sign({
    userId: userId,
    role: user.role
  }, secret);

  return {
    statusCode: 200,
    body: {
      token: token
    }
  };
};