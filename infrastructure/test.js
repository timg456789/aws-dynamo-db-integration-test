var db = require('./database');
db.init();
//db.rebuild();

db.listTables();
db.insert('banana');