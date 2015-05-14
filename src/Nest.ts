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


/**
 * 登录功能
 *
 * 逻辑：
 * 1.在游戏中展示一张登录背景界面
 * 2.调用 checkLogin 函数判断是否已经登录过，如果登录过，进入步骤5，否则进入步骤3
 * 3.调用 isSupport 函数判断支持的登录类型，根据登录类型显示对应的登录图标
 * 4.用户点击登录图标后，调用 login 函数打开登录面板进行登录
 * 5.登录成功后，隐藏登录按钮，显示切换账号、选择服务器、进入游戏三个按钮（可缩减），或者直接进入步骤7进入游戏
 * 6.如果用户点击了切换账号，应回到步骤3，如果用户点击了进入游戏按钮，应该进入步骤7
 * 7.退出登录界面，进入游戏
 *
 *
 * API变化：
 * 1. nest.user.init 接口被废弃，改用 egret.user.login
 */
module nest.user {

    /**
     * 检测是否已登录
     * @param loginInfo 请传递一个null
     * @param callback
     * @callback-param  @see nest.user.LoginCallbackInfo
     */
    export function checkLogin(loginInfo:LoginInfo, callback:Function) {

        var version = egret_native.getOption("egret.runtime.nest");
        if (version > 1) {//todo  暂时一处兼容代码，下个版本删除
            var data = {module: "user", action: "checkLogin", param: loginInfo};
            callRuntime(data, callback);
        }
        else {
            var result = {token: null, status: "-1"}
            callback(result);
        }


    }

    /**
     * 调用渠道登录接口
     * @param loginInfo
     * @param callback
     * @callback-param  @see nest.user.LoginCallbackInfo
     */
    export function login(loginInfo:LoginInfo, callback:Function) {

        var data = {module: "user", action: "login", param: loginInfo};
        callRuntime(data, callback);

    }


    /**
     * 检测支持何种登录方式
     * @param callback
     * @callback-param  @see nest.user.LoginCallbackInfo
     */
    export function isSupport(callback:Function) {
        var data = {module: "user", action: "isSupport"};
        callRuntime(data, callback);
    }


    /**
     * 登录接口传递参数
     *
     */
    export interface LoginInfo {

        /**
         * 登录类型：如 QQ登录，微信支付
         */
        loginType?:string;

    }

    export interface LoginCallbackInfo {

        /**
         * 状态值，0表示成功
         * 该值未来可能会被废弃
         */
        status:string;

        /**
         * 结果值，0表示成功
         */
        result:string;

        /**
         * isSupport 函数返回。
         * 登录方式。
         * 以QQ浏览器为例，返回 ["qq","wx"]
         * 开发者应该主动判断登录方式，如果返回了 null ，则表示没有特殊登录方式
         */
        loginType:Array<string>

        /**
         * checkLogin , login 函数返回。
         * 用户 token 信息，如果checkLogin函数中没有token则表示用户尚未登录
         */
        token:string;


    }


}


module nest.iap {

    /**
     * 支付
     * @param orderInfo
     * @param callback
     */
    export function pay(orderInfo:PayInfo, callback:Function) {

        var data = {module: "iap", action: "pay", "param": orderInfo};
        callRuntime(data, callback);

    }


    export interface PayInfo {

        goodsId:string;

        goodsNumber:string;

        serverId:string;

        ext:string;

    }

}


module nest.share {

    /**
     * 是否支持分享
     * @param callback
     * @callback-param {status:0,{share:0}}
     */
    export function isSupport(callback:Function) {
        var data = {module: "share", action: "isSupport"};
        callRuntime(data, callback);
    }


    /**
     * 分享
     * @param shareInfo
     * @param callback
     * @callback-param result 0 表示分享成功，-1表示用户取消
     */
    export function share(shareInfo:ShareInfo, callback:Function) {

        var data = {module: "share", action: "share", "param": shareInfo};
        callRuntime(data, callback);

    }

    /**
     * 分享接口传递参数
     */
    export interface ShareInfo {

        title:string;

        description:string;

        img_title:string;

        img_url:string;

        url:string;

    }
}


module nest.social {


    export function isSupport(callback:Function) {
        var data = {module: "social", action: "isSupport"};
        callRuntime(data, callback);
    }

    export function getFriends(data, callback:Function) {
        data = {module: "social", action: "getFriends"};
        callRuntime(data, callback);
    }

}

module nest.app {

    /**
     * 是否支持特定功能
     * @param callback
     * @callback-param  { status:"0" , attention :"1" , sendToDesktop : "1"}
     */
    export function isSupport(callback:Function) {
        var data = {module: "app", action: "isSupport"};
        callRuntime(data, callback);
    }

    /**
     * 关注
     * @param appInfo
     * @param callback
     */
    export function attention(appInfo:any, callback:Function) {
        var data = {module: "app", action: "attention"};
        callRuntime(data, callback);
    }

    /**
     * 发送到桌面
     * @param appInfo
     * @param callback
     * @param callback-param result 0表示添加桌面成功，-1表示添加失败
     */
    export function sendToDesktop(appInfo:any, callback:Function) {
        var data = {module: "app", action: "sendToDesktop"};
        callRuntime(data, callback);
    }
}

module nest {

    export interface NestData {

        module:string;

        action:string;

        param?:Object;
    }

    export function callRuntime(data:NestData, callback) {

        var tag = "nest";
        egret.ExternalInterface.addCallback(tag, function (data) {
            console.log(data);
            var obj = JSON.parse(data);
            callback(obj.data);
        });

        egret.ExternalInterface.call(tag, JSON.stringify(data));
    }


}

declare module egret_native {

    export function getOption(option:string):any;


}


