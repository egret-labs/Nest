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

var CMPAY_EGRET = (function(){
    var cmpay = {};

    var isDebug = false;

    if(typeof CMPAY_DEBUG === 'boolean'){
        isDebug = CMPAY_DEBUG;
    }else{
        CMPAY_DEBUG = false;
    }

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
    cmpay.type = 'egret_runtime';
    cmpay.ready = function(fn){
        fn();
    };
    cmpay.purchase = function(option){
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
    return cmpay;
})();