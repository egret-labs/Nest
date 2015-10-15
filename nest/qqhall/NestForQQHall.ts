//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class NestForQQHall {

}
module nest.qqhall {
    export var login_call_type = 102;
    export var login_back_call_type = 100;
    export var pay_call_type = 101;
    export var share_call_type = 104;

    export var login_callback_type:number = 200;
    export var pay_callback_type:number = 201;
    export var share_callback_type:number = 204;

    export var loginCallback:Function = null;
    export var payCallback:Function = null;
    export var shareCallback:Function = null;

    export var version:string = "V1.0.0";
    export var loginNum:number = 0;
    export var spid:number = 10835;

    export var gameType;
    export var gameVersion;
    export var OpenId;
    export var OpenKey;
    export var enterType;
    export var enterId;
    export var payToken;

    export var userId;

    function setProxy(url:string, postData:Object, method:string, callback:Function):void {
        var postdata = "";
        for (var key in postData) {
            postdata += key + "=" + postData[key] + "&";
        }
        if (postdata != "") {
            postdata = postdata.substr(0, postdata.length - 1);
        }

        console.log("qq hall send : " + url + "?" + postdata);

        var loader:egret.URLLoader = new egret.URLLoader();
        loader.addEventListener(egret.Event.COMPLETE, function () {
            console.log("qq hall get data : " + loader.data);
            var jsonObj = JSON.parse(loader.data);
            callback(jsonObj);
        }, this);
        var request:egret.URLRequest = new egret.URLRequest(url);
        request.method = method;
        request.data = new egret.URLVariables(postdata);
        loader.load(request);
    }

    export function payBefore(orderInfo:nest.iap.PayInfo, callback):void {
        var url:string = "http://api.gz.1251278653.clb.myqcloud.com/games/api.php";

        var postdata = {
            "action": "pay.buy",
            "id": userId,
            "appId": appId,
            "openid": OpenId,
            "openkey": OpenKey,
            "paytoken": payToken,
            "time": Date.now(),
            "runtime": 1
        };
        for (var k in orderInfo) {
            postdata[k] = orderInfo[k];
        }

        setProxy(url, postdata, egret.URLRequestMethod.GET, function (resultData) {
            callback(resultData);
        });
    }

    export function callHall(data:any) {
        var msg:string = JSON.stringify(data);
        console.log("NestForQQHall::HALL_EGRET_MSG_FROM " + msg);
        egret.ExternalInterface.call("HALL_EGRET_MSG_FROM", msg);
    }

    egret.ExternalInterface.addCallback("HALL_EGRET_MSG_TO", function (data:string) {
        var info:any = JSON.parse(data);
        console.log("NestForQQHall::HALL_EGRET_MSG_TO " + info);
        switch (info.msgType) {
            case login_callback_type:
                if (info["accessToken"] == null) {
                    loginNum++;
                    if (loginNum >= 3) {
                        //彻底登陆失败
                        var loginCallbackInfo:nest.user.LoginCallbackInfo = {
                            "status": -1,
                            "result": -1,
                            "loginType": undefined,
                            "token": undefined
                        };
                        loginCallback.call(null, loginCallbackInfo);
                        loginCallback = null;
                        return;
                    }
                    //登录失败，尝试重新登陆
                    var loginInfo:string = "OpenId/OpenKey 为空";
                    callHall({msgType: login_back_call_type, msgVersion: version, errorID: 1, loginInfoStr: loginInfo});
                    callHall({msgType: login_call_type, msgVersion: version});
                    return;
                }
                if (loginCallback) {
                    gameType = info["msgType"];
                    gameVersion = info["msgVersion"];
                    OpenId = info["openId"];
                    OpenKey = info["accessToken"];
                    enterType = info["enterType"];
                    enterId = info["enterId"];
                    payToken = info["payToken"];

                    var loginInfo:string = "登录成功";
                    callHall({msgType: login_back_call_type, msgVersion: version, errorID: 0, loginInfoStr: loginInfo});
                    var api = "http://api.gz.1251278653.clb.myqcloud.com/games/www/game.php/" + appId + "_" + spid;

                    var sendData = {};
                    sendData["openkey"] = OpenKey;
                    sendData["openid"] = OpenId;
                    sendData["paytoken"] = payToken;
                    sendData["runtime"] = 1;
                    sendData["showGame"] = 1;
                    //需要发送 runtime=1 showGame=1 openkey= openid= paytoken=
                    setProxy(api, sendData, egret.URLRequestMethod.GET, function (resultData) {
                        console.log("loginCallbackInfo:" + JSON.stringify(resultData));
                        var data = resultData.data;
                        userId = data.id;
                        loginCallback.call(null, data);
                        loginCallback = null;
                    });
                }
                break;
            case pay_callback_type:
                if (payCallback) {
                    var result = info.payState;
                    var errorMsg;//todo
                    switch (info.payState) {
                        case -1://未知问题
                            break;
                        case 0://支付成功
                            break;
                        case 1://用户取消
                            break;
                        case 2://支付出错
                            break;
                    }
                    payCallback.call(null, {result: result, status: result});
                    payCallback = null;
                }
                break;
            case share_callback_type:
                if(shareCallback) {
                    var result = info.errorid;
                    shareCallback.call(null, {result: result, status: result});
                    shareCallback = null;
                }
                break;
        }
    });
}
module nest.qqhall.user {
    export function isSupport(callback:Function) {
        console.log("NestForQQHall::user.isSupport");
        var status = 0;
        var loginCallbackInfo = {
            "status": status,
            "result": status,
            "checkLogin": 0,
            "login": 1,
            "logout": 0,
            "getInfo": 0
        };
        callback.call(null, loginCallbackInfo);
    }

    export function checkLogin(loginInfo:nest.user.LoginInfo, callback:Function) {
        console.log("NestForQQHall::checkLogin");
        var status = -1;
        var loginCallbackInfo = {
            "status": status,
            "result": status,
            "loginType": undefined,
            "token": undefined
        };
        callback.call(null, loginCallbackInfo);
    }

    export function login(loginInfo:nest.user.LoginInfo, callback:Function) {
        console.log("NestForQQHall::login");
        loginCallback = callback;
        callHall({msgType: login_call_type, msgVersion: version});
    }
}

module nest.qqhall.iap {
    export function pay(orderInfo:nest.iap.PayInfo, callback:Function) {
        payBefore(orderInfo, function (data:any) {
            data = data.data;
            if (data["status"] == 0) {//购买道具成功
                callback.call(null, {result: 0, status: 0});
            }
            else {//失败，需要调用大厅充值
                payCallback = callback;
                callHall({
                    msgType: pay_call_type,
                    msgVersion: "V1.0.0",
                    acctType: "",
                    zoneId: "",
                    payValue: data["qCoins"],
                    isCanChange: false//目前只支持可改（true）
                });
            }
        });
    }
}

module nest.qqhall.app {
    export function isSupport(callback:Function) {
        var status = 0;
        var loginCallbackInfo = {
            "status": status,
            "result": status,
            "attention": 0,
            "sendToDesktop": 0,
            "exitGame": 1
        };
        callback.call(null, loginCallbackInfo);
    }

    export function exitGame(callback:Function) {
        //todo
        var status = 0;
        var loginCallbackInfo = {
            "status": status,
            "result": status
        };
        callback.call(null, loginCallbackInfo);
    }

    export function attention(appInfo:any, callback:Function) {

    }

    export function sendToDesktop(appInfo:any, callback:Function) {

    }
}

module nest.qqhall.share {

    /**
     * 是否支持分享
     * @param callback
     * @callback-param {status:0, share:0}  share 1支持 0不支持
     */
    export function isSupport(callback:Function) {
        var status = 0;
        var loginCallbackInfo = {
            "status": status,
            "result": status,
            "share": 1
        };
        callback.call(null, loginCallbackInfo);
    }


    /**
     * 分享
     * @param shareInfo
     * @param callback
     * @callback-param result 0 表示分享成功，-1表示用户取消
     */
    export function share(shareInfo:nest.share.ShareInfo, callback:Function) {
        shareCallback = callback;
        callHall({
            msgType: share_call_type,
            msgVersion: "V1.0.0",
            title: shareInfo.title,
            summary: shareInfo.description,
            imageLocalUrl: "",
            targetUrl: shareInfo.url
        });
    }
}

module nest.qqhall.social {
    export function isSupport(callback:Function) {
        var status = 0;
        var loginCallbackInfo = {
            "status": status,
            "result": status,
            "getFriends": 0,
            "openBBS": 0
        };
        callback.call(null, loginCallbackInfo);
    }

    export function getFriends(socialInfo, callback:Function) {

    }

    export function openBBS(socialInfo, callback:Function) {

    }
}

if (egret.MainContext.runtimeType == egret.MainContext.RUNTIME_NATIVE) {
    if (parseInt(egret.getOption("egret.runtime.spid")) == 10835) {
        console.log("NestForQQHall::init");
        var appId = 230;//开放平台的游戏id，需要手动修改下

        nest.user.isSupport = nest.qqhall.user.isSupport;
        nest.user.checkLogin = nest.qqhall.user.checkLogin;
        nest.user.login = nest.qqhall.user.login;

        nest.iap.pay = nest.qqhall.iap.pay;

        nest.share.isSupport = nest.qqhall.share.isSupport;
        nest.share.share = nest.qqhall.share.share;

        nest.app.isSupport = nest.qqhall.app.isSupport;
        nest.app.attention = nest.qqhall.app.attention;
        nest.app.exitGame = nest.qqhall.app.exitGame;
        nest.app.sendToDesktop = nest.qqhall.app.sendToDesktop;

        nest.social.isSupport = nest.qqhall.social.isSupport;
        nest.social.getFriends = nest.qqhall.social.getFriends;
        nest.social.openBBS = nest.qqhall.social.openBBS;
    }
    else {
        console.log("not QQHall");
    }
}