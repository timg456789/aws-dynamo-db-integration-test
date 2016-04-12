var test = require('tape');
var factory = require('./dynamodb-factory');
var db = factory.create();
var DELETE_PREFIX = 'integration-test-';
var uuid = require('node-uuid');
var tableName = DELETE_PREFIX + uuid.v4();

test('create table with food-config-factory', function(t) {
    t.plan(2);

    var foodConfigFactory = require('./food-config-factory');
    var foodConfig = foodConfigFactory.create(tableName, 'user');

    db.createTable(foodConfig, function(err, data) {
        t.false(err, 'error doesnt occur when creating table');
        t.equal(data.TableDescription.TableStatus, 'CREATING', 'table status is creating');
    });
});

test('table status changes from creating to active', function(t) {
    t.plan(2);

    var describeParams = {};
    describeParams.TableName = tableName;

    var tableCreationWait = require('./table-creation-wait');
    var desiredStatus = 'ACTIVE';

    tableCreationWait.runWhenTableIs(tableName, desiredStatus, db, function() {
        db.describeTable(describeParams, function (err, data) {
            t.false(err, 'error doesnt occur when describing table after waiting for creation');
            t.equal(data.Table.TableStatus, desiredStatus, 'table status is ' + desiredStatus + ' after creating');
        });
    });
});

test('insert test data', function (t) {
    t.plan(2);

    var data = {
        TableName: tableName,
        Item: {
            user: "oh-yea",
            time: new Date().getTime(),
            //name
            //amount: 1388
        }
    };

    var AWS = require('aws-sdk');
    var config = {
        region: 'us-east-1'
    };
    var docDb = new AWS.DynamoDB.DocumentClient(config);
    docDb.put(data, function(err, data) {
        t.ok(!err, err);
        t.ok(data);
    });


});

test('delete integration-test tables', function(t) {
    t.plan(4);

    db.listTables(function (err, data) {
        t.false(err, 'error doesnt occur when listing tables');
        t.ok(data.TableNames, 'data has TableNames property');

        for (var i = 0; i < data.TableNames.length; i++) {
            var name = data.TableNames[i];
            if (name.startsWith(DELETE_PREFIX)) {
                console.log('deleting table: ' + name);
                var deleteTestTable = { TableName: name };
                db.deleteTable(deleteTestTable, function(err, data) {
                    t.ok(!err, err);
                    t.equal(data.TableDescription.TableStatus, 'DELETING', 'integration-test table is deleting');
                });
            }
        }
    });

});
