var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345",
    database: "testdatabase"
});

con.connect(function(err){
    if(err) throw err;

    console.log("connected!");
});