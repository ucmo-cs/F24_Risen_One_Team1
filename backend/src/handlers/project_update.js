const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

// Create DynamoDB client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

module.exports.handler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);

        const command = new UpdateCommand({
            TableName: process.env.PROJECT_TABLE,
            Key: {
                projectId: requestBody.projectId
            },
            UpdateExpression: "set years.#yr.#mo[0].times[0] = :times",
            ExpressionAttributeNames: {
                "#yr": "2024",
                "#mo": "10"
            },
            ExpressionAttributeValues: {
                ":times": 5
            },
            ReturnValues: "ALL_NEW"
        });

        const response = await docClient.send(command);
        console.log("Response Value: ", response);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Update Successful",
                data: response.Attributes
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            }
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error', error: error.message }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            }
        };
    }
};
