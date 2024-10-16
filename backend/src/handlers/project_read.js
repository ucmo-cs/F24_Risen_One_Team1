// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");
// Create DynamoDB document client
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    const requestBody = JSON.parse(event.body);
    const params = {
        TableName: process.env.PROJECT_TABLE,
        Key: {
            projectId: requestBody.projectId
        },
    };

    try{
        await dynamoDB.get().promise();
        return{
            statusCode: 200,
            console: log("Success", data.Item),
            body: JSON.stringify({message: "Reading Successful"}),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            }
        };
    }
    catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'}),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            }
        }
    }
};

