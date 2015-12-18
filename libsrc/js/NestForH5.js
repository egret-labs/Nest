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
var nest;
(function (nest) {
    var utils;
    (function (utils) {
        /*
         * @private
         */
        utils.$DEBUG_LOG = false;
        /*
         * @private
         */
        function $changeMethod(version) {
            //console.log("[Nest]use module : " + version);
            var arr = ["user", "iap", "share", "social", "app"];
            for (var i = 0; i < arr.length; i++) {
                var module = arr[i];
                if (nest[version] && nest[version][module]) {
                    nest[module] = nest[version][module];
                    if (utils.$DEBUG_LOG) {
                        for (var key in nest[module]) {
                            var fun = nest[module][key];
                            if (typeof fun == "function") {
                                debugFunction(module, key);
                            }
                        }
                    }
                }
            }
        }

        utils.$changeMethod = $changeMethod;
        function debugFunction(module, key) {
            var fun = nest[module][key];
            var newFun;
            if (key == "isSupport") {
                newFun = function (callback) {
                    console.log("[Nest]调用接口nest." + module + "." + key);
                    var debugCallback = function (data) {
                        console.log("[Nest]获得nest." + module + "." + key + "接口返回 : " + JSON.stringify(data));
                        callback.call(null, data);
                    };
                    fun.call(null, debugCallback);
                };
            }
            else {
                newFun = function (info, callback) {
                    console.log("[Nest]调用接口nest." + module + "." + key);
                    var debugCallback = function (data) {
                        console.log("[Nest]获得nest." + module + "." + key + "接口返回 : " + JSON.stringify(data));
                        callback.call(null, data);
                    };
                    fun.call(null, info, debugCallback);
                };
            }
            nest[module][key] = newFun;
        }
        /*
         * @private
         */
        function $getSpid() {
            if (utils.$spid == undefined) {
                utils.$spid = parseInt($getOption("egret.runtime.spid"));
            }
            return utils.$spid;
        }

        utils.$getSpid = $getSpid;
        /*
         * @private
         */
        var $channelTag;
        /*
         * @private
         */
        function $getChannelTag() {
            if ($channelTag == undefined) {
                $channelTag = $getOption("channelTag");
            }
            return $channelTag;
        }

        utils.$getChannelTag = $getChannelTag;
        /*
         * @private
         */
        var $QQBrowser;
        /*
         * @private
         */
        function $isQQBrowser() {
            if ($QQBrowser == undefined) {
                $QQBrowser = $isTargetPlatform(9392);
            }
            return $QQBrowser;
        }

        utils.$isQQBrowser = $isQQBrowser;
        /*
         * @private
         */
        function $isTargetPlatform(target) {
            return $getSpid() == target;
        }

        utils.$isTargetPlatform = $isTargetPlatform;
        /*
         * @private
         */
        function $getOption(key) {
            if (window.location) {
                var search = location.search;
                if (search == "") {
                    return "";
                }
                search = search.slice(1);
                var searchArr = search.split("&");
                var length = searchArr.length;
                for (var i = 0; i < length; i++) {
                    var str = searchArr[i];
                    var arr = str.split("=");
                    if (arr[0] == key) {
                        return arr[1];
                    }
                }
            }
            return "";
        }

        utils.$getOption = $getOption;
    })(utils = nest.utils || (nest.utils = {}));
})(nest || (nest = {}));

var nest;
(function (nest) {
    var h5;
    (function (h5) {
        h5.uid = undefined;
        var user;
        (function (user) {
            function isSupport(callback) {
                var loginType = [];
                if (nest.utils.$isQQBrowser()) {
                    loginType.push("qq");
                    loginType.push("wx");
                }
                var loginCallbackInfo = {
                    "result": 0,
                    "loginType": loginType,
                    "getInfo": 0
                };
                callback.call(null, loginCallbackInfo);
            }

            user.isSupport = isSupport;
            function checkLogin(loginInfo, callback) {
                var egretH5SdkCallback = function (data) {
                    nest.h5.uid = data.id;
                    var status = data.status;
                    if (nest.h5.uid) {
                        status = 0;
                    }
                    var loginCallbackInfo = {
                        "result": status,
                        "token": data.token
                    };
                    callback.call(null, loginCallbackInfo);
                };
                EgretH5Sdk.checkLogin(egretH5SdkCallback, null);
            }

            user.checkLogin = checkLogin;
            function login(loginInfo, callback) {
                var egretH5SdkCallback = function (data) {
                    nest.h5.uid = data.id;
                    var status = data.status;
                    if (nest.h5.uid) {
                        status = 0;
                    }
                    var loginCallbackInfo = {
                        "result": status,
                        "token": data.token
                    };
                    callback.call(null, loginCallbackInfo);
                };
                EgretH5Sdk.login(egretH5SdkCallback, null, loginInfo.loginType);
            }

            user.login = login;
            function logout(loginInfo, callback) {
                var egretH5SdkCallback = function (data) {
                    var status = data.status;
                    var result = status == 1 ? 0 : 1;
                    callback.call(null, {"result": result});
                };
                EgretH5Sdk.logout(egretH5SdkCallback, null);
            }

            user.logout = logout;
        })(user = h5.user || (h5.user = {}));
        var iap;
        (function (iap) {
            function pay(orderInfo, callback) {
                if (nest.h5.uid) {
                    orderInfo["appId"] = nest.utils.$APP_ID;
                    orderInfo["uId"] = nest.h5.uid;
                    EgretH5Sdk.pay(orderInfo, function (data) {
                        callback(data);
                    }, this);
                }
            }

            iap.pay = pay;
        })(iap = h5.iap || (h5.iap = {}));
        var share;
        (function (share_1) {
            function isSupport(callback) {
                var egretH5SdkCallback = function (data) {
                    var status = data.status;
                    var loginCallbackInfo = {"share": status};
                    callback.call(null, loginCallbackInfo);
                };
                EgretH5Sdk.isOpenShare(nest.utils.$APP_ID, nest.h5.uid, egretH5SdkCallback, null);
            }

            share_1.isSupport = isSupport;
            function share(shareInfo, callback) {
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
                EgretH5Sdk.share(nest.utils.$APP_ID, nest.h5.uid, shareInfo, egretH5SdkCallback, null);
            }

            share_1.share = share;
        })(share = h5.share || (h5.share = {}));
        var social;
        (function (social) {
            function isSupport(callback) {
                callback.call(null, {"result": 0, "getFriends": 0, "openBBS": 0});
            }

            social.isSupport = isSupport;
            function getFriends(data, callback) {
                //
            }

            social.getFriends = getFriends;
            function openBBS(data, callback) {
                //
            }

            social.openBBS = openBBS;
        })(social = h5.social || (h5.social = {}));
        var app;
        (function (app) {
            function isSupport(callback) {
                var egretH5SdkCallback = function (data) {
                    var status = data.status;
                    var loginCallbackInfo = {"attention": status};
                    callback.call(null, loginCallbackInfo);
                };
                EgretH5Sdk.isOpenAttention(nest.utils.$APP_ID, nest.h5.uid, egretH5SdkCallback, null);
            }

            app.isSupport = isSupport;
            function attention(appInfo, callback) {
                EgretH5Sdk.attention(nest.utils.$APP_ID, nest.h5.uid);
                callback.call(null, {"result": 0});
            }

            app.attention = attention;
            function sendToDesktop(appInfo, callback) {
                callback.call(null, {"result": -1});
            }

            app.sendToDesktop = sendToDesktop;
            function getInfo(appInfo, callback) {
                var egretH5SdkCallback = function (data) {
                    var callbackInfo = {result: 0, "contact": data.contact};
                    callback.call(null, callbackInfo);
                };
                EgretH5Sdk.getCustomInfo(nest.utils.$APP_ID, nest.h5.uid, egretH5SdkCallback, null);
            }

            app.getInfo = getInfo;
        })(app = h5.app || (h5.app = {}));
    })(h5 = nest.h5 || (nest.h5 = {}));
})(nest || (nest = {}));
//新版
var nest;
(function (nest) {
    var h5_2;
    (function (h5_2) {
        var user;
        (function (user) {
            function isSupport(callback) {
                var loginType = [];
                if (nest.utils.$isQQBrowser()) {
                    loginType.push("qq");
                    loginType.push("wx");
                }
                var loginCallbackInfo = {
                    "result": 0,
                    "loginType": loginType,
                    "getInfo": 0
                };
                callback.call(null, loginCallbackInfo);
            }

            user.isSupport = isSupport;
            function checkLogin(loginInfo, callback) {
                EgretH5Sdk.checkLogin(loginInfo, callback);
            }

            user.checkLogin = checkLogin;
            function login(loginInfo, callback) {
                EgretH5Sdk.login(loginInfo, callback);
            }

            user.login = login;
            function logout(loginInfo, callback) {
                EgretH5Sdk.logout(loginInfo, callback);
            }

            user.logout = logout;
            function getInfo(loginInfo, callback) {
                callback.call(null, {"result": -2});
            }

            user.getInfo = getInfo;
        })(user = h5_2.user || (h5_2.user = {}));
        var iap;
        (function (iap) {
            function pay(orderInfo, callback) {
                EgretH5Sdk.pay(orderInfo, callback);
            }

            iap.pay = pay;
        })(iap = h5_2.iap || (h5_2.iap = {}));
        var share;
        (function (share_2) {
            function isSupport(callback) {
                var supportShareCallback = function (data) {
                    var status = data.result;
                    var shareCallbackInfo = {"share": status, "msg": data.msg};
                    callback.call(null, shareCallbackInfo);
                };
                EgretH5Sdk.isSupportShare({}, supportShareCallback);
            }

            share_2.isSupport = isSupport;
            function setDefaultData(shareInfo, callback) {
                shareInfo["imgUrl"] = shareInfo.img_url;
                EgretH5Sdk.setShareDefaultData(shareInfo, callback);
            }

            share_2.setDefaultData = setDefaultData;
            function share(shareInfo, callback) {
                shareInfo["imgUrl"] = shareInfo.img_url;
                EgretH5Sdk.share(shareInfo, callback);
            }

            share_2.share = share;
        })(share = h5_2.share || (h5_2.share = {}));
        var social;
        (function (social) {
            function isSupport(callback) {
                callback.call(null, {"result": 0, "getFriends": 0, "openBBS": 0});
            }

            social.isSupport = isSupport;
            function getFriends(data, callback) {
                callback.call(null, {"result": -2});
            }

            social.getFriends = getFriends;
            function openBBS(data, callback) {
                callback.call(null, {"result": -2});
            }

            social.openBBS = openBBS;
        })(social = h5_2.social || (h5_2.social = {}));
        var app;
        (function (app) {
            function isSupport(callback) {
                var egretH5SdkCallback = function (data) {
                    var status = data.result;
                    var loginCallbackInfo = {"attention": status, "getInfo": 1, "exitGame": 0, "sendToDesktop": 0};
                    callback.call(null, loginCallbackInfo);
                };
                EgretH5Sdk.isSupportAttention({}, egretH5SdkCallback);
            }

            app.isSupport = isSupport;
            function attention(appInfo, callback) {
                EgretH5Sdk.attention({}, callback);
            }

            app.attention = attention;
            function sendToDesktop(appInfo, callback) {
                callback.call(null, {"result": -2});
            }

            app.sendToDesktop = sendToDesktop;
            function exitGame(appInfo, callback) {
                callback.call(null, {"result": -2});
            }

            app.exitGame = exitGame;
            function getInfo(appInfo, callback) {
                EgretH5Sdk.getCustomInfo({}, callback);
            }

            app.getInfo = getInfo;
        })(app = h5_2.app || (h5_2.app = {}));
    })(h5_2 = nest.h5_2 || (nest.h5_2 = {}));
})(nest || (nest = {}));

nest.core = nest.core || {};
nest.core.startup = function (info, callback) {
    var api = "http://api.egret-labs.org/v2/";
    nest.utils.$API_DOMAIN = api;
    nest.utils.$APP_ID = info.egretAppId;
    nest.utils.$DEBUG_LOG = info.debug;
    var domain = nest.utils.$getOption("egretSdkDomain");
    if (domain) {
        nest.utils.$API_DOMAIN = domain + "/";
    }
    if (info.version == 2) {
        //新版api
        nest.utils.$changeMethod("h5_2");
        //加载h5sdk
        var url = nest.utils.$API_DOMAIN + "misc/scripts/egreth5sdk.js";
        var s = document.createElement('script');
        if (s.hasOwnProperty("async")) {
            s.async = false;
        }
        s.src = url;
        s.id = "egreth5sdk";
        s.addEventListener('load', function () {
            this.removeEventListener('load', arguments.callee, false);
            EgretH5Sdk.init({}, callback);
        }, false);
        s.addEventListener('error', function () {
            s.parentNode.removeChild(s);
            this.removeEventListener('error', arguments.callee, false);
            callback({"result": -2});
        }, false);
        document.head.appendChild(s);
        return;
    }
    else {
        //旧版api
        nest.utils.$changeMethod("h5");
    }
    callback({"result": 0});
};
