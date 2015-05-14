var CMPAY_EGRET = (function(){
    function empty(){}
    var cmpay = {
        on: empty,
        off: empty,
        ready: empty,
        isReady: false,
        fire: empty,
        purchase: empty,
        type: 'egret_runtime'
    };
    var readyListeners = [];
    cmpay.ready = function(fn){
        if(cmpay.isReady){
            fn();
        }else{
            readyListeners.push(fn);
        }
    };
    function callReady(){
        var rLen = readyListeners.length;
        for(var i=0;i<rLen;++i){
            readyListeners[i]();
        }
        readyListeners.length = 0;
    }

    function initOld(){

        var isDebug = false;

        if(typeof CMPAY_DEBUG === 'boolean'){
            isDebug = CMPAY_DEBUG;
        }else{
            CMPAY_DEBUG = false;
        }
        console.log('ssss:initOld:' + isDebug);

        var listeners = {};
            /*
            FIXME:
                接收来自webview 的消息
            */
            egret.ExternalInterface.addCallback('webview_to_runtime_js_data' , function(str){
                console.log('ssss:runtime-recv:' + str);
                var msg;
                try{
                    msg = JSON.parse(str);
                }catch(e){
                    return;
                }
                if(msg && msg.type){
                    switch(msg.type){
                        case 'cmpay_loaded':
                            cmpay.isReady = true;
                            callReady();
                            return;
                        case 'cmpay_invoke':
                            var token = msg.token;
                            var fn;
                            if(token && listeners.hasOwnProperty(token) && listeners[token] && typeof (fn = listeners[token].fn) === 'function'){
                                if(!listeners[token].isPersist){
                                    delete listeners[token];
                                }
                                fn.apply(null, msg.args);
                            }
                            return;
                    }
                }
            });

            var url = 'http://game.liebao.cn/game/pay/part/cmpay-runtime-proxy-egret.html?';
            url += '_t=' + Math.floor(Date.now()/3600/24/1000);
            if(isDebug){
                url +='&debug=1';
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
                data:{
                    url: url
                }
            }));
            console.log('ssss:runtime-create:' + url);

            function sendMessage(msg){
                var str;
                try{
                    str = JSON.stringify(msg).replace(/"/g, '`');
                }catch(e){
                    return false;
                }
                console.log('ssss:runtime-send:' + str);
                /*
                FIXME:
                    以字符串参数str 调用webview 中的方法 layaRuntimeOnMessage
                */
                egret.ExternalInterface.call('newWebViewInstance', JSON.stringify({
                    action: 'callWebViewMethod',
                    data:{
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
            function cmpay_invoke(method, args){
                var len;
                if(args && typeof args === 'object' && typeof (len = args.length) === 'number'){
                    var isOn = method === 'on';
                    var isOff = method === 'off';
                    for(var i=0;i<len;++i){
                        var item = args[i];
                        if(typeof item === 'function'){
                            var token = String(Math.random());
                            if(!isOff){
                                listeners[token] = {
                                    isPersist: isOn,
                                    fn: item
                                };
                            }else{
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

            function slice(args){
                var arr = [];
                var len = args.length;
                for(var i=0;i<len;++i){
                    arr.push(args[i]);
                }
                return arr;
            }
            var methods = ['on','off','fire','purchase'];
            for(var i = methods.length-1;i>-1;--i){
                (function(method){
                    cmpay[method] = function(){
                        cmpay_invoke(method, slice(arguments));
                    };
                })(methods[i]);
            }
    }

    function initNew(){

        var isDebug = false;

        if(typeof CMPAY_DEBUG === 'boolean'){
            isDebug = CMPAY_DEBUG;
        }else{
            CMPAY_DEBUG = false;
        }

        console.log('ssss:initNew:' + isDebug);

        function wsjLaunchPay(request, fn){
            var token = String(Math.random());
            egret.ExternalInterface.addCallback('wsj_pay', function(response){
                var data;
                try{
                    data = JSON.parse(response);
                }catch(e){}
                if(data && data.token === token){
                    var wsjResponse;
                    try{
                        wsjResponse = JSON.parse(data.response);
                    }catch(e){}
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
        function ajax(option, fn){
            var urlloader = new egret.URLLoader();
            var urlreq = new egret.URLRequest();
            if(option.method && option.method.toLowerCase() === 'post'){
                urlreq.method = egret.URLRequestMethod.POST;
            }
            if(option.data){
                if(typeof option.data === 'string'){
                    urlreq.data = new egret.URLVariables(option.data);
                }else{
                    urlreq.data = new egret.URLVariables(param(option.data));
                }
            }
            urlreq.url = option.url;
            urlloader.dataFormat = egret.URLLoaderDataFormat.TEXT;
            urlloader.addEventListener(egret.Event.COMPLETE, function(){
                console.log('tttt:netreq:complete:' + urlloader.data);
                fn(urlloader.data);
            });
            console.log('tttt:netreq:' + urlreq.url);
            urlloader.load( urlreq );
        }
        function placeOrder(option, fn){
            var server = option.debug ? 'http://xpaydev.ksmobile.com' : 'http://xpay.ksmobile.com';
            ajax({
                method: 'POST',
                url: server + '/1/api/wsjpay/sdk/order',
                data: option.data
            }, function(responseText){
                var response;
                var success = false;
                var msg = 'Unkown error';
                if(responseText){
                    responseText = responseText.replace(/"transaction_id":(\d+)/,'"transaction_id":"$1"');
                    try{
                        response = JSON.parse(responseText);
                        success = true;
                    }catch(e){
                        msg = 'Empty response';
                    }
                }
                var valid = success && response && response.data && response.data.args && response.data.args.goodsTokenUrl && response.ret === 1;
                if(valid){
                    var goodsTokenUrl = response.data.args.goodsTokenUrl;
                    if(goodsTokenUrl){
                        msg = 'ok';
                    }else{
                        msg = 'Empty goods token url';
                    }
                }
                fn(valid, valid ? 0 : (response ? response.ret : -1), msg, response);
            });
        }
        var loginListeners = {};
        cmpay.on = function(type, fn) {
            var arr;
            if (loginListeners.hasOwnProperty(type)) {
                arr = loginListeners[type];
            } else {
                arr = loginListeners[type] = [];
            }
            arr.push(fn);
        };
        cmpay.off = function(type, fn) {
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
        cmpay.fire = function(type) {
            if (loginListeners.hasOwnProperty(type)) {
                var args = [].slice.call(arguments, 1);
                var arr = loginListeners[type];
                var len = arr.length;
                var _arr = arr.slice();
                for (var i = 0; i < len; ++i) {
                    var fn = _arr[i];
                    try {
                        fn.apply(null, args);
                    } catch (e) {}
                }
            }
        };
        cmpay.isReady = true;
        //cmpay.type = 'egret_runtime';
        //cmpay.ready = function(fn){
        //    fn();
        //};
        cmpay.purchase = function(option){
            console.log('ssss:purchase:' + JSON.stringify(option));
            placeOrder({
                data: {
                    access_token: option.access_token,
                    client_id : option.client_id,
                    product_id: option.product_id,
                    unit: option.unit,
                    payload : option.payload,
                    notify_url: option.notify_url
                },
                debug: typeof option.debug !== 'undefined' ? option.debug : isDebug
            },function(success, code, msg, response){
                cmpay.fire('cmpay_order_placed', {
                    type: 'cmpay_order_placed',
                    transaction_id: response && response.data ? response.data.transaction_id : null,
                    ret: code,
                    msg: msg,
                    success: success,
                    response: response
                });
                if(success){
                    wsjLaunchPay(response.data.args, function(wsjResponse){
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
                }else{
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
    var to = egret.setTimeout(function(){
        if(version === false){
            initOld();
        }else{
            initNew();
        }
    }, null, 100);
    egret.ExternalInterface.addCallback("get_game_sdk_version", function(ver) {
        egret.clearTimeout(to);
        console.log('ssss:get_game_sdk_version:' + JSON.stringify(arguments));
        version = ver;
        initNew();
    });
    egret.ExternalInterface.call("get_game_sdk_version", "");
    return cmpay;
})();