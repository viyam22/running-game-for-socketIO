// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'src')));

var numUsers = 0;
var user = [];
var maxUserNum;   // 游戏最大用户数量
var gameState = false;    // 游戏的状态，游戏开始后不能再进用户

io.on('connection', function(socket) {

  socket.on('loginBefore', function() {
    var loginState = numUsers < maxUserNum ? true : false;
    console.log('gameState', loginState, numUsers, maxUserNum)
    socket.emit('sendloginState', { loginState:loginState, gameState:gameState });
  })

  // 客户端登录
  socket.on('login', function(data) {
    var userIndex = insertUser(data);
    socket.userIndex = userIndex;
    console.log('data', data);
    socket.emit('getUsernum', userIndex);
    socket.broadcast.emit('addUser', { 
      numUsers:numUsers,
      userName: data.nickname,
      userIndex:userIndex,
      hpic: data.hpic
    });
  });

  // 给网页端发送客户端的摇一摇速度
  socket.on('sendShakeCount', function(data) {
    socket.broadcast.emit('getShakeCount', data);
  })

  // 客户端用户离开
  socket.on('disconnect', function() {
    if (numUsers !== 0) {
      removeUser(socket.userIndex);
      socket.broadcast.emit('userLeft', {
        userIndex: socket.userIndex,
        numUsers: numUsers,
        username: user[socket.userIndex]
      });
    }
  });

  // 给客户端发送成绩
  socket.on('sendResult', function(data) {
    console.log('成绩', data);
    socket.broadcast.emit('getResult', data);
  })

  // 通知客户端开始游戏
  socket.on('gameStart', function() {
    gameState = true;
    socket.broadcast.emit('gameStart');
  })

  // 网页端刷新，重置用户
  socket.on('resetNumUsers', function(data) {
    gameState = false;  
    maxUserNum = data;
    socket.broadcast.emit('serverNotFound');
    numUsers = 0;
    for (var i = 0; i < data; i++) {
      user[i] = null;
    }
  })

  socket.on('test', function(data) {
    socket.broadcast.emit('getTest', data);
  })

  // 插入用户，并返回用户所在序号
  function insertUser(name) {
    numUsers ++;
    for (var i = 0; i < maxUserNum; i++) {
      if (!user[i]) {
        user[i] = name;
        return i;
      }
    }
    // getCount();
  }

  function removeUser(index) {
    numUsers = numUsers === 0 ? 0 : (numUsers-1);
    user[index] = null;
    // getCount();
  }

  // function getCount() {
  //   var count = 0;
  //   for (var i = 0; i < maxUserNum; i++) {
  //     if (user[i] !== null) {
  //       count ++;
  //     }
  //   }
  //   numUsers = count;
  // }
});

