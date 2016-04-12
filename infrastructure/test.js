var test = require('tape');
var factory = require('./dynamodb-factory');
var db = factory.create();

var DELETE_PREFIX = 'integration-test-';

test('create table with food-config-factory then describe table to check status is creating', function(t) {
    t.plan(4);

    var db = factory.create();
    var foodConfigFactory = require('./food-config-factory');

    var uuid = require('node-uuid');
    var tableName = DELETE_PREFIX + uuid.v4();
    var primaryKey = 'consumer';

    var foodConfig = foodConfigFactory.create(tableName, primaryKey);

    db.createTable(foodConfig, function(err, data) {
        t.false(err, 'error doesnt occur when creating table');
        t.equal(data.TableDescription.TableStatus, 'CREATING', 'table status is creating');

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
});

test('delete integration-test tables', function(t) {
    t.plan(3);

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
                    console.log(data);
                });
            }
        }
    });

});
