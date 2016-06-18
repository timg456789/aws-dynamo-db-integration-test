exports.runWhenTableIs = function (tableName, desiredStatus, db, callback) {

    var describeParams = {};
    describeParams.TableName = tableName;

    db.describeTable(describeParams, function (err, data) {
        if (err) {
            throw err;
        } else if (data.Table.TableStatus === desiredStatus) {
            callback();
        } else{
            var waitTimeMs = 1000;
            setTimeout(function () {
                console.log('table status is ' + data.Table.TableStatus);
                console.log('waiting ' + waitTimeMs + 'ms for table status to be ' + desiredStatus);
                exports.runWhenTableIs(tableName, desiredStatus, db, callback);
            }, waitTimeMs);

        }
    });

}

function tableExists(searchName, tableNames) {
    var exists = false;
    for (var i = 0; i < tableNames.length; i++) {
        if (searchName === tableNames[i]) {
            exists = true;
            break;
        }
    }
    return exists;
}

exports.runWhenTableIsNotFound = function (tableName, db, callback) {
    db.listTables(function (err, data) {
        if (err) {
            throw err;
        } else {
            if (!tableExists(tableName, data.TableNames)) {
                callback();
            } else {
                var waitTimeMs = 1000;
                setTimeout(function () {
                    console.log('table found');
                    console.log('waiting ' + waitTimeMs + 'ms for table to not be found.');
                    exports.runWhenTableIsNotFound(tableName, db, callback);
                }, waitTimeMs);
            }
        }
    });
}