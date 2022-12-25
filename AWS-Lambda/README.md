Here are simple examples of using AWS Lambda for authentication, based on the solution I've made for a client with more than 2MI access per month.

In this scenario, you would have two separate AWS Lambda functions: one for creating JWT tokens and another for authenticating users using those tokens. The first function, which is responsible for creating JWT tokens, would be called whenever a user logs in to your application. It would generate a new JWT token that can be used to authenticate the user in subsequent requests.

The second function, which is responsible for authenticating users, would be called on each request that requires authentication. It would extract the JWT token from the request, verify that it is valid using the JWT secret, and then retrieve the user from the database. If the token is valid and the user exists, then the function would allow the request to continue. If the token is invalid or the user does not exist, then the function would return an error response indicating that the user authentication failed.

Together, these two functions provide a simple and secure way to authenticate users in your application using JWT tokens. You can use them as the basis for your own authentication system, or modify them to fit your specific use case.

You can find the best examples of those two lambdas on this folders:
 - Auth_CreateToken
 - Auth_ValidateToken

----

How to deploy an AWS Lambda function written in Node.js using the AWS CLI:

To deploy a Lambda function written in Node.js using the AWS CLI, you can use the aws lambda create-function command. This command takes a number of different options that you can use to specify the details of your Lambda function, such as its name, runtime, and code. For example, you could use the following command to create a Lambda function from the example code that I provided earlier:

'''
aws lambda create-function \
  --function-name "my-function" \
  --runtime "nodejs12.x" \
  --handler "index.lambdaHandler" \
  --zip-file "fileb://lambda.zip"
'''

This command creates a new Lambda function with the name "my-function" that uses the Node.js 12 runtime and the lambdaHandler function in the index.js file as its entry point. The code for the function is included in the lambda.zip file, which is located in the current directory.

You can find more detailed instructions on how to use the AWS CLI to deploy Lambda functions in the AWS documentation. You can also find more information about the different options that you can use with the create-function command, such as how to specify the memory size and timeout of your function.

----

How to use it with AWS API Gateway (Auth - Create Token):

To use this Lambda function with AWS API Gateway, you can create a new API Gateway and then create a new resource and method that triggers the Lambda function. 
Here is an example of how you can do this:

Open the AWS Management Console and navigate to the API Gateway service.

Click on "Create API" and select the "New API" option. Give your API a name and description, and then click "Create".

Click on the "Actions" dropdown menu and select "Create Resource". Give your resource a name (e.g. "auth") and click "Create Resource".

Click on the "Actions" dropdown menu again and select "Create Method". Select "POST" as the method, and then select the Lambda function that you created earlier from the "Lambda Function" dropdown. Click "Save".

Select the "Integration Request" option from the left-hand menu. In the "Body Mapping Templates" section, click on "Add mapping template" and enter application/json as the content type. This will allow the Lambda function to access the request body.

Click on the "Method Request" option from the left-hand menu. In the "Authorization" section, select "AWS_IAM" as the authorization type. This will allow the Lambda function to access the request headers, where the JWT is included.

Click on the "Deploy API" option from the left-hand menu. Select a deployment stage (e.g. "prod") and click "Deploy".

Now you can use the URL provided by the API Gateway to make requests to the Lambda function. In order to authenticate a user, you will need to include the JWT in the request headers using the Authorization key. For example:

'''
curl -X POST https://<API_ID>.execute-api.<REGION>.amazonaws.com/<STAGE>/auth \
  -H 'Authorization: Bearer <JWT>'
'''

Replace <API_ID>, <REGION>, <STAGE>, and <JWT> with the appropriate values for your API. This will make a POST request to the /auth resource on your API, which will trigger the Lambda function and authenticate the user using the JWT.

To create the token-based Lambda authorizer function, so it can be used as form of authentication for a api gateway authenticated services, please visit:

https://docs.aws.amazon.com/apigateway/latest/developerguide/configure-api-gateway-lambda-authorization-with-console.html

More information in:

https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html#api-gateway-lambda-authorizer-lambda-function-create

