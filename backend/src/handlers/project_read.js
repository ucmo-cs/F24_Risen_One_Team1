// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");
// Create DynamoDB document client
const docClient = new AWS.DynamoDB.DocumentClient();

const params = {
    TableName: process.env.PROJECT_TABLE,
    Key: {
        projectId: docClient.get(),
        projectName: docClient.get()
    },
};

docClient.get(params, function (err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data.Item);
    }
});

