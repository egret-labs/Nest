if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
    if (egret_native.getOption("egret.runtime.spid") == 10044
        || (!egret_native.getOption("egret.runtime.nest"))) {
        var CMPAY_EGRET = (function () {
            function empty() {
            }

            var cmpay = {
                on: empty,
                off: empty,
                ready: empty,
                isReady: false,
                fire: empty,
                purchase: empty,
                getVersion: empty,
                type: 'egret_runtime'
            };
            var readyListeners = [];
            cmpay.ready = function (fn) {
                if (cmpay.isReady) {
                    fn();
                } else {
                    readyListeners.push(fn);
                }
            };
            function callReady() {
                var rLen = readyListeners.length;
                for (var i = 0; i < rLen; ++i) {
                    readyListeners[i]();
                }
                readyListeners.length = 0;
            }

            function initOld() {

                var isDebug = false;

                if (typeof CMPAY_DEBUG === 'boolean') {
                    isDebug = CMPAY_DEBUG;
                } else {
                    CMPAY_DEBUG = false;
                }
                console.log('ssss:initOld:' + isDebug);

                var listeners = {};
                /*
                 FIXME:
                 接收来自webview 的消息
                 */
                egret.ExternalInterface.addCallback('webview_to_runtime_js_data', function (str) {
                    console.log('ssss:runtime-recv:' + str);
                    var msg;
                    try {
                        msg = JSON.parse(str);
                    } catch (e) {
                        return;
                    }
                    if (msg && msg.type) {
                        switch (msg.type) {
                            case 'cmpay_loaded':
                                cmpay.isReady = true;
                                callReady();
                                return;
                            case 'cmpay_invoke':
                                var token = msg.token;
                                var fn;
                                if (token && listeners.hasOwnProperty(token) && listeners[token] && typeof (fn = listeners[token].fn) === 'function') {
                                    if (!listeners[token].isPersist) {
                                        delete listeners[token];
                                    }
                                    fn.apply(null, msg.args);
                                }
                                return;
                        }
                    }
                });

                var url = 'http://game.liebao.cn/game/pay/part/cmpay-runtime-proxy-egret.html?';
                url += '_t=' + Math.floor(Date.now() / 3600 / 24 / 1000);
                if (isDebug) {
                    url += '&debug=1';
                }
                //var webviewId = 'cmpay_proxy_laya';
                /*
                 FIXME:
                 打开一个隐藏的webview
                 */
                //var webview = createWebview(webviewId, url, true);
                //webview.addJSCallback('layaRuntimeOnMessage', layaRuntimeOnMessage);
                egret.ExternalInterface.call('newWebViewInstance', JSON.stringify({
                    action: 'createHiddenWebView',
                    data: {
                        url: url
                    }
                }));
                console.log('ssss:runtime-create:' + url);

                function sendMessage(msg) {
                    var str;
                    try {
                        str = JSON.stringify(msg).replace(/"/g, '`');
                    } catch (e) {
                        return false;
                    }
                    console.log('ssss:runtime-send:' + str);
                    /*
                     FIXME:
                     以字符串参数str 调用webview 中的方法 layaRuntimeOnMessage
                     */
                    egret.ExternalInterface.call('newWebViewInstance', JSON.stringify({
                        action: 'callWebViewMethod',
                        data: {
                            methodName: 'egretRuntimeOnMessage',
                            paramStr: str
                        }
                    }));
                    //webview.callJS('layaRuntimeOnMessage', str);
                    //androidBridge.call('callJS',JSON.stringify({
                    //    name: webviewId,
                    //    method: 'layaRuntimeOnMessage',
                    //    args: str
                    //}));
                    //laya.ExternalInterface.call('newWebViewInstance', JSON.stringify({
                    //    action: 'callWebViewMethod',
                    //    data:{
                    //        methodName: 'layaRuntimeOnMessage',
                    //        paramStr: str
                    //    }
                    //}));
                    return true;
                }

                function cmpay_invoke(method, args) {
                    var len;
                    if (args && typeof args === 'object' && typeof (len = args.length) === 'number') {
                        var isOn = method === 'on';
                        var isOff = method === 'off';
                        for (var i = 0; i < len; ++i) {
                            var item = args[i];
                            if (typeof item === 'function') {
                                var token = String(Math.random());
                                if (!isOff) {
                                    listeners[token] = {
                                        isPersist: isOn,
                                        fn: item
                                    };
                                } else {
                                    delete listeners[token];
                                }
                                args[i] = {
                                    token: token
                                };
                            }
                        }
                    }
                    sendMessage({
                        type: 'cmpay_invoke',
                        args: args,
                        method: method
                    });
                }

                //cmpay.ready = function(fn){
                //    if(cmpay.isReady){
                //        fn();
                //    }else{
                //        readyListeners.push(fn);
                //    }
                //};

                function slice(args) {
                    var arr = [];
                    var len = args.length;
                    for (var i = 0; i < len; ++i) {
                        arr.push(args[i]);
                    }
                    return arr;
                }

                var methods = ['on', 'off', 'fire', 'purchase'];
                for (var i = methods.length - 1; i > -1; --i) {
                    (function (method) {
                        cmpay[method] = function () {
                            cmpay_invoke(method, slice(arguments));
                        };
                    })(methods[i]);
                }
            }

            function initNew() {

                var isDebug = false;

                if (typeof CMPAY_DEBUG === 'boolean') {
                    isDebug = CMPAY_DEBUG;
                } else {
                    CMPAY_DEBUG = false;
                }

                console.log('ssss:initNew:' + isDebug);

                function wsjLaunchPay(request, fn) {
                    var token = String(Math.random());
                    egret.ExternalInterface.addCallback('wsj_pay', function (response) {
                        var data;
                        try {
                            data = JSON.parse(response);
                        } catch (e) {
                        }
                        if (data && data.token === token) {
                            var wsjResponse;
                            try {
                                wsjResponse = JSON.parse(data.response);
                            } catch (e) {
                            }
                            fn(wsjResponse);
                        }
                    });
                    console.log('tttt:wsj_pay:' + JSON.stringify({
                            token: token,
                            request: request
                        }));
                    egret.ExternalInterface.call('wsj_pay', JSON.stringify({
                        token: token,
                        request: JSON.stringify(request)
                    }));
                }

                function param(obj) {
                    var arr = [];
                    for (var i in obj) {
                        if (obj.hasOwnProperty(i)) {
                            var val = obj[i];
                            var type = typeof val;
                            if (type === 'number' || type === 'string' || type === 'boolean') {
                                arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(val));
                            }
                        }
                    }
                    return arr.join('&');
                }

                function ajax(option, fn) {
                    var urlloader = new egret.URLLoader();
                    var urlreq = new egret.URLRequest();
                    if (option.method && option.method.toLowerCase() === 'post') {
                        urlreq.method = egret.URLRequestMethod.POST;
                    }
                    var postData = '';
                    if (option.data) {
                        if (typeof option.data === 'string') {
                            postData = option.data;
                        } else {
                            postData = param(option.data);
                        }
                        urlreq.data = new egret.URLVariables(postData);
                    }
                    urlreq.url = option.url;
                    urlloader.dataFormat = egret.URLLoaderDataFormat.TEXT;
                    urlloader.addEventListener(egret.Event.COMPLETE, function () {
                        console.log('tttt:netreq:complete:' + urlloader.data);
                        fn(urlloader.data);
                    });
                    console.log('tttt:netreq:' + urlreq.url + ':' + postData);
                    urlloader.load(urlreq);
                }

                function placeOrderProxy(option, fn) {
                    console.log('ssss:placeOrderProxy:' + JSON.stringify(option));
                    var token = option.data && option.data.access_token;
                    if (!token) {
                        fn(false, -1, '{"msg":"Token not provided."}');
                    } else {
                        if (token.length === 32 || token.slice(0, 3) === 'sdk') {
                            var p = {
                                token: token,
                                method: option.pay_method,
                                dev: option.debug ? 1 : null
                            };
                            var _d = option.data;
                            for (var i in _d) {
                                if (_d.hasOwnProperty(i) && i !== 'access_token') {
                                    p[i] = _d[i];
                                }
                            }
                            ajax({
                                method: 'POST',
                                url: 'http://gclogin.liebao.cn/api/native/order/pay',
                                data: p
                            }, fn);
                        } else {
                            ajax({
                                method: 'POST',
                                url: 'http://gc.liebao.cn/pay/topay.php',
                                data: {
                                    method: option.pay_method,
                                    args: param(option.data),
                                    dev: option.debug ? 1 : null
                                }
                            }, fn);
                        }
                    }
                }

                function placeOrder(option, fn) {
                    placeOrderProxy(option, function (responseText) {
                        var response;
                        var success = false;
                        var msg = 'Unkown error';
                        if (responseText) {
                            responseText = responseText.replace(/"transaction_id":(\d+)/, '"transaction_id":"$1"');
                            try {
                                response = JSON.parse(responseText);
                                success = true;
                            } catch (e) {
                                msg = 'Empty response';
                            }
                        }
                        var valid = success && response && response.data && response.data.args && response.data.args.goodsTokenUrl && response.ret === 1;
                        if (valid) {
                            var goodsTokenUrl = response.data.args.goodsTokenUrl;
                            if (goodsTokenUrl) {
                                msg = 'ok';
                            } else {
                                msg = 'Empty goods token url';
                            }
                        }
                        fn(valid, valid ? 0 : (response ? response.ret : -1), msg, response);
                    });
                }

                var loginListeners = {};
                cmpay.on = function (type, fn) {
                    var arr;
                    if (loginListeners.hasOwnProperty(type)) {
                        arr = loginListeners[type];
                    } else {
                        arr = loginListeners[type] = [];
                    }
                    arr.push(fn);
                };
                cmpay.off = function (type, fn) {
                    var arr;
                    if (loginListeners.hasOwnProperty(type)) {
                        arr = loginListeners[type];
                    }
                    var len = arr.length;
                    for (var i = 0; i < len; ++i) {
                        if (arr[i] === fn) {
                            arr.splice(i, 1);
                        }
                    }
                };
                cmpay.fire = function (type) {
                    if (loginListeners.hasOwnProperty(type)) {
                        var args = [].slice.call(arguments, 1);
                        var arr = loginListeners[type];
                        var len = arr.length;
                        var _arr = arr.slice();
                        for (var i = 0; i < len; ++i) {
                            var fn = _arr[i];
                            try {
                                fn.apply(null, args);
                            } catch (e) {
                            }
                        }
                    }
                };
                cmpay.isReady = true;
                //cmpay.type = 'egret_runtime';
                //cmpay.ready = function(fn){
                //    fn();
                //};
                cmpay.purchase = function (option) {
                    console.log('ssss:purchase:' + JSON.stringify(option));
                    placeOrder({
                        pay_method: 'wsjpay/sdk',
                        data: option,
                        debug: typeof option.debug !== 'undefined' ? option.debug : isDebug
                    }, function (success, code, msg, response) {
                        cmpay.fire('cmpay_order_placed', {
                            type: 'cmpay_order_placed',
                            transaction_id: response && response.data ? response.data.transaction_id : null,
                            ret: code,
                            msg: msg,
                            success: success,
                            response: response
                        });
                        if (success) {
                            wsjLaunchPay(response.data.args, function (wsjResponse) {
                                var ret = wsjResponse && typeof wsjResponse.resultCode === 'number' ? wsjResponse.resultCode : -99;
                                var paid = wsjResponse && wsjResponse.resultCode === 0;
                                cmpay.fire('cmpay_order_complete', {
                                    type: 'cmpay_order_complete',
                                    transaction_id: response.data.transaction_id,
                                    ret: ret,
                                    success: paid,
                                    payed: paid,
                                    paid: paid,
                                    wsjResponse: wsjResponse
                                });
                            });
                        } else {
                            cmpay.fire('cmpay_order_complete', {
                                type: 'cmpay_order_complete',
                                transaction_id: response && response.data ? response.data.transaction_id : null,
                                ret: -99,
                                success: false,
                                payed: false,
                                paid: false,
                                wsjResponse: null
                            });
                        }
                    });
                };
                callReady();
            }

            var version = false;
            cmpay.getVersion = function () {
                return version;
            };

            var to = egret.setTimeout(function () {
                if (version === false) {
                    initOld();
                } else {
                    initNew();
                }
            }, null, 100);
            egret.ExternalInterface.addCallback("get_game_sdk_version", function (ver) {
                egret.clearTimeout(to);
                console.log('ssss:get_game_sdk_version:' + JSON.stringify(arguments));
                version = ver;
                initNew();
            });
            egret.ExternalInterface.call("get_game_sdk_version", "");
            return cmpay;
        })();
    }
}
if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
    if (egret_native.getOption("egret.runtime.spid") == 10044
        || (!egret_native.getOption("egret.runtime.nest"))) {
        var CMGAME_EGRET = (function () {
            var CMGAME = {};

            function empty() {
            }

            function get_game_sdk_version(timeout, fn) {
                var version = false;
                var returned = false;
                var to = egret.setTimeout(function () {
                    if (returned) {
                        return;
                    }
                    returned = true;
                    fn(version);
                }, null, timeout);
                egret.ExternalInterface.addCallback("get_game_sdk_version", function (ver) {
                    console.log('ssss:get_game_sdk_version' + JSON.stringify(arguments));
                    egret.clearTimeout(to);
                    if (returned) {
                        return;
                    }
                    returned = true;
                    version = ver;
                    fn(version);
                });
                egret.ExternalInterface.call("get_game_sdk_version", "");
            }

            CMGAME.checkIsGameSDK = (function () {
                var checked = false;
                var isGameSDK = true;
                var verGameSDK = -1;
                var lock = false;
                var listeners = [];
                return function (fn) {
                    if (checked) {
                        egret.setTimeout(function () {
                            fn(isGameSDK, verGameSDK);
                        }, null, 1);
                    } else {
                        listeners.push(fn);
                        if (!lock) {
                            lock = true;
                            var clean = function () {
                                checked = true;
                                egret.setTimeout(function () {
                                    console.log('sssstttt:CMGAME.checkIsGameSDK call listeners');
                                    lock = false;
                                    for (var i = 0; i < listeners.length; ++i) {
                                        try {
                                            listeners[i](isGameSDK, verGameSDK);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }
                                    listeners.length = 0;
                                }, null, 1);
                            };
                            console.log('sssstttt:get_game_sdk_version()');
                            get_game_sdk_version(10 * 1000, function (ver) {
                                console.log('sssstttt:get_game_sdk_version():' + JSON.stringify(arguments));
                                if (ver && !isNaN(ver)) {
                                    verGameSDK = ver;
                                }
                                clean();
                            });
                        }
                    }
                };
            })();

            CMGAME.saveShortcutInfo = function (param, fn) {
                egret.ExternalInterface.call("save_shortcut_info", JSON.stringify({
                    token: String(Math.random()),
                    value: JSON.stringify(param)
                }));
            };

            CMGAME.pushIcon = function (param, fn) {
                param.title = param.Title;
                param.detailUrl = param.DetailUrl;
                param.picUrl = param.PicUrl;
                egret.ExternalInterface.call("push_icon", JSON.stringify(param));
            };

            CMGAME.dispatchGameLoginData = (function () {
                var callback;
                egret.ExternalInterface.addCallback("dispatchGameLoginData", function (str) {
                    console.log('sssstttt:dispatchGameLoginData:callback:' + str);
                    if (!callback) {
                        return;
                    }
                    var response = false;
                    if (typeof str === 'string') {
                        try {
                            response = JSON.parse(str);
                        } catch (e) {
                        }
                    } else {
                        response = str;
                    }
                    callback(response);
                    //egret.ExternalInterface.removeCallback("dispatchGameLoginData", o);
                    //fn.apply(null, arguments);
                });
                return function (param, fn) {
                    var _cb = callback;
                    callback = function (response) {
                        callback = _cb;
                        fn(response);
                    };
                    egret.ExternalInterface.call("dispatchGameLoginData",
                        JSON.stringify(param)
                    );
                };
            })();

            CMGAME.getGameSDKDeviceID = function () {
                throw 'Method not exists, use CMGAME_LAYA.getGameSDKDeviceIDAsync() instead.';
            };

            CMGAME.getGameSDKDeviceIDAsync = (function (fn) {
                var callback;
                egret.ExternalInterface.addCallback("get_device_info", function (str) {
                    if (!callback) {
                        return;
                    }
                    var response = false;
                    if (typeof str === 'string') {
                        try {
                            response = JSON.parse(str);
                        } catch (e) {
                        }
                    } else {
                        response = str;
                    }
                    callback(response);
                });
                return function (fn) {
                    var _cb = callback;
                    callback = function (response) {
                        callback = _cb;
                        fn(response);
                    };
                    egret.ExternalInterface.call("get_device_info", '');
                };
            })();

            return CMGAME;
        })();
    }
}
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
    var core;
    (function (core) {
        core.appId = parseInt(egret.getOption("appId"));
        /**
         * 启动Nest
         * @param info 启动参数
         * @param callback 启动完成回调
         */
        function startup(info, callback) {
            if (info.egretAppId != null) {
                core.appId = info.egretAppId;
            }
            callback({ "result": 0 });
        }
        core.startup = startup;
        function callCustomMethod(customInfo, callback) {
            var data = { module: "core", action: "callCustomMethod", param: customInfo };
            nest.callRuntime(data, callback);
        }
        core.callCustomMethod = callCustomMethod;
    })(core = nest.core || (nest.core = {}));
})(nest || (nest = {}));
/**
 * 登录功能
 *
 * 逻辑：
 * 1.在游戏中展示一张登录背景界面
 * 2.调用 checkLogin 函数判断是否已经登录过，如果登录过，进入步骤6，否则进入步骤3
 * 3.调用 isSupport 函数判断支持的登录类型，根据登录类型显示对应的登录图标
 * 4.用户点击登录图标后，调用 login 函数打开登录面板进行登录
 * 5.如果登录成功，进入步骤6
 * 6.退出登录界面，进入游戏
 *
 *
 * 登出功能：
 *
 * 逻辑：
 * 1.在游戏中放置一个“退出游戏”或者“切换账号”的按钮
 * 2.用户点击“退出游戏”图标后，调用 logout 函数
 * 3.在登出成功后，返回到登录逻辑的步骤1
 *
 *
 */
var nest;
(function (nest) {
    var user;
    (function (user) {
        /**
         * 检测是否已登录
         * @param loginInfo 请传递一个{}
         * @param callback
         * @callback-param  @see nest.user.LoginCallbackInfo
         */
        function checkLogin(loginInfo, callback) {
            var data = { module: "user", action: "checkLogin", param: loginInfo };
            nest.callRuntime(data, callback);
        }
        user.checkLogin = checkLogin;
        /**
         * 调用渠道登录接口
         * @param loginInfo
         * @param callback
         * @callback-param  @see nest.user.LoginCallbackInfo
         */
        function login(loginInfo, callback) {
            var data = { module: "user", action: "login", param: loginInfo };
            nest.callRuntime(data, callback, true);
        }
        user.login = login;
        /**
         * 登出接口
         * @param loginInfo 可以传递{}
         * @param callback
         * @callback-param   { result : 0 };
         */
        function logout(loginInfo, callback) {
            var nestVersion = egret_native.getOption("egret.runtime.nest");
            if (nestVersion >= 4 || nestVersion == "custom") {
                var data = { module: "user", action: "logout", param: loginInfo };
                nest.callRuntime(data, callback);
            }
            else {
                callback({ "result": 0 });
            }
        }
        user.logout = logout;
        /**
         * 检测支持何种登录方式
         * @param callback
         * @callback-param  @see nest.user.LoginCallbackInfo
         */
        function isSupport(callback) {
            var data = { module: "user", action: "isSupport" };
            nest.callRuntime(data, callback);
        }
        user.isSupport = isSupport;
        /**
         * 获取用户信息，目前只有qq浏览器支持
         * @param callback
         */
        function getInfo(callback) {
            var data = { module: "user", action: "getInfo" };
            nest.callRuntime(data, callback);
        }
        user.getInfo = getInfo;
    })(user = nest.user || (nest.user = {}));
})(nest || (nest = {}));
var nest;
(function (nest) {
    var iap;
    (function (iap) {
        /**
         * 支付
         * @param orderInfo
         * @param callback
         */
        function pay(orderInfo, callback) {
            var data = { module: "iap", action: "pay", "param": orderInfo };
            nest.callRuntime(data, callback);
        }
        iap.pay = pay;
    })(iap = nest.iap || (nest.iap = {}));
})(nest || (nest = {}));
var nest;
(function (nest) {
    var share;
    (function (share_1) {
        /**
         * 是否支持分享
         * @param callback
         * @callback-param {status:0, share:0}  share 1支持 0不支持
         */
        function isSupport(callback) {
            var data = { module: "share", action: "isSupport" };
            nest.callRuntime(data, callback);
        }
        share_1.isSupport = isSupport;
        /**
         * 分享
         * @param shareInfo
         * @param callback
         * @callback-param result 0 表示分享成功，-1表示用户取消
         */
        function share(shareInfo, callback) {
            var data = { module: "share", action: "share", param: shareInfo };
            nest.callRuntime(data, callback, true);
        }
        share_1.share = share;
    })(share = nest.share || (nest.share = {}));
})(nest || (nest = {}));
var nest;
(function (nest) {
    var social;
    (function (social) {
        function isSupport(callback) {
            var data = { module: "social", action: "isSupport" };
            nest.callRuntime(data, callback);
        }
        social.isSupport = isSupport;
        function getFriends(socialInfo, callback) {
            var data = { module: "social", action: "getFriends", param: socialInfo };
            nest.callRuntime(data, callback);
        }
        social.getFriends = getFriends;
        function openBBS(socialInfo, callback) {
            var data = { module: "social", action: "openBBS", param: socialInfo };
            nest.callRuntime(data, callback);
        }
        social.openBBS = openBBS;
    })(social = nest.social || (nest.social = {}));
})(nest || (nest = {}));
var nest;
(function (nest) {
    var app;
    (function (app) {
        /**
         * 是否支持特定功能
         * @param callback
         * @callback-param  { status:"0" , attention :"1" , sendToDesktop : "1"} attention|sendToDesktop 1支持 0不支持
         */
        function isSupport(callback) {
            var data = { module: "app", action: "isSupport" };
            nest.callRuntime(data, callback);
        }
        app.isSupport = isSupport;
        /**
         * 关注
         * @param appInfo
         * @param callback
         */
        function attention(appInfo, callback) {
            var data = { module: "app", action: "attention", param: appInfo };
            nest.callRuntime(data, callback);
        }
        app.attention = attention;
        /**
         * 退出游戏，回到 App 界面
         * @param appInfo
         * @param callback
         */
        function exitGame(appInfo, callback) {
            var data = { module: "app", action: "exitGame", param: appInfo };
            nest.callRuntime(data, callback);
        }
        app.exitGame = exitGame;
        /**
         * 发送到桌面
         * @param appInfo
         * @param callback
         * @param callback-param result 0表示添加桌面成功，-1表示添加失败
         */
        function sendToDesktop(appInfo, callback) {
            var data = { module: "app", action: "sendToDesktop", param: appInfo };
            nest.callRuntime(data, callback);
        }
        app.sendToDesktop = sendToDesktop;
        /**
         * 获取渠道信息
         * @param appInfo 获取信息参数,没有请传递{}
         * @param callback 回调函数
         * 回调参数:
         * {
         * "result": , //result为0说明成功
         * "contact": , //可用联系方式
         *   "qq": //qq联系方式数组[],如果没有响应联系方式将没有该字段
         *   "qqgroup": //qq群联系方式数组[],如果没有响应联系方式将没有该字段
         *   "weixin": //微信联系方式数组[],如果没有响应联系方式将没有该字段
         *   "email": //email联系方式数组[],如果没有响应联系方式将没有该字段
         * }
         */
        function getInfo(appInfo, callback) {
            var data = { module: "app", action: "getInfo", param: appInfo };
            nest.callRuntime(data, callback);
        }
        app.getInfo = getInfo;
    })(app = nest.app || (nest.app = {}));
})(nest || (nest = {}));
var nest;
(function (nest) {
    var externalArr = [];
    function callRuntime(data, callback, parallel) {
        if (parallel === void 0) { parallel = false; }
        var tag = "nest";
        if (parallel) {
            egret.ExternalInterface.addCallback(tag, function (data) {
                console.log(data);
                var obj = JSON.parse(data);
                callback(obj.data);
            });
            egret.ExternalInterface.call(tag, JSON.stringify(data));
        }
        else {
            externalArr.push({ "data": data, "callback": callback });
            _getData();
        }
    }
    nest.callRuntime = callRuntime;
    var isRunning = false;
    function _getData() {
        if (externalArr.length) {
            if (isRunning) {
                return;
            }
            isRunning = true;
            var info = externalArr.shift();
            var tag = "nest";
            egret.ExternalInterface.addCallback(tag, function (data) {
                console.log(data);
                var obj = JSON.parse(data);
                info["callback"](obj.data);
                isRunning = false;
                _getData();
            });
            egret.ExternalInterface.call(tag, JSON.stringify(info["data"]));
        }
    }
})(nest || (nest = {}));

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
var nest;
(function (nest) {
    var cm;
    (function (cm) {
        cm.spid = null;
        function getSpid() {
            if (cm.spid == null) {
                if (nest.core.appId == 85 || nest.core.appId == 88) {
                    cm.spid = 10044;
                }
                else {
                    cm.spid = 18287;
                }
                egret_native["setOption"]("egret.runtime.spid", cm.spid);
            }
            return cm.spid;
        }
        cm.getSpid = getSpid;
        function callRuntime(data, callback) {
            var deviceId;
            if (deviceId = egret.localStorage.getItem("deviceid")) {
                console.log("cm old local deviceid " + deviceId);
                if (deviceId.indexOf("{") >= 0) {
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
                var isFinish = false;
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
                            sendData(json["did"]);
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
        cm.callRuntime = callRuntime;
        function loginBefore(callback) {
            var postdata = {};
            var url = "http://api.egret-labs.org/games/www/getAppInfo.php/";
            url += nest.core.appId + "_" + getSpid();
            postdata["debug"] = 1;
            setProxy(url, postdata, egret.URLRequestMethod.GET, function (resultData) {
                callback(resultData);
            });
        }
        cm.loginBefore = loginBefore;
        function loginAfter(postdata, callback, isNew) {
            var sendData = {};
            sendData["access_token"] = postdata["access_token"];
            sendData["openid"] = postdata["openid"];
            var url = "http://api.egret-labs.org/games/www/game.php/";
            url += nest.core.appId + "_" + getSpid();
            sendData["runtime"] = 1;
            sendData["showGame"] = 1;
            if (isNew) {
                sendData["newLiebaoApi"] = 1;
            }
            //需要发送 runtime=1  showGame=1  access_token=  openid=
            setProxy(url, sendData, egret.URLRequestMethod.GET, function (resultData) {
                callback(resultData);
            });
        }
        cm.loginAfter = loginAfter;
        function payBefore(orderInfo, callback) {
            var url = "http://api.egret-labs.org/games/api.php";
            var postdata = {
                "action": "pay.buy",
                "id": egretInfo.egretUserId,
                "appId": nest.core.appId,
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
        cm.payBefore = payBefore;
        /**
         * @private
         * @param postdata
         * @param callback
         */
        function quickRegister(postdata, callback) {
            var url = "http://gclogin.liebao.cn/api/user/quick_register";
            setProxy(url, postdata, egret.URLRequestMethod.POST, callback);
        }
        function setProxy(url, postData, method, callback) {
            var cmpostdata = "";
            for (var key in postData) {
                cmpostdata += key + "=" + postData[key] + "&";
            }
            if (cmpostdata != "") {
                cmpostdata = cmpostdata.substr(0, cmpostdata.length - 1);
            }
            console.log("cm old solution =" + url + "?" + cmpostdata);
            var loader = new egret.URLLoader();
            loader.addEventListener(egret.Event.COMPLETE, function () {
                console.log("cm old solution  =" + loader.data);
                var jsonObj = JSON.parse(loader.data);
                callback(jsonObj);
            }, this);
            var request = new egret.URLRequest(url);
            request.method = method;
            request.data = new egret.URLVariables(cmpostdata);
            loader.load(request);
        }
    })(cm = nest.cm || (nest.cm = {}));
})(nest || (nest = {}));
var nest;
(function (nest) {
    var cm;
    (function (cm) {
        var user;
        (function (user) {
            function checkLogin(loginInfo, callback) {
                var postData = {};
                function checkAfter(resultData) {
                    egretInfo = { egretUserId: resultData["data"]["id"] };
                    resultData["data"]["result"] = resultData["status"];
                    callback(resultData["data"]);
                }
                function loginHandler(resultData) {
                    if (resultData.ret == 1) {
                        resultData["access_token"] = resultData["ssid"];
                        //保存设备id
                        if (!egret.localStorage.getItem("deviceid")) {
                            egret.localStorage.setItem("deviceid", resultData["deviceid"]);
                        }
                        nest.cm.loginAfter(resultData, checkAfter, false);
                    }
                    else {
                        callback({ "result": 1 });
                    }
                }
                function loginHandler1(resultData) {
                    console.log("cm old loginHandler1");
                    console.log(JSON.stringify(resultData, null, 4));
                    var sendData = {};
                    sendData["access_token"] = resultData["cp"]["token"];
                    sendData["openid"] = resultData["user"]["openid"];
                    //保存设备id
                    egret.localStorage.setItem("cm_token", sendData["access_token"]);
                    console.log("cm old loginHandler2");
                    nest.cm.loginAfter(sendData, checkAfter, true);
                }
                function checkBefore(resultData) {
                    if (resultData["status"] == 0) {
                        var tempData = resultData["data"];
                        postData["client_id"] = tempData["client_id"];
                        postData["client_secret"] = tempData["client_secret"];
                        postData["redirect_uri"] = tempData["redirect_uri"];
                        //调用初始化桌面快捷方式
                        nest.cm.app.initDesktop({
                            "Title": tempData["title"],
                            "DetailUrl": tempData["detailUrl"],
                            "PicUrl": tempData["picUrl"]
                        });
                        CMGAME_EGRET.checkIsGameSDK(function (isGameSDK, verGameSDK) {
                            if (isGameSDK) {
                                console.log("cm old checkIsGameSDK1");
                                var obj = {
                                    clientId: tempData["client_id"],
                                    clientSecret: tempData["client_secret"],
                                    redirectUri: tempData["redirect_uri"]
                                };
                                //保存设备id
                                if (egret.localStorage.getItem("cm_token")) {
                                }
                                console.log(JSON.stringify(obj, null, 4));
                                console.log("cm old checkIsGameSDK2");
                                CMGAME_EGRET.dispatchGameLoginData(obj, loginHandler1);
                            }
                            else {
                                console.log("cm old checkIsGameSDK2");
                                nest.cm.callRuntime({
                                    module: "user",
                                    action: "checkLogin",
                                    param: loginInfo,
                                    postData: postData
                                }, loginHandler);
                            }
                        });
                    }
                    else {
                        callback({ "result": 1 });
                    }
                }
                nest.cm.loginBefore(checkBefore);
            }
            user.checkLogin = checkLogin;
            /**
             * 调用渠道登录接口
             * @param loginInfo
             * @param callback
             * @callback-param  @see nest.user.LoginCallbackInfo
             */
            function login(loginInfo, callback) {
                var data = { module: "user", action: "login", param: loginInfo };
                nest.cm.callRuntime(data, callback);
            }
            user.login = login;
        })(user = cm.user || (cm.user = {}));
    })(cm = nest.cm || (nest.cm = {}));
})(nest || (nest = {}));
var nest;
(function (nest) {
    var cm;
    (function (cm) {
        var iap;
        (function (iap) {
            iap.isFirst = true;
            /**
             * 支付
             * @param orderInfo
             * @param callback
             */
            function pay(orderInfo, callback) {
                var succInt = 0;
                var cancInt = -1;
                var failInt = -2;
                cm.payBefore(orderInfo, function (data) {
                    if (data["status"] == 0) {
                        if (nest.cm.iap.isFirst) {
                            CMPAY_EGRET.on('cmpay_order_complete', function (msg) {
                                console.log("cm old solution cmpay_order_complete  " + JSON.stringify(msg, null, 4));
                                if (msg["success"] == true) {
                                    callback({ "result": succInt });
                                }
                                else {
                                    if (msg["ret"] == 2) {
                                        callback({ "result": cancInt });
                                    }
                                    else {
                                        callback({ "result": failInt });
                                    }
                                }
                            });
                            nest.cm.iap.isFirst = false;
                        }
                        var option = {
                            access_token: data["data"]["access_token"],
                            client_id: data["data"]["client_id"],
                            product_id: data["data"]["product_id"],
                            unit: data["data"]["unit"],
                            payload: data["data"]["payload"],
                            notify_url: data["data"]["notify_url"],
                            /* 我是分界线, 上边的参数是下单时必填的, 下面的参数是前端展示用的 */
                            money: data["data"]["money"],
                            order_name: data["data"]["order_name"],
                            game_icon: data["data"]["game_icon"],
                            game_name: data["data"]["game_name"] // 游戏名称, 仅供支付页面显示用
                        };
                        CMPAY_EGRET.purchase(option);
                    }
                    else {
                        callback({ result: failInt });
                    }
                });
            }
            iap.pay = pay;
        })(iap = cm.iap || (cm.iap = {}));
    })(cm = nest.cm || (nest.cm = {}));
})(nest || (nest = {}));
var nest;
(function (nest) {
    var cm;
    (function (cm) {
        var share;
        (function (share) {
            /**
             * 是否支持分享
             * @param callback
             * @callback-param {status:0, share:0}
             */
            function isSupport(callback) {
                callback({ status: 0, share: 0 });
            }
            share.isSupport = isSupport;
        })(share = cm.share || (cm.share = {}));
    })(cm = nest.cm || (nest.cm = {}));
})(nest || (nest = {}));
var nest;
(function (nest) {
    var cm;
    (function (cm) {
        var app;
        (function (app) {
            var desktopInfo;
            /**
             * 初始化浏览器快捷登陆需要的信息（目前只有猎豹可用，其他为空实现）
             * @param param
             */
            function initDesktop(param) {
                desktopInfo = param;
                egret.ExternalInterface.call("save_shortcut_info", JSON.stringify({
                    token: String(Math.random()),
                    value: JSON.stringify(param)
                }));
            }
            app.initDesktop = initDesktop;
            /**
             * 是否支持特定功能
             * @param callback
             * @callback-param  { status:"0" , attention :"1" , sendToDesktop : "1"}
             */
            function isSupport(callback) {
                if (CMPAY_EGRET.getVersion() != false && !isNaN(CMPAY_EGRET.getVersion()) && CMPAY_EGRET.getVersion() > 301030) {
                    callback({ status: 0, sendToDesktop: 1, attention: 0 });
                }
                else {
                    callback({ status: 0, sendToDesktop: 0, attention: 0 });
                }
            }
            app.isSupport = isSupport;
            /**
             * 发送到桌面
             * @param appInfo
             * @param callback
             * @param callback-param result 0表示添加桌面成功，-1表示添加失败
             */
            function sendToDesktop(appInfo, callback) {
                if (desktopInfo) {
                    egret.ExternalInterface.call("push_icon", JSON.stringify({
                        title: desktopInfo.Title,
                        detailUrl: desktopInfo.DetailUrl,
                        picUrl: desktopInfo.PicUrl
                    }));
                    callback({ result: 0 });
                }
                else {
                    callback({ result: -1 });
                }
            }
            app.sendToDesktop = sendToDesktop;
        })(app = cm.app || (cm.app = {}));
    })(cm = nest.cm || (nest.cm = {}));
})(nest || (nest = {}));
if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
    console.log("cm old 11111 ");
    console.log(egret_native.getOption("egret.runtime.spid"));
    console.log(egret_native.getOption("egret.runtime.nest"));
    console.log("cm old 22222 ");
    if (egret_native.getOption("egret.runtime.spid") == 10044
        || (!egret_native.getOption("egret.runtime.nest"))) {
        console.log("cm old u r in cm");
        var egretInfo;
        egret_native["setOption"]("channelTag", "liebao");
        CMPAY_DEBUG = false;
        nest.user.checkLogin = nest.cm.user.checkLogin;
        nest.iap.pay = nest.cm.iap.pay;
        nest.share.isSupport = nest.cm.share.isSupport;
        nest.app.isSupport = nest.cm.app.isSupport;
        nest.app.sendToDesktop = nest.cm.app.sendToDesktop;
    }
}

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

if (!("egret_native" in this)) {

    nest.user.checkLogin = function (loginInfo, callback) {
        EgretH5Sdk.checkLogin(callback, this);
    }

    nest.user.login = function (loginInfo, callback) {
        EgretH5Sdk.login(callback, this);

    }
}
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
    var h5;
    (function (h5) {
        h5.uid = undefined;
    })(h5 = nest.h5 || (nest.h5 = {}));
})(nest || (nest = {}));
if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
    nest.user.isSupport = function (callback) {
        var channelTag = egret.getOption("channelTag");
        var loginType = [];
        if (channelTag == "QQBrowser") {
            loginType.push("qq");
            loginType.push("wx");
        }
        var loginCallbackInfo = {
            "status": 0,
            "result": 0,
            "loginType": loginType,
            "token": undefined,
            "getInfo": 0
        };
        callback.call(null, loginCallbackInfo);
    };
    nest.user.checkLogin = function (loginInfo, callback) {
        var egretH5SdkCallback = function (data) {
            nest.h5.uid = data.id;
            var status = data.status;
            if (nest.h5.uid) {
                status = 0;
            }
            var loginCallbackInfo = {
                "status": status,
                "result": status,
                "loginType": undefined,
                "token": data.token
            };
            callback.call(null, loginCallbackInfo);
        };
        EgretH5Sdk.checkLogin(egretH5SdkCallback, null);
    };
    nest.user.login = function (loginInfo, callback) {
        var egretH5SdkCallback = function (data) {
            nest.h5.uid = data.id;
            var status = data.status;
            if (nest.h5.uid) {
                status = 0;
            }
            var loginCallbackInfo = {
                "status": status,
                "result": status,
                "loginType": undefined,
                "token": data.token
            };
            callback.call(null, loginCallbackInfo);
        };
        EgretH5Sdk.login(egretH5SdkCallback, null, loginInfo.loginType);
    };
    nest.user.logout = function (loginInfo, callback) {
        var egretH5SdkCallback = function (data) {
            var status = data.status;
            var result = status == 1 ? 0 : 1;
            callback.call(null, { "result": result });
        };
        EgretH5Sdk.logout(egretH5SdkCallback, null);
    };
    nest.iap.pay = function (orderInfo, callback) {
        if (nest.h5.uid) {
            orderInfo["appId"] = nest.core.appId;
            orderInfo["uId"] = nest.h5.uid;
            EgretH5Sdk.pay(orderInfo, function (data) {
                callback(data);
            }, this);
        }
    };
    nest.share.isSupport = function (callback) {
        var egretH5SdkCallback = function (data) {
            var status = data.status;
            var loginCallbackInfo = { "share": status };
            callback.call(null, loginCallbackInfo);
        };
        EgretH5Sdk.isOpenShare(nest.core.appId, nest.h5.uid, egretH5SdkCallback, null);
    };
    nest.share.share = function (shareInfo, callback) {
        var egretH5SdkCallback = function (data) {
            var status = data.status;
            if (status == 0) {
                status = -1;
            }
            else if (status == 1) {
                status = 0;
            }
            var loginCallbackInfo = { "status": status, "result": status };
            callback.call(null, loginCallbackInfo);
        };
        EgretH5Sdk.share(nest.core.appId, nest.h5.uid, shareInfo, egretH5SdkCallback, null);
    };
    nest.social.isSupport = function (callback) {
        //todo
        callback.call(null, { "result": 0, "getFriends": 0, "openBBS": 0 });
    };
    nest.social.getFriends = function (data, callback) {
        //todo
    };
    nest.social.openBBS = function (data, callback) {
        //todo
    };
    nest.app.isSupport = function (callback) {
        var egretH5SdkCallback = function (data) {
            var status = data.status;
            var loginCallbackInfo = { "attention": status };
            callback.call(null, loginCallbackInfo);
        };
        EgretH5Sdk.isOpenAttention(nest.core.appId, nest.h5.uid, egretH5SdkCallback, null);
    };
    nest.app.attention = function (appInfo, callback) {
        EgretH5Sdk.attention(nest.core.appId, nest.h5.uid);
        callback.call(null, { "result": 0 });
    };
    nest.app.sendToDesktop = function (appInfo, callback) {
        callback.call(null, { "result": -1 });
    };
    nest.app.getInfo = function (appInfo, callback) {
        var egretH5SdkCallback = function (data) {
            var callbackInfo = { result: 0, "contact": data.contact };
            callback.call(null, callbackInfo);
        };
        EgretH5Sdk.getCustomInfo(nest.core.appId, nest.h5.uid, egretH5SdkCallback, null);
    };
}

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
var NestForQQHall = (function () {
    function NestForQQHall() {
    }
    var d = __define,c=NestForQQHall,p=c.prototype;
    return NestForQQHall;
})();
egret.registerClass(NestForQQHall,'NestForQQHall');
var nest;
(function (nest) {
    var qqhall;
    (function (qqhall) {
        qqhall.login_call_type = 102;
        qqhall.login_back_call_type = 100;
        qqhall.pay_call_type = 101;
        qqhall.share_call_type = 104;
        qqhall.login_callback_type = 200;
        qqhall.pay_callback_type = 201;
        qqhall.share_callback_type = 204;
        qqhall.loginCallback = null;
        qqhall.payCallback = null;
        qqhall.shareCallback = null;
        qqhall.version = "V1.0.0";
        qqhall.loginNum = 0;
        qqhall.spid = 10835;
        function setProxy(url, postData, method, callback) {
            var postdata = "";
            for (var key in postData) {
                postdata += key + "=" + postData[key] + "&";
            }
            if (postdata != "") {
                postdata = postdata.substr(0, postdata.length - 1);
            }
            console.log("qq hall send : " + url + "?" + postdata);
            var loader = new egret.URLLoader();
            loader.addEventListener(egret.Event.COMPLETE, function () {
                console.log("qq hall get data : " + loader.data);
                var jsonObj = JSON.parse(loader.data);
                callback(jsonObj);
            }, this);
            var request = new egret.URLRequest(url);
            request.method = method;
            request.data = new egret.URLVariables(postdata);
            loader.load(request);
        }
        function payBefore(orderInfo, callback) {
            var url = "http://api.gz.1251278653.clb.myqcloud.com/games/api.php";
            var postdata = {
                "action": "pay.buy",
                "id": qqhall.userId,
                "appId": nest.core.appId,
                "time": Date.now(),
                "openid": qqhall.OpenId,
                "openkey": qqhall.OpenKey,
                "paytoken": qqhall.payToken,
                "runtime": 1
            };
            for (var k in orderInfo) {
                postdata[k] = orderInfo[k];
            }
            setProxy(url, postdata, egret.URLRequestMethod.GET, function (resultData) {
                callback(resultData);
            });
        }
        qqhall.payBefore = payBefore;
        function callHall(data) {
            var msg = JSON.stringify(data);
            console.log("NestForQQHall::HALL_EGRET_MSG_FROM " + msg);
            egret.ExternalInterface.call("HALL_EGRET_MSG_FROM", msg);
        }
        qqhall.callHall = callHall;
        egret.ExternalInterface.addCallback("HALL_EGRET_MSG_TO", function (data) {
            var info = JSON.parse(data);
            console.log("NestForQQHall::HALL_EGRET_MSG_TO " + info);
            switch (info.msgType) {
                case qqhall.login_callback_type:
                    if (info["accessToken"] == null) {
                        qqhall.loginNum++;
                        if (qqhall.loginNum >= 3) {
                            //彻底登陆失败
                            var loginCallbackInfo = {
                                "status": -1,
                                "result": -1,
                                "loginType": undefined,
                                "token": undefined
                            };
                            qqhall.loginCallback.call(null, loginCallbackInfo);
                            qqhall.loginCallback = null;
                            return;
                        }
                        //登录失败，尝试重新登陆
                        var loginInfo = "OpenId/OpenKey 为空";
                        callHall({ msgType: qqhall.login_back_call_type, msgVersion: qqhall.version, errorID: 1, loginInfoStr: loginInfo });
                        callHall({ msgType: qqhall.login_call_type, msgVersion: qqhall.version });
                        return;
                    }
                    if (qqhall.loginCallback) {
                        qqhall.gameType = info["msgType"];
                        qqhall.gameVersion = info["msgVersion"];
                        qqhall.OpenId = info["openId"];
                        qqhall.OpenKey = info["accessToken"];
                        qqhall.enterType = info["enterType"];
                        qqhall.enterId = info["enterId"];
                        qqhall.payToken = info["payToken"];
                        var loginInfo = "登录成功";
                        callHall({ msgType: qqhall.login_back_call_type, msgVersion: qqhall.version, errorID: 0, loginInfoStr: loginInfo });
                        var api = "http://api.gz.1251278653.clb.myqcloud.com/games/www/game.php/" + nest.core.appId + "_" + qqhall.spid;
                        var sendData = {};
                        sendData["openkey"] = qqhall.OpenKey;
                        sendData["openid"] = qqhall.OpenId;
                        sendData["paytoken"] = qqhall.payToken;
                        sendData["runtime"] = 1;
                        sendData["showGame"] = 1;
                        //需要发送 runtime=1 showGame=1 openkey= openid= paytoken=
                        setProxy(api, sendData, egret.URLRequestMethod.GET, function (resultData) {
                            console.log("loginCallbackInfo:" + JSON.stringify(resultData));
                            var data = resultData.data;
                            qqhall.userId = data.id;
                            qqhall.loginCallback.call(null, data);
                            qqhall.loginCallback = null;
                        });
                    }
                    break;
                case qqhall.pay_callback_type:
                    if (qqhall.payCallback) {
                        var result = -1;
                        var errorMsg; //todo
                        switch (info.payState) {
                            case -1: //未知问题
                            case 1: //用户取消
                            case 2:
                                qqhall.payOrderInfo = null;
                                qqhall.payCallback.call(null, { result: result, status: result });
                                qqhall.payCallback = null;
                                break;
                            case 0:
                                qqhall.iap.repay();
                                break;
                        }
                    }
                    break;
                case qqhall.share_callback_type:
                    if (qqhall.shareCallback) {
                        var result = info.errorid;
                        qqhall.shareCallback.call(null, { result: result, status: result });
                        qqhall.shareCallback = null;
                    }
                    break;
            }
        });
    })(qqhall = nest.qqhall || (nest.qqhall = {}));
})(nest || (nest = {}));
var nest;
(function (nest) {
    var qqhall;
    (function (qqhall) {
        var user;
        (function (user) {
            function isSupport(callback) {
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
            user.isSupport = isSupport;
            function checkLogin(loginInfo, callback) {
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
            user.checkLogin = checkLogin;
            function login(loginInfo, callback) {
                console.log("NestForQQHall::login");
                qqhall.loginCallback = callback;
                qqhall.callHall({ msgType: qqhall.login_call_type, msgVersion: qqhall.version });
            }
            user.login = login;
        })(user = qqhall.user || (qqhall.user = {}));
    })(qqhall = nest.qqhall || (nest.qqhall = {}));
})(nest || (nest = {}));
var nest;
(function (nest) {
    var qqhall;
    (function (qqhall) {
        var iap;
        (function (iap) {
            function pay(orderInfo, callback) {
                if (qqhall.payOrderInfo) {
                    return;
                }
                qqhall.payOrderInfo = orderInfo;
                qqhall.payBefore(orderInfo, function (data) {
                    data = data.data;
                    if (data["status"] == 0) {
                        callback.call(null, { result: 0, status: 0 });
                    }
                    else {
                        qqhall.payCallback = callback;
                        qqhall.callHall({
                            msgType: qqhall.pay_call_type,
                            msgVersion: "V1.0.0",
                            acctType: "",
                            zoneId: "",
                            payValue: data["qCoins"],
                            isCanChange: false //目前只支持可改（true）
                        });
                    }
                });
            }
            iap.pay = pay;
            /**
             * 大厅充值成功后，再次调用付费接口
             */
            function repay() {
                if (qqhall.payOrderInfo) {
                    var orderInfo = qqhall.payOrderInfo;
                    var callback = qqhall.payCallback;
                    qqhall.payBefore(orderInfo, function (data) {
                        data = data.data;
                        var result = data["status"];
                        callback.call(null, { result: result, status: result });
                    });
                    qqhall.payOrderInfo = null;
                    qqhall.payCallback = null;
                }
            }
            iap.repay = repay;
        })(iap = qqhall.iap || (qqhall.iap = {}));
    })(qqhall = nest.qqhall || (nest.qqhall = {}));
})(nest || (nest = {}));
var nest;
(function (nest) {
    var qqhall;
    (function (qqhall) {
        var app;
        (function (app) {
            function isSupport(callback) {
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
            app.isSupport = isSupport;
            function exitGame(callback) {
                //todo
                var status = 0;
                var loginCallbackInfo = {
                    "status": status,
                    "result": status
                };
                callback.call(null, loginCallbackInfo);
            }
            app.exitGame = exitGame;
            function attention(appInfo, callback) {
            }
            app.attention = attention;
            function sendToDesktop(appInfo, callback) {
            }
            app.sendToDesktop = sendToDesktop;
        })(app = qqhall.app || (qqhall.app = {}));
    })(qqhall = nest.qqhall || (nest.qqhall = {}));
})(nest || (nest = {}));
var nest;
(function (nest) {
    var qqhall;
    (function (qqhall) {
        var share;
        (function (share_1) {
            /**
             * 是否支持分享
             * @param callback
             * @callback-param {status:0, share:0}  share 1支持 0不支持
             */
            function isSupport(callback) {
                var status = 0;
                var loginCallbackInfo = {
                    "status": status,
                    "result": status,
                    "share": 1
                };
                callback.call(null, loginCallbackInfo);
            }
            share_1.isSupport = isSupport;
            /**
             * 分享
             * @param shareInfo
             * @param callback
             * @callback-param result 0 表示分享成功，-1表示用户取消
             */
            function share(shareInfo, callback) {
                qqhall.shareCallback = callback;
                qqhall.callHall({
                    msgType: qqhall.share_call_type,
                    msgVersion: "V1.0.0",
                    title: shareInfo.title,
                    summary: shareInfo.description,
                    imageLocalUrl: "",
                    targetUrl: shareInfo.url
                });
            }
            share_1.share = share;
        })(share = qqhall.share || (qqhall.share = {}));
    })(qqhall = nest.qqhall || (nest.qqhall = {}));
})(nest || (nest = {}));
var nest;
(function (nest) {
    var qqhall;
    (function (qqhall) {
        var social;
        (function (social) {
            function isSupport(callback) {
                var status = 0;
                var loginCallbackInfo = {
                    "status": status,
                    "result": status,
                    "getFriends": 0,
                    "openBBS": 0
                };
                callback.call(null, loginCallbackInfo);
            }
            social.isSupport = isSupport;
            function getFriends(socialInfo, callback) {
            }
            social.getFriends = getFriends;
            function openBBS(socialInfo, callback) {
            }
            social.openBBS = openBBS;
        })(social = qqhall.social || (qqhall.social = {}));
    })(qqhall = nest.qqhall || (nest.qqhall = {}));
})(nest || (nest = {}));
if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
    if (parseInt(egret.getOption("egret.runtime.spid")) == 10835) {
        //console.log("NestForQQHall::init");
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
    }
}

