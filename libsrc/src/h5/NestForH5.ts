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

module nest.h5 {
    export var uid:number = undefined;
}
if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
    nest.user.isSupport = function (callback:Function) {
        var channelTag = egret.getOption("channelTag");
        var loginType = [];
        if(channelTag == "QQBrowser") {
            loginType.push("qq");
            loginType.push("wx");
        }
        var loginCallbackInfo:nest.user.LoginCallbackInfo = {
            "status": 0,
            "result": 0,
            "loginType": loginType,
            "token": undefined,
            "getInfo": 0
        };
        callback.call(null, loginCallbackInfo);
    };

    nest.user.checkLogin = function (loginInfo:nest.user.LoginInfo, callback:Function) {
        var egretH5SdkCallback = function (data) {
            nest.h5.uid = data.id;
            var status = data.status;
            if (nest.h5.uid) {
                status = 0;
            }
            var loginCallbackInfo:nest.user.LoginCallbackInfo = {
                "status": status,
                "result": status,
                "loginType": undefined,
                "token": data.token
            };
            callback.call(null, loginCallbackInfo);
        };
        EgretH5Sdk.checkLogin(egretH5SdkCallback, null);
    };

    nest.user.login = function (loginInfo:nest.user.LoginInfo, callback:Function) {
        var egretH5SdkCallback = function (data) {
            nest.h5.uid = data.id;
            var status = data.status;
            if (nest.h5.uid) {
                status = 0;
            }
            var loginCallbackInfo:nest.user.LoginCallbackInfo = {
                "status": status,
                "result": status,
                "loginType": undefined,
                "token": data.token
            };
            callback.call(null, loginCallbackInfo);
        };
        EgretH5Sdk.login(egretH5SdkCallback, null, loginInfo.loginType);
    };

    nest.user.logout = function (loginInfo:nest.user.LoginInfo, callback:Function) {
        var egretH5SdkCallback = function (data) {
            var status = data.status;
            var result = status == 1 ? 0 : 1;
            callback.call(null, {"result":result});
        };
        EgretH5Sdk.logout(egretH5SdkCallback, null);
    };

    nest.iap.pay = function (orderInfo:nest.iap.PayInfo, callback:Function) {
        if (nest.h5.uid) {
            orderInfo["appId"] = nest.core.appId;
            orderInfo["uId"] = nest.h5.uid;
            EgretH5Sdk.pay(orderInfo,function(data) {
                callback(data);
                }, this);
        }
    };

    nest.share.isSupport = function (callback:Function) {
        var egretH5SdkCallback = function (data) {
            var status = data.status;
            var loginCallbackInfo = {"share": status};
            callback.call(null, loginCallbackInfo);
        };
        EgretH5Sdk.isOpenShare(nest.core.appId, nest.h5.uid, egretH5SdkCallback, null);
    };

    nest.share.share = function (shareInfo:nest.share.ShareInfo, callback:Function) {
        var egretH5SdkCallback = function (data) {
            var status = data.status;
            if (status == 0) {
                status = -1;
            }
            else if (status == 1) {
                status = 0;
            }
            var loginCallbackInfo = {"status": status, "result": status};
            callback.call(null, loginCallbackInfo);
        };
        EgretH5Sdk.share(nest.core.appId, nest.h5.uid, shareInfo, egretH5SdkCallback, null);
    };

    nest.social.isSupport = function (callback:Function) {
        //todo
        callback.call(null,{"result": 0, "getFriends":0, "openBBS":0});
    };

    nest.social.getFriends = function (data, callback:Function) {
        //todo
    };

    nest.social.openBBS = function (data, callback:Function) {
        //todo
    };

    nest.app.isSupport = function (callback:Function) {
        var egretH5SdkCallback = function (data) {
            var status = data.status;
            var loginCallbackInfo = {"attention": status};
            callback.call(null, loginCallbackInfo);
        };
        EgretH5Sdk.isOpenAttention(nest.core.appId, nest.h5.uid, egretH5SdkCallback, null);
    };

    nest.app.attention = function (appInfo:any, callback:Function) {
        EgretH5Sdk.attention(nest.core.appId, nest.h5.uid);
        callback.call(null, {"result": 0});
    };

    nest.app.sendToDesktop = function (appInfo:any, callback:Function) {
        callback.call(null, {"result": -1});
    };
}