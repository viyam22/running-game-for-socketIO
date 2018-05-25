/**
 * @author anlun214 QQ:58529016
 */
var F2xExtend=__extends;
var cdnUrl="";
var stage;
window.addEventListener("load",function(){
    annie.debug=false;
    /**
     * 最上层div的id,可以在一个页面同时放多个stage.
     * 设计尺寸的宽
     * 设计尺寸的高
     * FPS刷新率
     * 缩放模式
     * 渲染模式
     */
    stage=new annie.Stage("annieEngine",1920,1080,30,annie.StageScaleMode.SHOW_ALL,0);
    //默认关闭自动旋转和自动resize
    // stage.autoResize=true;
    // stage.autoSteering=true;
    stage.addEventListener(annie.Event.INIT_TO_STAGE,function (e) {
        loader=new annie.URLLoader();
        loader.load(cdnUrl+"resource/other/loading.png");
        loader.addEventListener(annie.Event.COMPLETE,loadingInit);
    });
    function loadingInit(e){
        loadingSp=new annie.Sprite();
        loadingSp.x=1920/2;
        loadingSp.y=1080/2-50;
        //console.log("loadingOk:",e.data);
        //var logoBitData=annie.BitmapData()
        var logoBit=new annie.Bitmap(e.data.response);
        var loadingIcon=new annie.Sprite();
        logoBit.x=-25;
        logoBit.y=-25;
        loadingIcon.addChild(logoBit);
        logoBit.anchorX=25;
        logoBit.anchorY=25;
        annie.Tween.to(logoBit,1,{rotation:360,loop:true});

        loadingSp.addChild(loadingIcon);
        loadingTxt=new annie.TextField();
        loadingTxt.lineWidth=400;
        loadingTxt.color="#999999";
        //loadingTxt.color="#009EA1";
        loadingTxt.textAlign="center";
        loadingTxt.x=-200;
        loadingTxt.y=50;
        loadingTxt.size=26;
        loadingTxt.text="0%";
        loadingSp.txt=loadingTxt;
        loadingSp.addChild(loadingTxt);
        stage.addChild(loadingSp);
        sceneInit();
    }
    function sceneInit(){
        Flash2x.loadScene(["pc"],function(per){
            //加载进度
            //console.log("加载进度:"+per+"%");
            var pNum=per;//parseInt((per*(5/2)>100)?100:per*(5/2));
            loadingSp.txt.text=pNum+"%";
        },function(result){
            //加载完成
            //return;
            loadingSp.txt.text="100%";
            console.log(result.sceneId+":"+result.sceneName);
            if(result.sceneName=="pc") {
                annie.Tween.to(loadingSp,0.5,{alpha:0});
                pageRoot=new pc.Pc();
                //pageRoot.alpha=0;
                //annie.Tween.to(pageRoot,1,{alpha:1});
                stage.addChild(pageRoot);
                //console.log("hs20170110:"+pageRoot);
                setTimeout(function(){
                    loadingSp.visible=false;
                },500);
            }
        });
    }
});