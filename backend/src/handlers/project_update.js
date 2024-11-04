// Load the AWS SDK for Node.js
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

// Create DynamoDB client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

module.exports.handler = async (event) => {
    const requestBody = JSON.parse(event.body);

    const command = new UpdateCommand({
        TableName: process.env.PROJECT_TABLE,
        Key: {
            projectId: requestBody.projectId
        },
        UpdateExpression: "set years.#yr.#mo[0].time[0] = :time",
        ExpressionAttributeNames: {
            "#yr": "2024",
            "#mo": "10"
        },
        ExpressionAttributeValues: {
            ":time": 4
        },
        ReturnValues: "ALL_NEW"
    });

    const response = await docClient.send(command);
    console.log(response);
    return response;
};
