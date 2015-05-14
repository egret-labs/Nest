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

var VERSION = 0;
egret.ExternalInterface.addCallback("get_game_sdk_version", function (ver) {
    VERSION = ver;
});
egret.ExternalInterface.call("get_game_sdk_version", "");

module nest.cm.user {
    export function checkLogin(loginData:nest.user.LoginInfo, callback) {

        var client_id = "141717597";
        var client_secret = "5BDF8CEE843DFF7B90B3B9CE558D52D3";
        var redirect_uri = "emdrauthcallback://emdr";

        var postData = "client_id=" + client_id + "&client_secret=" + client_secret + "&redirect_uri=" + redirect_uri + "&type=1";
        var get_device_id_key = VERSION == 0 ? "getUid" : "get_device_info";
        egret.ExternalInterface.addCallback(get_device_id_key, function (id) {
            postData += "&deviceid=" + id;
            quickRegister(postData, callback);
        });
        egret.ExternalInterface.call(get_device_id_key, "");
    }


    function quickRegister(postdata, callback) {
        var cmpostdata = postdata;
        var cmcallback = function (data) {
            callback(data);
        }

        var url:string = "http://gclogin.liebao.cn/api/user/quick_register";
        var loader:egret.URLLoader = new egret.URLLoader();
        loader.addEventListener(egret.Event.COMPLETE, function () {
            console.log(loader.data);
            var jsonObj = JSON.parse(loader.data);
            if (jsonObj.ret == 1) {
                //touchTag=true;
                egret.localStorage.setItem("ssid", jsonObj.ssid);
                egret.localStorage.setItem("deviceid", jsonObj.deviceid);
                if (typeof cmcallback == "function") {
                    cmcallback({openid: jsonObj.openid});
                }
            } else if (jsonObj.ret == 12005) {
                //已经注册过了
            }
        }, this);
        var request:egret.URLRequest = new egret.URLRequest(url);
        request.method = egret.URLRequestMethod.POST;
        request.data = new egret.URLVariables(postdata);
        loader.load(request);
    }


}


if (true) {
    nest.user.checkLogin = nest.cm.user.checkLogin;
}
