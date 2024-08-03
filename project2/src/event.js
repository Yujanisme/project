
const express = require('express')
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express()
app.use(express.static(__dirname+'/public'));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs")
app.use(cookieParser());

var fs = require('fs');
const https = require('https');
var readline = require('readline');
var {google} = require('googleapis');
const { auth } = require('google-auth-library');
var OAuth2 = google.auth.OAuth2;
const multer = require('multer');
let Account_dbconnect = require("./database/connectDB_Account");
let Content_dbconnect = require('./database/connectDB_Content');
let Scheduler_dbconnect = require('./database/connectDB_scheduler');

const { title, connected, emit } = require('process');
let { PythonShell } = require('python-shell');
const { error } = require('console');
const jwt = require("jsonwebtoken");
const config  =require("./config.json");
const child = require('child_process');
const { youtube } = require('googleapis/build/src/apis/youtube');
const url = require('url');
const { file } = require('googleapis/build/src/apis/file');
const bodyParser = require('body-parser');
const { connect } = require('http2');
const { platform } = require('os');
const  schedule  = require('node-schedule')

var SCOPES = ['https://www.googleapis.com/auth/youtube','https://www.googleapis.com/auth/youtube.force-ssl','https://www.googleapis.com/auth/youtube.upload','https://www.googleapis.com/auth/youtubepartner' ];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'youtubequickstart2.json';


//產生token
function genarateToken(mail,username) {
  const token = jwt.sign({ mail:mail,username:username }, config["JWT_SIGN_SECRET"]);
  return token;
}

//確認身分(verify token)
function jwtTokenCheck(req,res,next){   
  const token = req.cookies.token;
  if(!token){
    console.log("未登入")
    var authUrl = ''
    return res.render('home',{authUrl:authUrl,username:"未登入"});
  }
  jwt.verify(token, config["JWT_SIGN_SECRET"], (err,info) => {
    if (err) {
      console.error('Token Verification Error:', err);
      return res.sendStatus(403); // 禁止訪問
    }
    const memberfile = {
      mail:info.mail,
      username:info.username
    }
    console.log(memberfile)
    console.log('verify jwttoken')
    next()
    return memberfile;
  });
}
//username
function coo_username(token){
  jwt.verify(token, config["JWT_SIGN_SECRET"], (err,info) => {
    if (err) {
      console.error('Token Verification Error:', err);
      return res.sendStatus(403); // 禁止訪問
    }
    const name = info.username
    return name;
  });
}

//creat account
app.post('/creat',function(req,res){
  console.log(req.body.username);
  console.log(req.body.email);
  console.log(req.body.password);
  Account_dbconnect.createAccount(req.body.username,req.body.email,req.body.password)
  
  res.redirect('/')
})

//登入確認資料
app.post('/checklogin',function(req,res){
  Account_dbconnect.checkLogin(req.body.email,req.body.password,function(err,username,token){
    if(err){
      console.log("登入錯誤",err)
      return res.render('login',{notify:"登入錯誤"});
    }
    if(username){
      console.log("登入成功");
      var token = genarateToken(req.body.email,username)
      res.cookie('token',token,{
        httpOnly: true,
        secure: true,
        sameSite: 'lax'
      })
      getNewToken(oauth2Client);
      return res.render('home',{loginout:'登出',authUrl:authUrl,username:username});
    }
    else{
      console.log("帳密錯誤")
      return res.render('login',{notify:"有誤"});
    }
  });
})

var authUrl =''
//首頁
app.get('/home',jwtTokenCheck,function(req,res){
  res.render('home')
})
app.get('/connectpage',jwtTokenCheck,function(req,res){
  get_client()
  const token = req.cookies.token;
  res.render('connectpage',{authUrl:authUrl})
})
//註冊頁面
app.get('/signup',function(req,res){
  res.render('signup');
})
app.get('/',function(req,res){
  var email = '' 
  const token = req.cookies.token;
  jwt.verify(token, config["JWT_SIGN_SECRET"], (err,info) => {
    if (err) {
      console.error('Token Verification Error:', err);
      return res.sendStatus(403); // 禁止訪問
    }
    email = info.email
  });
  code = req.query.code;
  getcode(code,email)
  res.redirect('home')
})
//登入頁面
app.get('/login',function(req,res){
  res.render('login')
})
app.get('/forgot',function(req,res){
  res.render('forgot')
})
//登出
app.get('/logout',function(req,res){
  res.clearCookie('token')
  res.render('home',{authUrl:'',username:'未登入',loginout:'登入'})
})
//會員中心
app.get('/member',jwtTokenCheck,function(req,res){
  const token = req.cookies.token;
  var memberfile = {};
  var connectpf = [
    {platform:'YouTube',connected:'false'},
    {platform:'Facebook',connected:'false'},
    {platform:'Instagram',connected:'false'}
  ]
  jwt.verify(token, config["JWT_SIGN_SECRET"], (err,info) => {
    if (err) {
      console.error('Token Verification Error:', err);
      return res.sendStatus(403); // 禁止訪問
    }
    memberfile = {
      mail:info.mail,
      username:info.username
    }
    Account_dbconnect.get_platform(info.mail,function(err,fb,ins,yt){
      if(fb==true){
        const updatefb = {
          platform:'Facebook',
          connected:'true'
        }
        for(let i = 0;i < connectpf.length;i++){
          if(connectpf[i].platform === updatefb.platform){
            connectpf[i] = updatefb;
            break;
          }
        }
      }
      if(ins==true){
        const updateins = {
          platform:'Instagram',
          connected:'true'
        }
        for(let i = 0;i < connectpf.length;i++){
          if(connectpf[i].platform === updateins.platform){
            connectpf[i] = updateins;
            break;
          }
        }
      }
      if(yt==true){
        const updateins = {
          platform:'YouTube',
          connected:'true'
        }
        for(let i = 0;i < connectpf.length;i++){
          if(connectpf[i].platform === updateins.platform){
            connectpf[i] = updateins;
            break;
          }
        }
      }
      const membername = memberfile.username
      res.render('member',{username:membername,connect:connectpf})
    })
    
  });
})
//設定multer
const storage = multer.diskStorage({
  destination: (req,file,cb) =>{
    cb(null,'C:/Users/yujan/project2/upload_file/');
  },
  filename:(req,file,cb) =>{
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // 生成唯一文件名
  }
})
const upload = multer({ storage: storage });

//排程
app.get('/calendar',function(req,res){
  res.render('calendar')
})

app.get('/event',function(req,res){
  const token = req.cookies.token
  const decode = jwt.decode(token)
  Scheduler_dbconnect.allevents(decode.mail,function(err,result){
    console.log('*result:',result)
    res.json(result)
  })
})

app.post('/addscheduler',upload.single('video'),function(req,res){
  const token = req.cookies.token
  const decode = jwt.decode(token)
  var schedulerpost = JSON.parse(JSON.stringify(req.body))
  console.log('addscheduler')
  console.log('email',decode.mail)
  console.log('post',req.body)
  console.log('date type:',typeof schedulerpost.postdate)
  console.log('video',req.file)
  Scheduler_dbconnect.createpost(
    decode.mail,
    req.file.path,
    schedulerpost.YouTube,
    schedulerpost.FaceBook,
    schedulerpost.Instagram,
    schedulerpost.insTagname,
    schedulerpost.fb_watcher,
    schedulerpost.fb_somefriend,
    schedulerpost.yt_watcher,
    schedulerpost.content,
    schedulerpost.postdate)
    Scheduler_dbconnect.add_calender(decode.mail,schedulerpost.title,schedulerpost.postdate,schedulerpost.content)
    schedulepost(decode.email,schedulerpost)
  res.redirect('/')
})
//排程發文
function schedulepost(email,schedulerpost){
  console.log('date type:',typeof schedulerpost.postdate)
  console.log('datentime:',schedulerpost.postdate)
  dateandtime = schedulerpost.postdate.split('T')
  date = dateandtime[0].split('-')
  year = date[0]
  month = date[1]
  day = date[2]
  time = dateandtime[1].split(':')
  hour = time[0]
  minute = time[1]

  // let postdated = new Date(year,month,day,hour,minute)
  let postdated = new Date(schedulerpost.postdate)
  schedule.scheduleJob(postdated, () => {
    uploading(
      decode.mail,
      schedulerpost.Instagram,
      schedulerpost.FaceBook,
      schedulerpost.YouTube,
      req.file.path,
      schedulerpost.content,
      schedulerpost.insTagname,
      schedulerpost.fb_watcher,
      schedulerpost.fb_somefriend,
      schedulerpost.yt_watcher)
  });
}

//connectApp
app.get('/connect',function(req,res){
    res.render('connectAPP')
})  
//youtube上傳的介面
app.get('/uploadvideo_done',function(req,res){
  res.render('uploadvideo_done')
})

//facebook 資料
app.get('/facebook_connect',jwtTokenCheck,function(req,res){
  res.render('facebook_connect')
})
//儲存facebook資料
app.post('/add_fb_acc',jwtTokenCheck,function(req,res){
  const token = req.cookies.token
  const decode = jwt.decode(token)
  console.log("decode:",decode)
  Account_dbconnect.add_fb_account(req.body.email,req.body.password,decode.mail)
  res.redirect('/home')
})

//ins登入資料
app.get('/ins_connect',function(req,res){
  res.render('ins_connect')
})
//儲存ins資料
app.post('/add_ins_acc',jwtTokenCheck,function(req,res){
  const token = req.cookies.token
  const decode = jwt.decode(token)
  console.log("decode:",decode)
  Account_dbconnect.add_fb_account(req.body.ins_id,req.body.ins_password,decode.mail)
  res.redirect('/home')
})
//上傳畫面
app.get('/upload_content',function(req,res){
  res.render('upload_content')
})

function uploading(email,Instagram,facebook,youtube,videoPath,content,insTagname,fb_watcher,fb_somefriend,yt_watcher){
  // if(Instagram){
  //   // ins自動上傳
  //   Account_dbconnect.get_ins_info(email,function(err,ins_id,ins_password){
  //     ins_upload(ins_id,ins_password,videoPath,content)
  //   }) 
  // }
  if(facebook){
    // fb自動上傳
    console.log('fbupload')
    Account_dbconnect.get_fb_info(email,function(err,fb_mail,fb_password){
      console.log('fb : ',fb_mail,fb_password)
      fb_upload(fb_mail,fb_password,videoPath,content,fb_watcher,fb_somefriend)
    })
  }
  if(youtube){
    //youtube自動上傳
    console.log('youtube_upload')
    const title = "測試標題"
    uploadvideo_auth(title,content,videoPath,yt_watcher)
  }
}

//處理上傳資料
app.post('/posts',upload.single('video'),jwtTokenCheck,(req,res)=>{
  //回傳選擇的平台
  const plat = JSON.parse(JSON.stringify(req.body))
  const youtube = plat.YouTube
  const facebook = plat.FaceBook
  // const Instagram = plat.Instagram
  // const insTagname = plat.insTagname.split(' ')
  const fb_watcher = plat.fb_watcher
  let fb_somefriend = String(plat.someFriends).split(' ')
  const yt_watcher = plat.yt_watcher
  // console.log('body:',plat)
  //回傳上傳內容
  const content = plat.content
  const videoPath = req.file.path
  const token = req.cookies.token
  const decode = jwt.decode(token)
  Content_dbconnect.recordContent(decode.mail,decode.username,videoPath,platform)
  uploading(decode.email,Instagram,facebook,youtube,videoPath,content,insTagname,fb_watcher,fb_somefriend,yt_watcher)
  // if(Instagram){
  //   // ins自動上傳
  //   Account_dbconnect.get_ins_info(decode.mail,function(err,ins_id,ins_password){
  //     ins_upload(ins_id,ins_password,videoPath,content)
  //   }) 
  // }
  // if(facebook){
  //   // fb自動上傳
  //   console.log('fbupload')
  //   Account_dbconnect.get_fb_info(decode.mail,function(err,fb_mail,fb_password){
  //     console.log('fb : ',fb_mail,fb_password)
  //     fb_upload(fb_mail,fb_password,videoPath,content,fb_watcher,fb_somefriend)
  //   })
  // }
  // if(youtube){
  //   //youtube自動上傳
  //   console.log('youtube_upload')
  //   const title = "測試標題"
  //   uploadvideo_auth(title,content,videoPath,yt_watcher)
  // }
  res.redirect('/uploadvideo_done')
})

//ins 自動化上傳
function ins_upload(ins_id,ins_password,video_path,content){
  
  let options = {
    args:[ins_id,ins_password,video_path,content]
  }

  PythonShell.run('./python/login_ins.py', options, (err, data) => {
    if (err) res.send(err)
    console.log('success upload video on the ins.')
  })
}
//fb自動上傳
function fb_upload(fb_mail,fb_password,video_path,content,fb_watcher,fb_somefriend){
  
  let options = {
    args:[fb_mail,fb_password,video_path,content,fb_watcher,fb_somefriend]
  }

  PythonShell.run('./python/login_fb.py', options, (err, data) => {
    if (err) res.send(err)
    console.log('success upload video on the fb.')
  })
}



//YOUTUBE back-end
//取得client_scret
function get_client(){
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) { 
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the YouTube API.
    authorize(JSON.parse(content), getChannel);
  });
}


function uploadvideo_auth(title,description,videoPath,yt_watcher){
  console.log('upload auth')
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) { 
    console.log('Error loading client secret file: ' + err);
    return;
  }
  credentials = JSON.parse(content)
  uploadvideo(oauth2Client,title,description,videoPath,yt_watcher)
  authorize(JSON.parse(content));
  });
}

let credentials ;
try {
  credentials = JSON.parse(fs.readFileSync('client_secret.json', 'utf8'));
} catch (err) {
  console.error('Error loading credentials.json:', err);
  process.exit(1);
}
var clientSecret = credentials.installed.client_secret;
var clientId = credentials.installed.client_id;
var redirectUrl = credentials.installed.redirect_uris[0];
var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
//youtube authorize
function authorize(credentials, callback) {
  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
    }
  });
}

var code =''
function getNewToken(oauth2Client, callback,res) {
  authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })
}

function getcode(code,email,callback){
  console.log('get code email:',email)
  oauth2Client.getToken(code, function(err, token) {
    if (err) {
      console.log('Error while trying to retrieve access token', err);
      return;
    }
    Account_dbconnect.store_yttoken(email,token.access_token)
    oauth2Client.credentials = token;
    storeToken(token);
  });
}
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log('Token stored to ' + TOKEN_PATH);
  });
}
var youtube_serve = google.youtube('v3');

//get channel information
var channels = ''
function getChannel(auth) {
  youtube_serve.channels.list({
    auth: auth,
    part: 'snippet,contentDetails,statistics',
    mine: 'true'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    channels = response.data.items;
    if (channels.length == 0) {
      console.log('No channel found.');
    } else {
      //console.log(channels)
      console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
                  'it has %s views.',
                  channels[0].id,
                  channels[0].snippet.title,
                  channels[0].statistics.viewCount);
    }
    return channels[0].id
  });
}
//youtube 上傳影片
function uploadvideo(auth,title,description,videoFilePath,yt_watcher,func){//yt_watcher=status
  console.log("auth:",auth)
  var content = {
    title:title,
    description:description
  }
  console.log(videoFilePath)
  if(title != "unknown"){
    youtube_serve.videos.insert({
      auth: auth,
      part: 'snippet,status',
      resource:{
        snippet:{
          title: title,
          description: description
        },
        status:{
          privacyStatus:yt_watcher
        },
      },
      media:{
        body:fs.createReadStream(videoFilePath)
      }
    },function(err,data){
      if(err) {
        console.log('The api return an error:' + err);
        return;
      }
      console.log("uploading video done.")
    });
  }
  console.log('youtube success')
}

//server
const httpsServer = https.createServer({
  key: fs.readFileSync('./ssl/privkey.pem'),
  cert: fs.readFileSync('./ssl/fullchain.pem'),
}, app);
httpsServer.listen(4433, () => {
  console.log('HTTPS Server running on port 4433');
});