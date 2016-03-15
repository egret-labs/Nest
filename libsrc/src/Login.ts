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

module nest.user {
    export interface ICreate {
        loginTypes:Array<ILoginType>;
    }

    export interface ILoginType {
        loginType:string;

        accInfo ?: {
            nickName ?: string;
            avatarUrl ?: string;
        }
    }

    var loginInfo: {
        onCreate(data:ICreate):void;

        onSuccess(data:nest.user.LoginCallbackInfo);

        onFail(data:nest.core.ResultCallbackInfo);
    };

    var isFirst:boolean = true;
    var $loginTypes:Array<ILoginType>;
    export function resLogin(loginInfo1):void {
        loginInfo = loginInfo1;

        //
        if (isFirst) {
            isFirst = false;

            nest.user.checkLogin({}, function (resultInfo:nest.user.LoginCallbackInfo) {
                if (resultInfo.token) {
                    onSuccess(resultInfo);
                }
                else {
                    callSupport();
                }
            });
        }
        else {
            if ($loginTypes && $loginTypes.length) {
                onCreate($loginTypes);
            }
            else {
                callLogin("");
            }
        }
    }

    function callSupport():void {
        nest.user.isSupport({}, function (data) {
            //获取是否支持nest.user.getInfo接口，有该字段并且该字段值为1表示支持
            var getInfo = data.getInfo;
            //已经登录过的信息，该字段目前只有新版qq浏览器runtime有
            //如果有该字段，请放弃使用loginType字段，并用该字段获取可用的登录方式以及登录信息
            var loginTypes = <Array<ILoginType>>data.loginTypes;
            if(loginTypes && loginTypes.length) {
                onCreate(loginTypes);
            }
            else if (data.loginType && data.loginType.length) {
                //获取登录方式数组，如["qq","wx"]
                //开发者应该主动判断登录方式，如果返回了 null ，则表示没有特殊登录方式
                var loginType = data.loginType;

                var arr:Array<any> = [];
                for (var i:number = 0; i < loginType.length; i++) {
                    arr.push({"loginType" : loginType[i]});
                }

                onCreate(arr);
            }
            else {
                callLogin("");
            }
        })
    }

    function callLogin(type:string):void {
        //如果用户点击某个登录按钮，则传递loginType，否则不传
        var loginTypeInfo = {};
        if (type && type != "") {
            loginTypeInfo["loginType"] = type;
        }

        nest.user.login(loginTypeInfo, function (data) {
            if(data.token) {
                //登录成功，获取用户token，并根据token获取用户id，之后进入游戏
                //获取id代码请看Nest工程中的LoginView文件，这个代码请务必放在服务端实现
                var token = data.token;

                onSuccess(data);
            }
            else {
                //登录失败，需要重新登陆
                onFail(data);
            }
        })
    }

    //[{"loginType" : "qq", accInfo: {nickName: "user_name", "avatarUrl" : "a.png"}}]
    function onCreate(loginTypes:Array<ILoginType>):void {
        if ($loginTypes == null) {
            $loginTypes = loginTypes;
        }

        loginInfo.onCreate({"loginTypes":loginTypes});
    }

    function onSuccess(data:nest.user.LoginCallbackInfo):void {
        loginInfo.onSuccess(data);
    }

    function onFail(data:nest.core.ResultCallbackInfo):void {
        loginInfo.onFail(data);
    }
}