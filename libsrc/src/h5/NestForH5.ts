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

    export function changeMethod(version:string):void {
        var arr = ["user", "iap", "share", "social", "app"];
        for(var i = 0 ; i < arr.length ; i++){
            var module = arr[i];
            for(var method in nest[module]) {
                nest[module][method] = nest[version][module][method];
            }
        }
    }

    if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
        nest.core.startup = function (info:nest.core.StartupInfo, callback:Function) {
            if (info.egretAppId != null) {
                nest.core.appId = info.egretAppId;
            }
            if (info.version == 2) {
                //新版api
                changeMethod("h5_2");
                EgretH5Sdk.init({}, callback);
            }
            else {
                //旧版api
                changeMethod("h5");
                callback({"result": 0});
            }
        }
    }

    export module user {
        export function isSupport(callback:Function) {
            var channelTag = egret.getOption("channelTag");
            var loginType = [];
            if (channelTag == "QQBrowser") {
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
        }

        export function checkLogin(loginInfo:nest.user.LoginInfo, callback:Function) {
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
        }

        export function login(loginInfo:nest.user.LoginInfo, callback:Function) {
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
        }

        export function logout(loginInfo:nest.user.LoginInfo, callback:Function) {
            var egretH5SdkCallback = function (data) {
                var status = data.status;
                var result = status == 1 ? 0 : 1;
                callback.call(null, {"result": result});
            };
            EgretH5Sdk.logout(egretH5SdkCallback, null);
        }
    }

    export module iap {
        export function pay(orderInfo:nest.iap.PayInfo, callback:Function) {
            if (nest.h5.uid) {
                orderInfo["appId"] = nest.core.appId;
                orderInfo["uId"] = nest.h5.uid;
                EgretH5Sdk.pay(orderInfo, function (data) {
                    callback(data);
                }, this);
            }
        }
    }

    export module share {
        export function isSupport(callback:Function) {
            var egretH5SdkCallback = function (data) {
                var status = data.status;
                var loginCallbackInfo = {"share": status};
                callback.call(null, loginCallbackInfo);
            };
            EgretH5Sdk.isOpenShare(nest.core.appId, nest.h5.uid, egretH5SdkCallback, null);
        }

        export function share(shareInfo:nest.share.ShareInfo, callback:Function) {
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
        }
    }

    export module social {
        export function isSupport(callback:Function) {
            callback.call(null, {"result": 0, "getFriends": 0, "openBBS": 0});
        }

        export function getFriends(data, callback:Function) {
            //
        }

        export function openBBS(data, callback:Function) {
            //
        }
    }

    export module app {
        export function isSupport(callback:Function) {
            var egretH5SdkCallback = function (data) {
                var status = data.status;
                var loginCallbackInfo = {"attention": status};
                callback.call(null, loginCallbackInfo);
            };
            EgretH5Sdk.isOpenAttention(nest.core.appId, nest.h5.uid, egretH5SdkCallback, null);
        }

        export function attention(appInfo:any, callback:Function) {
            EgretH5Sdk.attention(nest.core.appId, nest.h5.uid);
            callback.call(null, {"result": 0});
        }

        export function sendToDesktop(appInfo:any, callback:Function) {
            callback.call(null, {"result": -1});
        }

        export function getInfo(appInfo:any, callback:Function) {
            var egretH5SdkCallback = function (data) {
                var callbackInfo = {result: 0, "contact": data.contact};
                callback.call(null, callbackInfo);
            };
            EgretH5Sdk.getCustomInfo(nest.core.appId, nest.h5.uid, egretH5SdkCallback, null);
        }
    }
}



//新版
module nest.h5_2 {
    export module user {
        export function isSupport(callback:Function) {
            var channelTag = egret.getOption("channelTag");
            var loginType = [];
            if (channelTag == "QQBrowser") {
                loginType.push("qq");
                loginType.push("wx");
            }
            var loginCallbackInfo:nest.user.LoginCallbackInfo = {
                "result": 0,
                "loginType": loginType,
                "token": undefined,
                "getInfo": 0
            };
            callback.call(null, loginCallbackInfo);
        }

        export function checkLogin(loginInfo:nest.user.LoginInfo, callback:Function) {
            EgretH5Sdk.checkLogin(loginInfo, callback);
        }

        export function login(loginInfo:nest.user.LoginInfo, callback:Function) {
            EgretH5Sdk.login(loginInfo, callback);
        }

        export function logout(loginInfo:nest.user.LoginInfo, callback:Function) {
            EgretH5Sdk.logout(loginInfo, callback);
        }

        export function getInfo(loginInfo:nest.user.LoginInfo, callback:Function) {
            callback.call(null, {"result": -2});
        }
    }

    export module iap {
        export function pay(orderInfo:nest.iap.PayInfo, callback:Function) {
            EgretH5Sdk.pay(orderInfo, callback);
        }
    }

    export module share {
        export function isSupport(callback:Function) {
            EgretH5Sdk.isSupportShare({}, callback);
        }

        export function setDefaultInfo(shareInfo:nest.share.ShareInfo, callback:Function) {
            shareInfo["imgUrl"] = shareInfo.img_url;
            EgretH5Sdk.share(shareInfo, callback);
        }

        export function share(shareInfo:nest.share.ShareInfo, callback:Function) {
            shareInfo["imgUrl"] = shareInfo.img_url;
            EgretH5Sdk.setShareDefaultData(shareInfo, callback);
        }
    }

    export module social {
        export function isSupport(callback:Function) {
            callback.call(null, {"result": 0, "getFriends": 0, "openBBS": 0});
        }

        export function getFriends(data, callback:Function) {
            callback.call(null, {"result": -2});
        }

        export function openBBS(data, callback:Function) {
            callback.call(null, {"result": -2});
        }
    }

    export module app {
        export function isSupport(callback:Function) {
            var egretH5SdkCallback = function (data) {
                var status = data.result;
                var loginCallbackInfo = {"attention": status, "getInfo": 1, "exitGame": 0, "sendToDesktop": 0};
                callback.call(null, loginCallbackInfo);
            };
            EgretH5Sdk.isSupportAttention({}, egretH5SdkCallback);
        }

        export function attention(appInfo:any, callback:Function) {
            EgretH5Sdk.attention({}, callback);
        }

        export function sendToDesktop(appInfo:any, callback:Function) {
            callback.call(null, {"result": -2});
        }

        export function exitGame(appInfo:any, callback:Function) {
            callback.call(null, {"result": -2});
        }

        export function getInfo(appInfo:any, callback:Function) {
            EgretH5Sdk.getCustomInfo({}, callback);
        }
    }
}