exports.create = function () {

    var AWS = require('aws-sdk');

    var config = {
        region: 'us-east-1'
    };

    var dynamodb = new AWS.DynamoDB(config);

    return dynamodb;
}
