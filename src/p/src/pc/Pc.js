var pc=pc||{};
var gameRoot;
var playerArr=[];
var startTime=0;
var topNum=1;
var countdownNum=30;
var countdownId=0;
var socket = io();
var userNum = 0;  // 用户数量提示
var maxUserNum = 8;  // 游戏最大用户数量
var COUNTDOWNTIME = 30;
var countdownNum = COUNTDOWNTIME; // 游戏开始前倒计时
var countDownMusic = document.getElementById('countDownMusic');
var isGmaeRuning=false;
pc.Pc=function(){
	var s = this;
	F2xContainer.call(s);
	s.initUI();
	gameRoot=this;
	s.pageInit();
};
F2xExtend(pc.Pc,F2xContainer);
pc.Pc.prototype.pageInit=function(){
	for(var i=0;i<8;i++){
		var pid=i+1;
		var player=this["p"+pid];
		player.pid=pid;
		//player.num_sp.num_txt.text="P"+pid;
		player.speed=0  //Math.random()*5+0.2;
		player.isRun=false;
		player.visible=false;
		playerArr.push(player);

		this.topNumCon["topNum"+pid].text="";
		this.nikcnameCon['n' + pid].text = '';
	}
	this.topNumCon.alpha=0.7;
	this.startNumMc.visible=false;
	playerArr[0].addEventListener(annie.MouseEvent.CLICK,this.gameInit.bind(this));
	this.gameStartBtn.addEventListener(annie.MouseEvent.CLICK,this.gameStartBtnClick.bind(this));
	//this.gameReadyStart();
	socket.emit('resetNumUsers', maxUserNum);    // 像客户端发送游戏开始状态
	this.gameInit();
};
pc.Pc.prototype.gameStartBtnClick=function(e){
	if(userNum<2){
		alert("至少2人才能开始游戏啊！")
	}else{
		gameRoot.gameReadyStart();
	}
};
pc.Pc.prototype.gameInit=function(){
	console.log("gameInit");
	isGmaeRuning=false;
	topNum=1;
	gameRoot.removeEventListener(annie.Event.ENTER_FRAME,gameRoot.gameUpdate);
	for(var i=0;i<8;i++){
		var pid=i+1;
		var player=this["p"+pid];
		player.isRun=false;
		player.gotoAndStop(1);
		player.x=130;
		gameRoot.topNumCon["topNum"+pid].text="";
	}
	
	gameRoot.countdown_txt.text='已进：' +userNum + '人，倒计时：' + COUNTDOWNTIME +'s';
	clearInterval(countdownId);
	countdownNum = COUNTDOWNTIME
	countdownId=setInterval(gameRoot.countdownRun, 1000);
};
pc.Pc.prototype.countdownRun=function(){
	countdownNum--;
	gameRoot.countdown_txt.text='已进：' +userNum + "人，倒计时："+countdownNum+"s";
	if(countdownNum < 0){
		if (userNum < 2) {
			gameRoot.gameInit();
		} else {
			gameRoot.gameReadyStart();
		}
	}
};
pc.Pc.prototype.gameReadyStart=function(){
	isGmaeRuning=true;
	gameRoot.countdown_txt.text="";
	clearInterval(countdownId);
	gameRoot.startNumMc.visible=true;
	gameRoot.startNumMc.gotoAndPlay(2);
	setTimeout(this.gameStart,3000);
	countDownMusic.play();
};
pc.Pc.prototype.gameStart=function(){
	for(var i=0;i<8;i++) {
		var pid = i + 1;
		var player=playerArr[i];
		player.isRun=true
		// setPlayerSpeed(pid,(Math.random()*5+0.2));///////////////测试用。给予随机速度
	}
	gameRoot.startNumMc.visible=false;
	startTime=new Date().getTime();
	//console.log(startTime);
	gameRoot.addEventListener(annie.Event.ENTER_FRAME,gameRoot.gameUpdate);

	// 游戏开始
	console.log('游戏开始');
	socket.emit('gameStart');
};
pc.Pc.prototype.gameUpdate=function(){
	for(var i=0;i<8;i++){
		var player=playerArr[i];
		if(player.x<1800){
			player.x+=player.speed;
		}else if(player.isRun==true){
			gameRoot.playerEnd(player);
		}
	}
};
pc.Pc.prototype.playerEnd=function(player){
	var endTime=new Date().getTime();;
	var userTime=Number((endTime-startTime)/1000).toFixed(2);
	gameRoot.topNumCon["topNum"+player.pid].text=userTime+"  Top "+topNum;
	setPlayerSpeed(player.pid, 0);

	/* 给客户端发送成绩
	 * @userTime: 用户所用时间
	 * @toNum: 用户排名
	 * @user: 用户序号
	 */
	socket.emit('sendResult', {
		userTime:userTime,
		topNum:userTime,
		userIndex: player.pid - 1
	})
	topNum++;
	player.isRun=false;
	player.gotoAndStop(1);
};
function setPlayerSpeed(pid,speed){
	var player=playerArr[pid-1];
	player.speed=speed;
	if(player.speed>4){
		player.gotoAndStop(3);
	}else if(player.speed==0){
		player.gotoAndStop(1);
	}else{
		player.gotoAndStop(2);
	}
};
pc.Pc.prototype.initUI=function(){
	var s = this;
	//f2x_auto_created_init_start
	var _d3=new pc.F2xAuto_33();
	Flash2x.d(_d3,{x:2534.65,y:-732.4,r:90});
	var _d2=new pc.F2xAuto_33();
	Flash2x.d(_d2,{y:-692.45,r:90});
	var _d1=new pc.F2xAuto_33();
	Flash2x.d(_d1,{x:-320.05,y:1080});
	var _d0=new pc.F2xAuto_33();
	Flash2x.d(_d0,{x:-320.1,y:-616.1});
	var _d4=new pc.F2xAuto_32();
	_d4.name="gameStartBtn";
	s.gameStartBtn=_d4;
	Flash2x.d(_d4,{x:52.8,y:132});
	var _d5=Flash2x.t(0,decodeURI("%E5%8D%B3%E5%B0%86%E5%BC%80%E5%A7%8B%EF%BC%9A30s"),60,"#D22C0C","Arial",2,2,1052,84,62,"left",false,false,"single",false);
	_d5.name="countdown_txt";
	s.countdown_txt=_d5;
	Flash2x.d(_d5,{x:54.25,y:40.85});
	var _d6=new pc.F2xAuto_24();
	_d6.name="startNumMc";
	s.startNumMc=_d6;
	Flash2x.d(_d6,{x:782.5,y:542.5});
	var _d14=new pc.F2xAuto_20();
	_d14.name="p8";
	s.p8=_d14;
	Flash2x.d(_d14,{x:128.9,y:1043});
	var _d13=new pc.F2xAuto_20();
	_d13.name="p7";
	s.p7=_d13;
	Flash2x.d(_d13,{x:128.9,y:963});
	var _d12=new pc.F2xAuto_20();
	_d12.name="p6";
	s.p6=_d12;
	Flash2x.d(_d12,{x:128.9,y:884.6});
	var _d11=new pc.F2xAuto_20();
	_d11.name="p5";
	s.p5=_d11;
	Flash2x.d(_d11,{x:128.9,y:804.6});
	var _d10=new pc.F2xAuto_20();
	_d10.name="p4";
	s.p4=_d10;
	Flash2x.d(_d10,{x:128.9,y:723});
	var _d9=new pc.F2xAuto_20();
	_d9.name="p3";
	s.p3=_d9;
	Flash2x.d(_d9,{x:128.9,y:643});
	var _d8=new pc.F2xAuto_20();
	_d8.name="p2";
	s.p2=_d8;
	Flash2x.d(_d8,{x:130.5,y:564.6});
	var _d7=new pc.F2xAuto_20();
	_d7.name="p1";
	s.p1=_d7;
	Flash2x.d(_d7,{x:130.65,y:480});
	var _d15=new pc.F2xAuto_23();
	_d15.name="nikcnameCon";
	s.nikcnameCon=_d15;
	Flash2x.d(_d15,{x:296.05,y:454,o:0.5});
	var _d16=new pc.F2xAuto_22();
	_d16.name="topNumCon";
	s.topNumCon=_d16;
	Flash2x.d(_d16,{x:1356.35,y:454,o:0.5});
	var _d17=new pc.F2xAuto_19();
	Flash2x.d(_d17,{x:194.25,y:436.35,o:0.6992});
	var _d20=new pc.F2xAuto_18();
	Flash2x.d(_d20,{x:140,y:440,o:0.3984});
	var _d19=new pc.F2xAuto_18();
	Flash2x.d(_d19,{x:1732.4,y:440,o:0.8008});
	var _d18=new pc.F2xAuto_18();
	Flash2x.d(_d18,{x:200,y:440,o:0.8008});
	var _d28=new pc.F2xAuto_17();
	Flash2x.d(_d28,{y:1000});
	var _d27=new pc.F2xAuto_16();
	Flash2x.d(_d27,{y:920});
	var _d26=new pc.F2xAuto_15();
	Flash2x.d(_d26,{y:840});
	var _d25=new pc.F2xAuto_14();
	Flash2x.d(_d25,{y:760});
	var _d24=new pc.F2xAuto_13();
	Flash2x.d(_d24,{y:680});
	var _d23=new pc.F2xAuto_12();
	Flash2x.d(_d23,{y:600});
	var _d22=new pc.F2xAuto_11();
	Flash2x.d(_d22,{y:520});
	var _d21=new pc.F2xAuto_10();
	Flash2x.d(_d21,{y:440});
	var _d48=new pc.random63407_59551();
	Flash2x.d(_d48,{x:708.25,y:271});
	var _d47=new pc.random7875_51150();
	Flash2x.d(_d47,{x:599.85,y:278});
	var _d46=new pc.random75831_98298();
	Flash2x.d(_d46,{x:-27.15,y:140});
	var _d45=new pc.random49501_76363();
	Flash2x.d(_d45,{x:1701.35,y:327});
	var _d44=new pc.random13027_12740();
	Flash2x.d(_d44,{x:1190.85,y:299.8});
	var _d43=new pc.random49985_91818();
	Flash2x.d(_d43,{x:1590.85,y:268});
	var _d42=new pc.random1665_68390();
	Flash2x.d(_d42,{x:1428.85,y:333});
	var _d41=new pc.random80319_48225();
	Flash2x.d(_d41,{x:179.45,y:337});
	var _d40=new pc.random26879_61068();
	Flash2x.d(_d40,{x:367.35,y:206});
	var _d39=new pc.random53435_81204();
	Flash2x.d(_d39,{x:437.35,y:334});
	var _d38=new pc.random49501_76363();
	Flash2x.d(_d38,{x:1199.35,y:327});
	var _d37=new pc.random32489_29011();
	Flash2x.d(_d37,{x:1053.35,y:340});
	var _d36=new pc.random68271_30874();
	Flash2x.d(_d36,{x:1131.35,y:327});
	var _d35=new pc.random91549_64251();
	Flash2x.d(_d35,{x:85.95,y:313});
	var _d34=new pc.random84653_17176();
	Flash2x.d(_d34,{x:1547.75,y:232});
	var _d33=new pc.random32051_47040();
	Flash2x.d(_d33,{x:948.85,y:333});
	var _d32=new pc.random68271_30874();
	Flash2x.d(_d32,{x:855.35,y:327});
	var _d31=new pc.random93391_63563();
	Flash2x.d(_d31,{x:318.05,y:171});
	var _d30=new pc.random40599_91111();
	Flash2x.d(_d30,{x:1822.85,y:312});
	var _d29=Flash2x.b("pc","suning1");
	Flash2x.d(_d29,{x:1744.05,y:253});
	var _d49=new pc.F2xAuto_7();
	_d49.name="cloud";
	s.cloud=_d49;
	Flash2x.d(_d49,{x:-281.7,y:-113.65});
	var _d50=new pc.F2xAuto_5();
	s.addChild(_d50);
	s.addChild(_d49);
	s.addChild(_d29);
	s.addChild(_d30);
	s.addChild(_d31);
	s.addChild(_d32);
	s.addChild(_d33);
	s.addChild(_d34);
	s.addChild(_d35);
	s.addChild(_d36);
	s.addChild(_d37);
	s.addChild(_d38);
	s.addChild(_d39);
	s.addChild(_d40);
	s.addChild(_d41);
	s.addChild(_d42);
	s.addChild(_d43);
	s.addChild(_d44);
	s.addChild(_d45);
	s.addChild(_d46);
	s.addChild(_d47);
	s.addChild(_d48);
	s.addChild(_d21);
	s.addChild(_d22);
	s.addChild(_d23);
	s.addChild(_d24);
	s.addChild(_d25);
	s.addChild(_d26);
	s.addChild(_d27);
	s.addChild(_d28);
	s.addChild(_d18);
	s.addChild(_d19);
	s.addChild(_d20);
	s.addChild(_d17);
	s.addChild(_d16);
	s.addChild(_d15);
	s.addChild(_d7);
	s.addChild(_d8);
	s.addChild(_d9);
	s.addChild(_d10);
	s.addChild(_d11);
	s.addChild(_d12);
	s.addChild(_d13);
	s.addChild(_d14);
	s.addChild(_d6);
	s.addChild(_d5);
	s.addChild(_d4);
	s.addChild(_d0);
	s.addChild(_d1);
	s.addChild(_d2);
	s.addChild(_d3);
	//f2x_auto_created_init_end
};

// 用户登录监听
socket.on('addUser', function(data) {
	console.log(data, '用户进入游戏室');
	userNum = data.numUsers;
	gameRoot.countdown_txt.text='已进：' +userNum + '人，倒计时：' + COUNTDOWNTIME +'s';
	var player = playerArr[data.userIndex];
	player.visible = true;
	player.x = -50;
	annie.Tween.to(player, 0.3, { x: 130 });
	countdownNum=60;
	var circleface = new annieUI.FacePhoto();
	circleface.init(data.hpic,60, 0);
	player.hpicMov.hpicSp.hpic.addChild(circleface);
	//player.num_sp.num_txt.text = data.userName;

	gameRoot.nikcnameCon['n' + (data.userIndex + 1)].text =data.userName;

	if (data.numUsers === maxUserNum) {  // 用户达到足够人数，游戏自动开始
		gameRoot.gameReadyStart();
	}
});

// 用户离线监听
socket.on('userLeft', function(data) {
	userNum = data.numUsers;
	console.log('游戏室还剩', userNum, '人')
	if (userNum === 0) gameRoot.gameInit();
	if(isGmaeRuning==false){
		playerArr[data.userIndex].visible = false;
		gameRoot.nikcnameCon['n' + (data.userIndex + 1)].text = '';
	}else{
		gameRoot.nikcnameCon['n' + (data.userIndex + 1)].text = gameRoot.nikcnameCon['n' + (data.userIndex + 1)].text+'：离线';
	}
});

// 获取客户端摇一摇速度
socket.on('getShakeCount', function(data) {
	if (!data.userIndex) return;
	console.log('摇一摇速度', data)
	setPlayerSpeed(data.userIndex, data.shakeCount);
});

socket.on('getTest', function(data) {
	console('震动', data)
})

new QRCode(document.getElementById('code'), {
  text: 'http://demo.pflm.cn/demoAuth/activityEnt?r='+parseInt(Math.random()*100000),
  width: 180,
  height: 180
});
