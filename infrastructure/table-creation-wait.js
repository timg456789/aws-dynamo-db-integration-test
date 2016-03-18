exports.runWhenTableIs = function (tableName, desiredStatus, db, callback) {

    var describeParams = {};
    describeParams.TableName = tableName;

    db.describeTable(describeParams, function (err, data) {
        if (err) {
            console.log(err);
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