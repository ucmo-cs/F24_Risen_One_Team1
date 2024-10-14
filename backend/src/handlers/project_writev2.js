'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    const requestBody = JSON.parse(event.body);

    const params = {
        TableName: process.env.PROJECT_TABLE,
        Key: {
            projectID: requestBody.projectID,
            projectName: requestBody.projectName,
        }
    };


    try {
        const data = await dynamoDb.put(params);

        if (!data.Item) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Writing Error' }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true
                }
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Writing successful' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            }
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            }
        };
    }
};