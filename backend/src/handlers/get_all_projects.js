// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");
// Create DynamoDB document client
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    const params = {
        TableName: process.env.PROJECT_TABLE,
        ProjectionExpression: 'projectId, projectName, employees'
    };

    try{
        const data = await dynamoDB.scan(params).promise();
        const projects = data.Items.map(item => ({
            projectId: item.projectId,
            projectName: item.projectName,
            employees: item.employees
        }));

        return{
            statusCode: 200,
            body: JSON.stringify({message: "Reading Successful",
                data: projects}),
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

