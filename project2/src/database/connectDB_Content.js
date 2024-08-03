var mysql = require("mysql");

var connection = mysql.createPool({
    host: 'localhost',
    user: 'yujan',
    password: '0310',
    database: 'test'
})

connection.getConnection(function(err){
    if (err) throw err;
    console.log("connected_Content");
})

function recordContent(email,username,videoPath,platform){
    connection.getConnection(function(err,connection){
        console.log("upload Content")
        connection.query('insert into upload_content set ?',{
            email:email,
            username:username,
            platform:platform,
            videoPath1:videoPath
        },function(err,result){
            if(err){
                console.log("[error] - ",err.message);
            return;
            }
        })
    })
}
module.exports = {
    recordContent
}