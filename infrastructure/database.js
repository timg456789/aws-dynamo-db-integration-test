this.init = function (res) {

    var AWS = require('aws-sdk');
    var config = {
        region: 'us-east-1'//,
        //endpoint: 'http://localhost:8000'
    };
    var dynamodb = new AWS.DynamoDB(config);
    var docClient = new AWS.DynamoDB.DocumentClient(config);
    var FOOD = 'Food';
    var PK = 'consumer';

    var FOOD_CONFIG = {
        TableName : FOOD,
        KeySchema: [
            { AttributeName: PK, KeyType: "HASH"},
            { AttributeName: "date", KeyType: "RANGE" }
        ],
        AttributeDefinitions: [
            { AttributeName: PK, AttributeType: "S" },
            { AttributeName: "date", AttributeType: "N" }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }
    };

    function deployComplete() {
        res.status(200);
        res.render('deploy', { title: 'Deploy Resources' } );
    }

    function createFoodModel(name) {
        return {
            TableName: FOOD,
            Item: {
                'consumer': 'timothy-s-gonzalez',
                'date': new Date().getTime(),
                "food": name
            }
        };
    }

    function buildQuery() {
        var query = {
            TableName : FOOD,
            KeyConditionExpression: "#cc = :cf",
            ExpressionAttributeNames:{
                "#cc": PK
            },
            ExpressionAttributeValues: {
                ":cf": 'timothy-s-gonzalez'
            }
        };

        return query;
    }

    this.insert = function (foodName) {
        var food = createFoodModel(foodName);

        console.log(food);

        docClient.put(food, function(err, data) {
            if (err) {
                console.log('Fail inserting: ' + err);
            } else {
                docClient.query(buildQuery(), function(err, data) {
                    if (err) {
                        console.log('Fail querying' + JSON.stringify(err));
                    } else {
                        console.log(data);
                    }
                })


            }
        });
    }

    function create(onCreate) {
        dynamodb.createTable(FOOD_CONFIG, function(err, data) {
            if (err) {
                console.log('Error creating table: ' + JSON.stringify(err));
            } else {
                console.log('creating table: ' + FOOD);
                var status = data.TableDescription.TableStatus;
                console.log('current status: ' + status);
                onCreate();
            }
        });
    }

    function deleteTable(onDelete) {

        var params = {
            TableName: FOOD
        };

        dynamodb.deleteTable(params, function(err, data) {
            if (err) {
                console.log('Error deleting table: ' + JSON.stringify(err));
            } else {
                console.log('deleting table: ' + FOOD);
                console.log('current status: ' + data.TableDescription.TableStatus);
                //onDelete();
            }
        });
    }

    function runWhenTableIsFound(tableName, task) {

        console.log('checking if table exists: ' + tableName);

        dynamodb.listTables(function(err, data) {

            console.log(data);

            if (err) {
                console.log("Error listing tables: " + JSON.stringify(err));
            } else {
                var foodTableExists = data.TableNames.indexOf(tableName) > -1;
                if (foodTableExists) {
                    console.log('table found: ' + tableName);
                    task();
                } else {
                    console.log('table not found: ' + tableName);
                    runWhenTableIsFound(tableName, task);
                }
            }
        });

    }

    this.listTables = function () {
        dynamodb.listTables(function(err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log(data);
            }
        });
    }

    this.rebuild = function () {

        dynamodb.listTables(function(err, data) {
            if (err) {
                console.log("Error listing tables: " + JSON.stringify(err));
            } else {
                var foodTableExists = data.TableNames.indexOf(FOOD) > -1;
                if (foodTableExists) {
                    console.log('food table found');
                    deleteTable(function() {
                        create();
                    });
                } else {
                    console.log('table not found: ' + FOOD);
                    create(function () {
                        console.log('waiting for table to be created');
                        runWhenTableIsFound(FOOD, function() {
                            console.log('inserting into table: ' + FOOD);
                            //insert();
                        })
                    });
                }
            }
        });

    }

}