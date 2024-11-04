// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");
// Create DynamoDB document client
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    const params = new AWS.DynamoDB.BatchGetCommand({
        RequestItems: {
            projects: {
                ProjectionExpression: "projectId, projectName"
            }
        }
    });



    try{
        const data = await dynamoDB.send(params).promise();
        console.log("Retrieved Data", data.projects);
        return{
            statusCode: 200,
            body: JSON.stringify({message: "Reading Successful", data: data.projects}),
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

