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
    console.log("connected_Account");
})

function createAccount(username,email,password){
    connection.getConnection(function(err,connection){
        console.log("creat")
        connection.query('insert into account set ?',{
        email: email,
        password: password
        },function(err,fields){
            if (err) throw err;
        });
    })
}

function checkLogin(mail,pass,callback){
  console.log(mail,pass)
  connection.getConnection(function(err,connection){
    console.log("login")
    connection.query('select * from account where email = ? AND password = ?',[mail,pass],function(err,result){
      if(err){
        console.log("[error] - ",err.message);
        return;
      }
      if(result==''){          
        console.log("帳密錯誤");
      }
      else{
        console.log(result)
        console.log("checkLogin success");
        const email = result[0].email;
        callback(null,email)
      }
    })
  })
}

// 取得username
function get_username(email,callback){
  connection.getConnection(function(err,connection){
    console.log(email)
    connection.query('select * from account where email = ?',[email],function(err,result){
      if(err){
        console.log("[error] - ",err.message);
        return;
      }
      if(result==''){
        console.log('帳號不存在')
      }
      else{
        console.log(result)
        const username = result[0].username
        callback(null,username);
      }
    })
  })
}


//增加臉書帳號
function add_fb_account(fb_mail,fb_password,email,callback){
  connection.getConnection(function(err,connection){
    connection.query('update account set fb_mail = ?, fb_password = AES_ENCRYPT(?, ?) where email = ?',[fb_mail,fb_password,config['aes_encrypt'],email],function(err,fields,result){
      if(err) {
        console.log("[error] - ",err.message);
        return;
      }
      console.log("add fb account in database success")
    })
  })
}

//增加ins帳號
function add_fb_account(ins_id,ins_password,email,callback){
  connection.getConnection(function(err,connection){
    connection.query('update account set ins_id = ?, ins_password = AES_ENCRYPT(?, ?) where email = ?',[ins_id,ins_password,config['aes_encrypt'],email],function(err,fields,result){
      if(err) {
        console.log("[error] - ",err.message);
        return;
      }
      console.log("add ins account in database success")
    })
  })
}

function get_ins_info(email,callback){
  console.log(email)
  connection.getConnection(function(err,connection){
    connection.query('select * from account where email = ?',[email],function(err,result){
      if(err){
        console.log("get_information[error] - ",err.message);
        return;
      }
      if(result==''){
        console.log('帳號不存在')
      }
      else{
        const ins_id = result[0].ins_id
        connection.query('SELECT AES_DECRYPT(ins_password, ? ) AS decrydata FROM account where ins_id = ?',[config['aes_encrypt'],result[0].ins_id],function(err,result){
          const ins_password = result[0].decrydata.toString();
          callback(null,ins_id,ins_password);
        })
        
      }
    })
  })
}

function get_fb_info(email,callback){
  connection.getConnection(function(err,connection){
    connection.query('select * from account where email = ?',[email],function(err,result){
      if(err){
        console.log("get_information[error] - ",err.message);
        return;
      }
      if(result==''){
        console.log('帳號不存在')
      }
      else{
        console.log(result)
        const fb_mail = result[0].fb_mail
        connection.query('SELECT AES_DECRYPT(ins_password, ? ) AS decrydata FROM account where ins_id = ?',[config['aes_encrypt'],result[0].ins_id],function(err,result){
          const fb_password = result[0].decrydata.toString();
          callback(null,fb_mail,fb_password);
        })
      }
    })
  })
}
//確定連接些平台
function get_platform(mail,callback){
  connection.getConnection(function(err,connection){
    var fb = false;
    var ins = false
    connection.query('select * from account where email = ?',[mail],function(err,result){
      if(err){
        console.log("get_information[error] - ",err.message);
        return;
      }
      if(result==''){
        console.log('帳號不存在')
      }
      else{
        console.log(result)
        if(result[0].fb_mail){
          fb = true;
        }
        if(result[0].ins_id){
          ins = true;
        }
        if(result[0].yt_token){
          yt = true;
        }
        console.log(fb,ins,yt)
        callback(null,fb,ins,yt);
      }
    })
  })
}
function store_yttoken(email,token){
  console.log(email)
  connection.getConnection(function(err,connection){
    connection.query('update account set yt_token = ? where email = ?',[token,email],function(err,result){
      if(err){
        console.log("[error] - ",err.message);
        return;
      }
      console.log(result)
      console.log('access token store')
    })
    connection.query('select * from account where email = ?',[email],function(err,result){
      if(err){
        console.log("[error] - ",err.message);
        return;
      }
      console.log(result)
    })
  })
}
module.exports = {
    createAccount,
    checkLogin,
    get_username,
    add_fb_account,
    get_ins_info,
    get_fb_info,
    get_platform,
    store_yttoken
}