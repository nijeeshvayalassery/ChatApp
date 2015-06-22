var express=require('express');
var session = require('express-session');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
//var MemoryStore = express.session.MemoryStore;

var app=express();
var clients=[];
Cusers=[];
app.set('views',__dirname + '/views');
app.set('view engine', 'jade');

var sessionHandler = session({
    secret: "session-secret",
    rolling: true,
    resave: true,
    saveUninitialized: true,
});
app.use(sessionHandler);
/*
//######Radis Session
var RedisStore = require('connect-redis')(express);
var sessionStore = new RedisStore();
var cookieParser = express.cookieParser('NVNVNV');


app.use(cookieParser);
app.use(express.session({store: sessionStore}));

//##########*/

app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

require('./Router')(app);

app.engine('html', require('ejs').renderFile);
var server=app.listen(4000,function(){
console.log("We have started our server on port 4000");
});
app.post('/login',function(req,res){
    console.log('Got POSTTTTTTTTTT')
    sess=req.session;
    //In this we are assigning email to sess.email variable.
    //email comes from HTML page.
    console.log(req.body.email)
    console.log(req.body.name)
    sess.email=req.body.email;
    sess.name=req.body.name;
    Cusers.push({'name':req.body.name,'email':req.body.email});
    if (clients.length > 0) {
        for (var i=0; i < clients.length; i++) {
           clients[i].sendUTF(JSON.stringify({'Type':'NewUser','UserName':req.body.name,'Email':req.body.email}));
        }    
    }
    res.end('done');
});
app.get('/admin',function(req,res){
    sess=req.session;
    if(sess.email){ 
        /*res.write('<h1>Hello '+sess.email+'</h1>');
        res.end('<a href="/logout">Logout</a>');*/
        res.render('Home')
    }else{
        res.write('<h1>Please login first.</h1>');
        res.end('<a href="/login">Login</a>');
    }
});
app.get('/logout',function(req,res){
     if (clients.length > 0) {
        sess=req.session;
        var Uemail=''
        if(sess.email){
            Uemail=sess.email;
        }
        for (var i=0; i < clients.length; i++) {
           if (Cusers[i].email==Uemail) {
            Cusers.splice(i,1);
           }
        }   
        for (var i=0; i < clients.length; i++) {
           clients[i].sendUTF(JSON.stringify({'Type':'Logout','UserEmail':Uemail}));
        }    
    }
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.end('done');
        }
    });
});


/*var WebSocketServer = require('websocket').server;
wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function(request) {
    
    //console.log("Cookies: ", request.cookies)
    var connection = request.accept(null, request.origin);
    // console.log('user '+request.session.email+' Logged in '+request.session.name)
    //console.log(connection)
    clients.push(connection)
    app.set('clients',clients)
    // This is the most important callback for us, we'll handle
    // all messages from users here.
    
    connection.on('message', function(message) {
        console.log("Cookies: ", request.origin)
        if (message.type === 'utf8') {
            // process WebSocket message
        }
         console.log(clients.length)
        for (var i=0; i < clients.length; i++) {
            clients[i].sendUTF(JSON.stringify({'Type':'Chat','Message':message.utf8Data}));
        }
    });
    
    connection.on('close', function(connection) {
        // close user connection
    });
});*/

var socketio = require('socket.io')
var io = socketio.listen(server);
var io = socketio.listen(server);
var clients = {};
 
var socketsOfClients = {};
io.sockets.on('connection', function(socket) {
    console.log('Got CONN ######################################################### ...')
  socket.on('set username', function(userName) {
    // Is this an existing user name?
    if (clients[userName] === undefined) {
      // Does not exist ... so, proceed
      clients[userName] = socket.id;
      socketsOfClients[socket.id] = userName;
      userNameAvailable(socket.id, userName);
      userJoined(userName);
    } else
    if (clients[userName] === socket.id) {
      // Ignore for now
    } else {
      userNameAlreadyInUse(socket.id, userName);
    }
  });
  socket.on('message', function(msg) {
    console.log('Got Meassage ...'+msg.message)
    var srcUser;
    if (msg.inferSrcUser) {
      // Infer user name based on the socket id
      srcUser = socketsOfClients[socket.id];
    } else {
      srcUser = msg.source;
    }
 
    if (msg.target == "All") {
      // broadcast
        io.sockets.emit('message',
          {"source": srcUser,
           "message123455": msg.message,
           "target": msg.target});
    } else {
      /*// Look up the socket id
      io.sockets.sockets[clients[msg.target]].emit('message',
          {"source": srcUser,
           "message": msg.message,
           "target": msg.target});*/
        io.sockets.emit('message',
          {"source": srcUser,
           "message1234": msg.message,
           "target": msg.target});
    }
  })
  socket.on('disconnect', function() {
    var uName = socketsOfClients[socket.id];
    delete socketsOfClients[socket.id];
    delete clients[uName];
 
    // relay this message to all the clients
 
    userLeft(uName);
  })
})
 
function userJoined(uName) {
    Object.keys(socketsOfClients).forEach(function(sId) {
      io.sockets.sockets[sId].emit('userJoined', { "userName": uName });
    })
}
 
function userLeft(uName) {
    io.sockets.emit('userLeft', { "userName": uName });
}
 
function userNameAvailable(sId, uName) {
  setTimeout(function() {
 
    console.log('Sending welcome msg to ' + uName + ' at ' + sId);
    io.sockets.sockets[sId].emit('welcome', { "userName" : uName, "currentUsers": JSON.stringify(Object.keys(clients)) });
 
  }, 500);
}
 
function userNameAlreadyInUse(sId, uName) {
  setTimeout(function() {
    io.sockets.sockets[sId].emit('error', { "userNameInUse" : true });
  }, 500);
}