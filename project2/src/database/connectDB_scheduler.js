const jwt = require("jsonwebtoken");
var mysql = require("mysql");
const config  =require("../config.json")

var connection = mysql.createPool({
    host: 'localhost',
    user: 'yujan',
    password: '0310',
    database: 'test'
})

connection.getConnection(function(err){
    if (err) throw err;
    console.log("connected_scheduler");
})


function createpost(email,videopath,youtube,facebook,instagram,insTagname,fb_watcher,fb_somefriend,yt_watcher,content,datentime,callback){
    connection.getConnection(function(err,connection){
        console.log("creatpost")
        connection.query('insert into scheduler set ?',{
            email: email,
            videopath:videopath,
            youtube:youtube,
            facebook:facebook,
            instagram:instagram,
            insTagname:insTagname,
            fb_watcher:fb_watcher,
            fb_somefriend:fb_somefriend,
            yt_watcher:yt_watcher,
            content:content,
            datentime:datentime
        },function(err,fields){
            if (err) throw err;
        });
    })
}

function add_calender(email,title,start,extendedProps){
    connection.getConnection(function(err,connection){
        console.log('add calender')
        connection.query('insert into calender set ?',{
            email: email,
            title:title,
            start:start,
            extendedProps:extendedProps
        },function(err,fields){
            if(err) throw err;
        })
    })
}

function allevents(email,callback){
    connection.getConnection(function(err,connection){
        console.log("posting")
        connection.query('select * from calender where email = ?',[email],function(err,result){
            if (err) {
                console.log('allevents-err:',err)
            }
            callback(null,result)
        })
    })
}

module.exports = {
    allevents,
    createpost,
    add_calender
}