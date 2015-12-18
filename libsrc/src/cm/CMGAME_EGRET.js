if (nest.utils.$isRuntime) {
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