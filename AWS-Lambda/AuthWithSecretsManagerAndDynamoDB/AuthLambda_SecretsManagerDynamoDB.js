const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');

exports.lambdaHandler = async (event) => {
  // Extract JWT token from Authorization header
  const token = event.headers.Authorization;

  // Verify JWT using Secret Manager
  const secretName = "jwt-secret";
  const region = "us-east-1";

  const secretsManager = new AWS.SecretsManager({ region: region });
  const secret = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
  jwt.verify(token, secret);

  // Retrieve user from DynamoDB
  const dynamodb = new AWS.DynamoDB();
  const user = await dynamodb.getItem({
    TableName: "users",
    Key: {
      "id": {
        S: token.user_id
      }
    }
  }).promise();

  // Return friendly response indicating whether user is authenticated or not
  if (user) {
    return {
      statusCode: 200,
      body: "User authenticated successfully"
    };
  } else {
    return {
      statusCode: 401,
      body: "User authentication failed"
    };
  }
};