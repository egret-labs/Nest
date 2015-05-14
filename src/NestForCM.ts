/**
 * Created by wander on 15-5-13.
 */



var VERSION = 0;
egret.ExternalInterface.addCallback("get_game_sdk_version", function(ver){
    VERSION = ver;
});
egret.ExternalInterface.call("get_game_sdk_version","");

module nest.cm.user {
    export function checkLogin(loginData:nest.user.LoginInfo,callback){

        var client_id = "141717597";
        var client_secret = "5BDF8CEE843DFF7B90B3B9CE558D52D3";
        var redirect_uri = "emdrauthcallback://emdr";

        var postData="client_id="+client_id+"&client_secret="+client_secret+"&redirect_uri="+redirect_uri+"&type=1";
        var get_device_id_key = VERSION == 0 ? "getUid"  : "get_device_info";
        egret.ExternalInterface.addCallback(get_device_id_key, function(id){
            postData+="&deviceid="+id;
            quickRegister(postData,callback);
        });
        egret.ExternalInterface.call(get_device_id_key,"");
    }


    function quickRegister(postdata,callback){
        var cmpostdata = postdata;
        var cmcallback = function(data){
            callback(data);
        }

        var url:string = "http://gclogin.liebao.cn/api/user/quick_register";
        var loader:egret.URLLoader = new egret.URLLoader();
        loader.addEventListener(egret.Event.COMPLETE, function(){
            console.log (loader.data);
            var jsonObj=JSON.parse(loader.data);
            if(jsonObj.ret==1){
                //touchTag=true;
                egret.localStorage.setItem("ssid",jsonObj.ssid);
                egret.localStorage.setItem("deviceid",jsonObj.deviceid);
                if(typeof cmcallback=="function"){
                    cmcallback({openid:jsonObj.openid});
                }
            }else if(jsonObj.ret==12005){
                //已经注册过了
            }
        }, this);
        var request:egret.URLRequest = new egret.URLRequest(url);
        request.method = egret.URLRequestMethod.POST;
        request.data = new egret.URLVariables(postdata);
        loader.load(request);
    }



}




if (true){
    nest.user.checkLogin = nest.cm.user.checkLogin;
}
