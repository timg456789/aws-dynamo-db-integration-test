var test = require('tape');

test('list tables with dynamodb factory', function (t) {
    t.plan(2);

    var factory = require('./dynamodb-factory');
    var dynamoDb = factory.create();

    dynamoDb.listTables(function (err, data) {
        t.false(err, 'error doesnt occur when listing tables');
        t.ok(data.TableNames, 'data has TableNames property');
    });

});

test('create table with food-config-factory then describe table to check status is creating', function(t) {
    t.plan(4);

    var factory = require('./dynamodb-factory');
    var db = factory.create();
    var foodConfigFactory = require('./food-config-factory');

    var uuid = require('node-uuid');
    var tableName = uuid.v4();
    var primaryKey = 'consumer';

    var foodConfig = foodConfigFactory.create(tableName, primaryKey);

    db.createTable(foodConfig, function(err, data) {
        t.false(err, 'error doesnt occur when creating table');
        t.equal(data.TableDescription.TableStatus, 'CREATING', 'table status is creating');

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




//
//






//db.listTables();
//db.deleteTable();
/*db.rebuild(function () {
    console.log('waiting for table to be created');
    runWhenTableIsFound(FOOD, function() {
        console.log('inserting into table: ' + FOOD);
        //db.insert('banana');
    });
});*/