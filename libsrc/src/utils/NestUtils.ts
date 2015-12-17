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

module nest.utils {
    export var API_DOMAIN:string;

    export var APP_ID:number;

    export var DEBUG:boolean = false;

    export function changeMethod(version:string):void {
        console.log("nest use module : " + version);
        var arr = ["user", "iap", "share", "social", "app"];
        for (var i = 0; i < arr.length; i++) {
            var module = arr[i];
            if (nest[version] && nest[version][module]) {
                nest[module] = nest[version][module];
                if (DEBUG) {
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

    function debugFunction(module:string, key:string) {
        var fun = nest[module][key];
        var newFun:Function;
        if (key == "isSupport") {
            newFun = function (callback:Function) {
                egret.log("调用接口nest." + module + "." + key);
                var debugCallback = function (data) {
                    egret.log("获得nest." + module + "." + key + "接口返回 : " + JSON.stringify(data));
                    callback.call(null, data);
                };
                fun.call(null, debugCallback);
            };
        }
        else {
            newFun = function (info:any, callback:Function) {
                egret.log("调用接口nest." + module + "." + key);
                var debugCallback = function (data) {
                    egret.log("获得nest." + module + "." + key + "接口返回 : " + JSON.stringify(data));
                    callback.call(null, data);
                };
                fun.call(null, info, debugCallback);
            };
        }
        nest[module][key] = newFun;
    }

    export function isRuntime():boolean {
        return egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE;
    }

    export var $spid:number;

    export function getSpid():number {
        if ($spid == undefined) {
            $spid = parseInt(egret.getOption("egret.runtime.spid"));
        }
        return $spid;
    }

    var $channelTag:string;

    export function getChannelTag():string {
        if ($channelTag == undefined) {
            $channelTag = egret.getOption("channelTag");
        }
        return $channelTag;
    }

    var $isQQBrowser:boolean;

    export function isQQBrowser():boolean {
        if ($isQQBrowser == undefined) {
            $isQQBrowser = isTargetPlatform(9392);
        }
        return $isQQBrowser;
    }

    export function isTargetPlatform(target:number):boolean {
        return getSpid() == target;
    }
}