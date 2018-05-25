$(function() {
  var socket = io();
  var numUsers;
  var userIndex;   // 用户当前下标
  var isConnect = false;     // 是否连接上服务器
  var shakeCount = 0;
  var last_update = 0;
  var SHAKE_THRESHOLD = 800;     // 摇一摇的阈值
  var x = y = z = last_x = last_y = last_z = 0;
  var sendInterval;
  var shakeMusic= $('#shakeMusic');
  var nickname = getQueryString('nickname');
  var hpic = getQueryString('headimgurl');
  // var headimgurl = $.cookie('headimgurl');


  $('#nickname').text('欢迎你，' + nickname);
  // console.log('test', 'vibrate' in navigator); 
  // navigator.vibrate(1000);

  $('#login').click(function() {
    socket.emit('loginBefore');
  })

  socket.on('sendloginState', function(data) {
    if (!data.loginState) {
      $('#loginTip').show();
      $('#loginTip').text('该游戏室已满人！');
    } else if(data.gameState){
      $('#loginTip').show();
      $('#loginTip').text('该游戏已经开始！');
    } else{

      // var nickname = $('#inputName').val().trim();

      // if (!nickname) {
      //   alert('输入角色名才能进入游戏哦！');
      //   return;
      // }
      $('#loginPage').hide();
      $('#playPage').show();
      socket.emit('login', {nickname:nickname, hpic:hpic});
      isConnect = true;
      $('#userName').text('您好,' + nickname);
      $('#shakeTip').text('游戏准备开始').css({ animation: 'shakeMove 0s ease infinite' });
    }

    setTimeout(function() {
      $('#loginTip').hide();
    }, 2500)
  })

  /*
 **********  获取网页参数  ************
 */
function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
      return decodeURI(r[2]);
  }
  return null;
}

  // 监听摇一摇
  if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', deviceMotionHandler, false);
  } else {
      alert('本设备不支持devicemotion事件');
  }

  if (!'vibrate' in navigator) {
    alert('本设备不支持震动事件');
  }

  function deviceMotionHandler(eventData) {
    // if (!isShake) {
    //   return;
    // }
    var acceleration = eventData.accelerationIncludingGravity;
    var curTime = new Date().getTime();

    if ((curTime - last_update) > 100) {
      var diffTime = curTime - last_update;
      last_update = curTime;
      x = acceleration.x;
      y = acceleration.y;
      z = acceleration.z;
      var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 8000;
      var status = document.getElementById("status");

      if (speed > SHAKE_THRESHOLD) {
        shakeCount++;
      }
      last_x = x;
      last_y = y;
      last_z = z;
    }
  };

  function sendShakeCount() {
    clearInterval(sendInterval);
    var preShakeCount = 0;
    if (!isConnect) return;
    sendInterval = setInterval(function() {
      /* 发送客户端的摇一摇速度
       * @User: 用户序号
       * @shakeCount: 1s摇一摇的次数
       */
      if (preShakeCount !== 0 || shakeCount !== 0) {
        socket.emit('sendShakeCount', {
          userIndex: userIndex + 1,
          shakeCount:shakeCount
        })
        if ('vibrate' in navigator) {
          if (shakeCount > 4) {
            navigator.vibrate([200, 200, 200, 200, 200]);
            socket.on('test', '4444');
          } else {
            navigator.vibrate(0);
          }
        }
        preShakeCount = shakeCount;
        shakeCount = 0;
      };
    }, 1000);
  };

  // 开始游戏
  socket.on('gameStart', function(data) {
    console.log("phone::gameStart")
    shakeCount = 0;     // 开始游戏前摇一摇清零 
    sendShakeCount();   // 发送客户端摇一摇的速度
    $('#shakeTip').text('摇一摇进行游戏').css({ animation: 'shakeMove 0.3s ease infinite' });
  })

  // 用户得到相应的游戏结果
  socket.on('getResult', function(data) {
    console.log('data.user: ', data.user, 'numUsers: ', numUsers);
    if (userIndex === data.userIndex) {
      $('#resultTxt').text('您的排名是' + data.topNum + '，所用时间' + data.userTime);
      $('#shakeTip').text('游戏结束').css({ animation: 'shakeMove 0s ease infinite' });
      clearInterval(sendInterval);
    }
  });

  // 获得当前用户下标
  socket.on('getUsernum', function(data) {
    userIndex = data;
    console.log('userIndex', userIndex);
  });

  // 网页端刷新，要重新进入
  socket.on('serverNotFound', function() {
    isConnect = false;
    $('#loginPage').show();
    $('#playPage').hide();
  })
})