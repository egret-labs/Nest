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

module nest {
    export module easeuser {

        export var $getInfo:number;

        /**
         * 登录页面相关按钮信息
         */
        export interface ILoginTypes {
            /**
             * 登录页面所有的按钮相关信息
             */
            loginTypes:Array<ILoginType>;

            /**
             * 按钮点击后，需要调用此方法并传入相应的类型
             * @param loginType
             */
            onChoose:(loginType:string)=>void;
        }

        /**
         * 单个按钮的信息
         */
        export interface ILoginType {
            /**
             * 登录类型
             */
            loginType:string;

            /**
             * 不存在，则不需要显示具体的内容
             */
            accInfo ?: {
                nickName ?: string;
                avatarUrl ?: string;
            }
        }

        /**
         * 登录相关信息
         */
        export interface ILoginCallbacks {
            /**
             * 需要创建登录页面时回调，在接受到此回调后，需要根据回调参数去创建对应的登录按钮并显示到页面上。在各个按钮点击后，再调用 onChoose
             *
             * <pre>
             * //此处为伪代码，请按实际情况创建并增加监听
             * function onCreate(data:ILoginTypes):void {
             *     for (var i:number = 0; i < data.loginTypes.length; i++) {
             *         //根据 loginType 类型创建对应的按钮，如果能获取到 accInfo，则需要显示出头像，并且显示到舞台上
             *         var btn;
             *         btn.name = data.loginTypes[i].loginType;
             *
             *         btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
             *             data.onChoose(this.name);//请确保传入的参数对应为点击的参数
             *         }, btn);
             *     }
             * }
             * </pre>
             *
             * @param data 登录类型信息
             */
            onCreate(data:ILoginTypes):void;

            /**
             * 登录成功后回调
             * @param data 登录成功信息
             */
            onSuccess(data:nest.user.LoginCallbackInfo):void;

            /**
             * 登录失败后回调
             * @param data 登录失败信息
             */
            onFail(data:nest.core.ResultCallbackInfo):void;
        }

        var $loginInfo: ILoginCallbacks;

        var isFirst:boolean = true;
        var $loginTypes:Array<ILoginType>;

        /**
         * 登录
         * @param loginInfo 登录传递的信息，需要对 onCreate，onSuccess，onFail 进行响应
         */
        export function login(loginInfo:ILoginCallbacks):void {
            $loginInfo = loginInfo;

            //
            if (isFirst) {
                isFirst = false;

                nest.user.checkLogin({}, function (resultInfo:nest.user.LoginCallbackInfo) {
                    if (resultInfo.token) {
                        if (isLogout()) {//登出
                            callSupport();
                        }
                        else {
                            onSuccess(resultInfo);
                        }
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
                $getInfo = data.getInfo;

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

                    onCreate([{"loginType" : "default"}]);

                    //callLogin("");
                }
            })
        }

        function callLogin(type:string):void {
            //如果用户点击某个登录按钮，则传递loginType，否则不传
            var loginTypeInfo = {};
            if (type && type != "" && type != "default") {
                loginTypeInfo["loginType"] = type;
            }

            nest.user.login(loginTypeInfo, function (data) {
                if(data.token) {
                    //登录成功，获取用户token，并根据token获取用户id，之后进入游戏
                    clearLogout();

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

            if (isLogout()) {
                if ($loginTypes && $loginTypes.length) {
                    for (var i:number = 0; i < $loginTypes.length; i++) {
                        var info:ILoginType = $loginTypes[i];
                        info.accInfo = null;
                        $loginTypes[i] = info;
                    }
                }
            }

            $loginInfo.onCreate({"loginTypes":$loginTypes, onChoose:callLogin});
        }

        function onSuccess(data:nest.user.LoginCallbackInfo):void {
            $loginInfo.onSuccess(data);
        }

        function onFail(data:nest.core.ResultCallbackInfo):void {
            $loginInfo.onFail(data);
        }

        function isLogout():boolean {
            if (nest.utils.$isRuntime) {
                return egret.localStorage.getItem("egret_logout") == "1";
            }
            else {
                return window.localStorage.getItem("egret_logout") == "1";
            }
        }

        function clearLogout():void {
            if (nest.utils.$isRuntime) {
                egret.localStorage.setItem("egret_logout", null);
            }
            else {
                window.localStorage.setItem("egret_logout", null);
            }
        }
    }

    export module easeuser {
        /**
         * 登出接口
         * @param loginInfo 登出参数,没有可以传递{}
         * @param callback 回调函数
         * @callback-param   { result : 0 };
         * @example 以下代码调用渠道登出接口
         * <pre>
         *     nest.easeuser.logout({}, function (data){
         *         if(data.result == 0) {
         *             //登出成功,需要显示登陆界面供玩家重新登录
         *             //这里后续不需要继续调用nest.user.checkLogin
         *         }
         *         else {
         *             //登出失败,可能相应渠道不支持登出
         *         }
         *     });
         * </pre>
         */
        export function logout(loginInfo: nest.user.LoginInfo, callback:(data:nest.core.ResultCallbackInfo)=>void):void {
            var egretH5SdkCallback = function (data:nest.core.ResultCallbackInfo):void {
                if (data.result == 0) {
                    //登出保存登出状态
                    if (nest.utils.$isRuntime) {
                        egret.localStorage.setItem("egret_logout", "1");
                    }
                    else {
                        window.localStorage.setItem("egret_logout", "1");
                    }
                }

                callback(data);
            };
            nest.user.logout(loginInfo, egretH5SdkCallback);
        }
    }

    export module easeuser {
        export interface UserSupportCallbackInfo extends core.ResultCallbackInfo {
            /**
             * 是否支持获取用户信息
             */
            getInfo: number;
        }

        /**
         * 检测支持何种登录方式
         * @param info 请传递一个{}
         * @param callback 回调函数
         * @callback-param  @see nest.user.UserSupportCallbackInfo
         * @example 以下代码进行检测支持何种登录方式
         * <pre>
         *     nest.user.isSupport({}, function (data){
         *         if(data.result == 0) {
         *             //获取渠道是否支持获得用户信息接口,如果支持可以使用nest.user.getInfo获取用户信息
         *             var isSupportGetUserInfo = data.getInfo == 1;
         *         }
         *     });
         * </pre>
         */
        export function isSupport(info:Object, callback:(resultInfo:easeuser.UserSupportCallbackInfo)=>void):void {
            var callbackInfo = {"result": 0, "getInfo": $getInfo};

            callback(callbackInfo);
        }

        /**
         * 获取用户信息，目前只有qq浏览器runtime支持
         * @param callback 回调函数
         * @example 以下代码获取用户信息
         * <pre>
         *     nest.user.getInfo({}, function (data){
         *         if(data.result == 0) {
         *             var msg = data.msg;              //传回的提示信息
         *             var nickName = data.nickName;     //昵称
         *             var avatarUrl = data.avatarUrl;  //头像
         *             var sex = data.sex;              //性别, 0未知，1男，2女
         *             var city = data.city;            //城市
         *             var language = data.language;    //语言
         *             var isVip = data.isVip;          //是否vip, 1是，0不是
         *             var province = data.province;    //省份
         *             var country = data.country;      //国家
         *         }
         *     });
         * </pre>
         */
        export function getInfo(loginInfo:nest.user.LoginInfo, callback:(resultInfo:Object)=>void):void {
            nest.user.getInfo(loginInfo, callback);
        }
    }
}