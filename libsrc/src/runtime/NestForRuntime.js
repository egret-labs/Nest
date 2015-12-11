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
    var runtime;
    (function (runtime) {
        var core;
        (function (core) {
            function startup(info, callback) {
                callback({ "result": 0 });
            }
            core.startup = startup;
            function callCustomMethod(customInfo, callback) {
                var data = { module: "core", action: "callCustomMethod", param: customInfo };
                callRuntime(data, callback);
            }
            core.callCustomMethod = callCustomMethod;
        })(core = runtime.core || (runtime.core = {}));
    })(runtime = nest.runtime || (nest.runtime = {}));
})(nest || (nest = {}));
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
exports.callRuntime = callRuntime;
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
exports._getData = _getData;
nest.core = nest.runtime.core;
