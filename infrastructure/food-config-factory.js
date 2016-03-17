exports.create = function(tableName, primaryKey) {

    var config = {
        TableName : tableName,
        KeySchema: [
            { AttributeName: primaryKey, KeyType: "HASH"},
            { AttributeName: "date", KeyType: "RANGE" }
        ],
        AttributeDefinitions: [
            { AttributeName: primaryKey, AttributeType: "S" },
            { AttributeName: "date", AttributeType: "N" }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }
    };

    return config;
}