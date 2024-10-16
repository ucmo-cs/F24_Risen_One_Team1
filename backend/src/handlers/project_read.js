// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");
// Create DynamoDB document client
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    const requestBody = JSON.parse(event.body);
    const params = {
        TableName: process.env.PROJECT_TABLE,
        Key: {
            projectId: requestBody.projectId,
            projectName: requestBody.projectName
        },
    };

    docClient.get(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.Item);
        }
    });
};

