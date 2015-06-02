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

/*
 * cm old solution
 */
var appId = 88;//开发平台的id
var spId = 10044;
var egretInfo:nest.cm.EgretData;

module  nest.cm {
    export interface EgretData {
        egretUserId:string;
    }

    export function callRuntime(data:NestData, callback) {
        var deviceId;
        if (deviceId = egret.localStorage.getItem("deviceid")) {
            console.log("cm old local deviceid " + deviceId);
            if (deviceId.indexOf("{") >= 0) {//json数据
                var json = JSON.parse(deviceId);
                data["postData"]["deviceid"] = json["did"];
            }
            else {
                data["postData"]["deviceid"] = deviceId;
            }
            quickRegister(data["postData"], callback);
        }
        else {
            console.log("cm old CMPAY_EGRET.version " + CMPAY_EGRET.getVersion());

            var tag = (CMPAY_EGRET.getVersion() == 0 || CMPAY_EGRET.getVersion() == false) ? "getUid" : "get_device_info";
            var isFinish:boolean = false;

            var sendData = function (id) {
                if (isFinish) {
                    return;
                }
                isFinish = true;
                console.log(id);
                data["postData"]["deviceid"] = id || egret.localStorage.getItem("deviceid") || "";
                quickRegister(data["postData"], callback);
            };

            egret.ExternalInterface.addCallback(tag, function (id) {
                console.log("cm old CMPAY_EGRET");
                if (tag == "get_device_info") {
                    console.log("cm old get_device_info " + id);
                    if (id) {
                        var json = JSON.parse(id);
                        sendData(json["did"])
                    }
                    else {
                        sendData(null);
                    }

                }
                else {
                    sendData(id);
                }
            });

            egret.setTimeout(function () {
                console.log("cm old timeout");
                sendData(null);
            }, this, 2000);

            egret.ExternalInterface.call(tag, "");
        }
    }

    export function loginBefore(callback):void {
        var postdata = {};
        var url:string = "http://api.egret-labs.org/games/www/game.php/";
        url += appId + "_" + spId;
        postdata["runtime"] = 1;

        setProxy(url, postdata, egret.URLRequestMethod.GET, function (resultData) {
            callback(resultData);
        });
    }

    export function loginAfter(postdata, callback):void {
        var url:string = "http://api.egret-labs.org/games/www/game.php/";
        url += appId + "_" + spId;
        postdata["runtime"] = 1;
        postdata["showGame"] = 1;

        setProxy(url, postdata, egret.URLRequestMethod.GET, function (resultData) {
            callback(resultData);
        });
    }

    export function payBefore(orderInfo:nest.iap.PayInfo, callback):void {
        var url:string = "http://api.egret-labs.org/games/api.php";

        var postdata = {
            "action": "pay.buy",
            "id": egretInfo.egretUserId,
            "appId": appId,
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

    /**
     * @private
     * @param postdata
     * @param callback
     */
    function quickRegister(postdata, callback) {
        var url:string = "http://gclogin.liebao.cn/api/user/quick_register";
        setProxy(url, postdata, egret.URLRequestMethod.POST, callback);
    }

    function setProxy(url:string, postData:Object, method:string, callback:Function):void {
        var cmpostdata = "";
        for (var key in postData) {
            cmpostdata += key + "=" + postData[key] + "&";
        }
        if (cmpostdata != "") {
            cmpostdata = cmpostdata.substr(0, cmpostdata.length - 1);
        }

        console.log("cm old solution =" + url + "?" + cmpostdata);

        var loader:egret.URLLoader = new egret.URLLoader();
        loader.addEventListener(egret.Event.COMPLETE, function () {
            console.log("cm old solution  =" + loader.data);
            var jsonObj = JSON.parse(loader.data);
            callback(jsonObj);
        }, this);
        var request:egret.URLRequest = new egret.URLRequest(url);
        request.method = method;
        request.data = new egret.URLVariables(cmpostdata);
        loader.load(request);
    }
}

module nest.cm.user {
    export function checkLogin(loginInfo:nest.user.LoginInfo, callback) {

        var postData = {};

        function checkAfter(resultData) {
            egretInfo = {egretUserId: resultData["data"]["id"]};

            callback(resultData["data"]);
        }

        function loginHandler(resultData) {
            if (resultData.ret == 1) {
                resultData["access_token"] = resultData["ssid"];

                //保存设备id
                if (!egret.localStorage.getItem("deviceid")) {
                    egret.localStorage.setItem("deviceid", resultData["deviceid"]);
                }

                nest.cm.loginAfter(resultData, checkAfter);
            }
        }

        function checkBefore(resultData) {
            if (resultData["status"] == 0) {
                postData["client_id"] = resultData["data"]["client_id"];
                postData["client_secret"] = resultData["data"]["client_secret"];
                postData["redirect_uri"] = resultData["data"]["redirect_uri"];

                nest.cm.callRuntime({
                    module: "user",
                    action: "checkLogin",
                    param: loginInfo,
                    postData: postData
                }, loginHandler);
            }
        }

        nest.cm.loginBefore(checkBefore);


    }

    /**
     * 调用渠道登录接口
     * @param loginInfo
     * @param callback
     * @callback-param  @see nest.user.LoginCallbackInfo
     */
    export function login(loginInfo:nest.user.LoginInfo, callback:Function) {
        var data = {module: "user", action: "login", param: loginInfo};
        nest.cm.callRuntime(data, callback);
    }
}
module nest.cm.iap {

    export var isFirst:boolean = true;

    /**
     * 支付
     * @param orderInfo
     * @param callback
     */
    export function pay(orderInfo:nest.iap.PayInfo, callback:Function) {
        var succInt = 0;
        var cancInt = -1;
        var failInt = -2;

        payBefore(orderInfo, function (data) {
            if (data["status"] == 0) {//成功
                if (nest.cm.iap.isFirst) {
                    CMPAY_EGRET.on('cmpay_order_complete', function (msg) {
                        console.log("cm old solution cmpay_order_complete  " + JSON.stringify(msg, null, 4));
                        if (msg["success"] == true) {
                            callback({"result": succInt});
                        }
                        else {
                            if (msg["ret"] == 2) {//取消
                                callback({"result": cancInt});
                            }
                            else {
                                callback({"result": failInt});
                            }
                        }
                    });
                    nest.cm.iap.isFirst = false;
                }

                var option = {
                    access_token: data["data"]["access_token"],                // 游戏服务器传给js 的access_token
                    client_id: data["data"]["client_id"],                 // 每个游戏单独申请的 client_id
                    product_id: data["data"]["product_id"],                // 每个游戏有自己的道具产品id
                    unit: data["data"]["unit"],                            // 个数, 一般是1
                    payload: data["data"]["payload"],                       // payload, 一般是空字符串或者其他
                    notify_url: data["data"]["notify_url"],                     // 用户支付完成后, 平台服务器向哪个地址发通知

                    /* 我是分界线, 上边的参数是下单时必填的, 下面的参数是前端展示用的 */

                    money: data["data"]["money"],                     // 金额, 仅供支付页面显示用
                    order_name: data["data"]["order_name"],             // 订单名称, 仅供支付页面显示用
                    game_icon: data["data"]["game_icon"],            // 游戏图标, 仅供支付页面显示用
                    game_name: data["data"]["game_name"]                    // 游戏名称, 仅供支付页面显示用
                };
                CMPAY_EGRET.purchase(option);
            }
            else {//失败
                callback({result: failInt});
            }


        });
    }

}

module nest.cm.share {

    /**
     * 是否支持分享
     * @param callback
     * @callback-param {status:0, share:0}
     */
    export function isSupport(callback:Function) {
        callback({status: 0, share: 0});
    }
}

module nest.cm.app {
    /**
     * 初始化浏览器快捷登陆需要的信息（目前只有猎豹可用，其他为空实现）
     * @param param
     */
    export function initDesktop(param:nest.app.IDesktopInfo) {
        egret.ExternalInterface.call("save_shortcut_info", JSON.stringify({
            token: String(Math.random()),
            value: JSON.stringify(param)
        }));
    }

    /**
     * 是否支持特定功能
     * @param callback
     * @callback-param  { status:"0" , attention :"1" , sendToDesktop : "1"}
     */
    export function isSupport(callback:Function) {
        callback({status: 0, sendToDesktop: 0});
    }
}

if (egret.MainContext.runtimeType == egret.MainContext.RUNTIME_NATIVE && !egret_native.getOption("egret.runtime.nest")) {
    CMPAY_DEBUG = false;
    nest.user.checkLogin = nest.cm.user.checkLogin;
    nest.iap.pay = nest.cm.iap.pay;
    nest.share.isSupport = nest.cm.share.isSupport;
    nest.app.isSupport = nest.cm.app.isSupport;
    nest.app.initDesktop = nest.cm.app.initDesktop;
}
