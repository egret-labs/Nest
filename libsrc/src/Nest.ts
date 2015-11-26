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


module nest.core {

    export interface StartupInfo {
        /**
         * egret 平台分配的 AppId
         */
        egretAppId: number;

    }

    export interface ResultCallbackInfo {
        /**
         * 回调参数是否正确，0 正确，其他 错误
         */
        result:number;
    }

    /**
     * @private
     * 游戏在开放平台的id.使用nest.core.startup设置
     */
    export var appId:number = parseInt(egret.getOption("appId"));

    /**
     * 启动Nest
     * @param info 启动参数
     * @param callback 启动完成回调
     * @example 以下代码设置appId为 88888,启动Nest
     * <pre>
     *     nest.core.startup({egretAppId:88888}, function (){
     *         //do something
     *     });
     * </pre>
     */
    export function startup(info:StartupInfo, callback:(resultInfo:ResultCallbackInfo)=>any) {
        if(info.egretAppId != null) {
            appId = info.egretAppId;
        }
        callback({"result": 0});
    }


    export function callCustomMethod(customInfo:any, callback:Function) {
        var data = {module: "core", action: "callCustomMethod", param: customInfo};
        callRuntime(data, callback);
    }
}


/**
 * 登录功能逻辑：
 * 1.初始化项目数据
 * 2.在游戏中展示一张登录背景界面
 * 3.调用 checkLogin 函数判断是否已经登录过，如果登录过，进入步骤7，否则进入步骤4
 * 4.调用 isSupport 函数判断支持的登录类型，根据登录类型显示对应的登录图标
 * 5.用户点击登录图标后，调用 login 函数打开登录面板进行登录
 * 6.如果登录成功，进入步骤7
 * 7.退出登录界面，进入游戏
 *
 * 登出功能逻辑：
 * 1.在游戏中放置一个“退出游戏”或者“切换账号”的按钮
 * 2.用户点击“退出游戏”图标后，调用 logout 函数
 * 3.在登出成功后，返回到登录逻辑的步骤4
 */
module nest.user {

    /**
     * 检测是否已登录
     * @param loginInfo 请传递一个{}
     * @param callback
     * @callback-param  @see nest.user.LoginCallbackInfo
     * @example 以下代码检测是否已经登录
     * <pre>
     *     nest.user.checkLogin({}, function (data){
     *         if(data.result == 0) {
     *             //已经登录,获取登陆token信息
     *             var token = data.token;
     *         }
     *         else {
     *             //没有登录,之后需要用nest.uset.isSupport接口获取loginType并根据loginType显示登录界面
     *         }
     *     });
     * </pre>
     */
    export function checkLogin(loginInfo:LoginInfo, callback:(resultInfo:LoginCallbackInfo)=>any) {

        var data = {module: "user", action: "checkLogin", param: loginInfo};

        callRuntime(data, callback);
    }

    /**
     * 调用渠道登录接口
     * @param loginInfo
     * @param callback
     * @callback-param  @see nest.user.LoginCallbackInfo
     * @example 以下代码调用渠道登录接口
     * <pre>
     *     nest.user.login({}, function (data){
     *         if(data.result == 0) {
     *             //登陆成功,获取用户token
     *             var token = data.token;
     *         }
     *         else {
     *             //登录失败,需要重新登录
     *         }
     *     });
     * </pre>
     */
    export function login(loginInfo:LoginInfo, callback:(resultInfo:LoginCallbackInfo)=>any) {

        var data = {module: "user", action: "login", param: loginInfo};
        callRuntime(data, callback, true);

    }

    /**
     * 登出接口
     * @param loginInfo 登出参数,没有可以传递{}
     * @param callback 回调函数
     * @callback-param   { result : 0 };
     * @example 以下代码调用渠道登出接口
     * <pre>
     *     nest.user.logout({}, function (data){
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
    export function logout(loginInfo:LoginInfo, callback:(resultInfo:core.ResultCallbackInfo)=>any) {
        var nestVersion:any = egret_native.getOption("egret.runtime.nest");
        if (nestVersion >= 4 || nestVersion == "custom") {
            var data = {module: "user", action: "logout", param: loginInfo};
            callRuntime(data, callback);
        }
        else {
            callback({"result": 0});
        }
    }

    /**
     * 检测支持何种登录方式
     * @param callback
     * @callback-param  @see nest.user.UserSupportCallbackInfo
     * @example 以下代码进行检测支持何种登录方式
     * <pre>
     *     nest.user.logout({}, function (data){
     *         if(data.result == 0) {
     *             //获取渠道支持的登陆方式,并根据登录方式显示登陆界面
     *             var loginType = data.loginType;
     *             //获取渠道是否支持获得用户信息接口,如果支持可以使用nest.user.getInfo获取用户信息
     *             var isSupportGetUserInfo = data.getInfo == 1;
     *         }
     *     });
     * </pre>
     */
    export function isSupport(callback:(resultInfo:UserSupportCallbackInfo)=>any) {
        var data = {module: "user", action: "isSupport"};
        callRuntime(data, callback);
    }

    /**
     * 获取用户信息，目前只有qq浏览器runtime支持
     * @param callback 回调函数
     * @example 以下代码进行检测支持何种登录方式
     * <pre>
     *     nest.user.logout({}, function (data){
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
    export function getInfo(callback:(resultInfo:Object)=>any) {
        var data = {module: "user", action: "getInfo"};
        callRuntime(data, callback);
    }


    /**
     * 登录接口传递参数
     *
     */
    export interface LoginInfo {
        /**
         * 登录类型：如 <code>qq</code>表示QQ登录，<code>wx</code>表示微信支付。
         * 如果没有，则不需要赋值
         */
        loginType?:string;

    }

    export interface LoginCallbackInfo extends core.ResultCallbackInfo {

        /**
         * checkLogin , login 函数返回。
         * 用户 token 信息，如果checkLogin函数中没有token则表示用户尚未登录
         */
        token:string;
    }

    export interface UserSupportCallbackInfo extends core.ResultCallbackInfo{
        /**
         * isSupport 函数返回。
         * 登录方式。
         * 以QQ浏览器为例，返回 ["qq","wx"]
         * 开发者应该主动判断登录方式，如果返回了 null ，则表示没有特殊登录方式
         */
        loginType:Array<string>

        /**
         * 是否支持获取用户信息
         */
        getInfo?:number;
    }


}


module nest.iap {

    /**
     * 支付
     * @param orderInfo 支付信息
     * @param callback 支付回调
     * @example 以下代码进行支付
     * <pre>
     *     nest.iap.pay({goodsId:"1",goodsNumber:"1",serverId:"1",ext:"msg"}, function (data){
     *         if(data.result == 0) {
     *             //支付成功
     *         }
     *         else {
     *             //支付失败
     *         }
     *     });
     * </pre>
     */
    export function pay(orderInfo:PayInfo, callback:(result:PayCallbackInfo)=>any) {

        var data = {module: "iap", action: "pay", "param": orderInfo};
        callRuntime(data, callback);
    }

    export interface PayInfo {
        //配置id
        goodsId:string;
        //购买数量
        goodsNumber:string;
        //哪个服
        serverId:string;
        //透传参数
        ext:string;
    }

    export interface PayCallbackInfo extends core.ResultCallbackInfo {
        ext?:string;
    }
}


module nest.share {

    /**
     * 是否支持分享
     * @param callback 回调函数
     * @example 以下代码获取是否支持分享
     * <pre>
     *     nest.share.isSupport(function (data){
     *         if(data.result == 0) {
     *             //获取是否支持分享
     *             var share = data.share == 1;
     *         }
     *     });
     * </pre>
     */
    export function isSupport(callback:(resultInfo:ShareSupportCallbackInfo)=>any) {
        var data = {module: "share", action: "isSupport"};
        callRuntime(data, callback);
    }


    /**
     * 分享
     * @param shareInfo 分享参数
     * @param callback 回调函数
     * @callback-param result 0 表示分享成功，-1表示用户取消
     * @example 以下代码获取是否支持分享
     * <pre>
     *     var shareInfo = {title:"title", description:"description", img_title:"img_title", img_url:"http://www.example.com/example.jpg", url:"http://www.example.com"};;
     *     nest.share.share(shareInfo, function (data) {
     *         if(data.result == 0) {
     *             //分享成功
     *         }
     *         else {
     *             //分享失败
     *         }
     *     });
     * </pre>
     */
    export function share(shareInfo:ShareInfo, callback:(resultInfo:ShareCallbackInfo)=>any) {

        var data = {module: "share", action: "share", param: shareInfo};
        callRuntime(data, callback, true);

    }

    /**
     * 分享接口传递参数
     */
    export interface ShareInfo {
        /**
         * 分享标题
         */
        title:string;
        /**
         * 分享文字内容
         */
        description:string;
        /**
         * 分享图片标题
         */
        img_title:string;
        /**
         * 分享图标地址
         */
        img_url:string;
        /**
         * 分享地址
         */
        url:string;
    }

    export interface ShareCallbackInfo extends core.ResultCallbackInfo{
    }

    export interface ShareSupportCallbackInfo extends core.ResultCallbackInfo{
        status:number;
        share:number;
    }
}


module nest.social {
    export function isSupport(callback:(resultInfo:SocialSupportCallbackInfo)=>any) {
        var data = {module: "social", action: "isSupport"};
        callRuntime(data, callback);
    }

    export function getFriends(socialInfo, callback:Function) {
        var data = {module: "social", action: "getFriends", param: socialInfo};
        callRuntime(data, callback);
    }

    export function openBBS(socialInfo, callback:(resultInfo:core.ResultCallbackInfo)=>any) {
        var data = {module: "social", action: "openBBS", param: socialInfo};
        callRuntime(data, callback);
    }

    export interface SocialSupportCallbackInfo extends core.ResultCallbackInfo {
        status:number;
        getFriends?:number;
        openBBS?:number;
    }
}

module nest.app {
    /**
     * 是否支持特定功能
     * @param callback
     * @callback-param  { status:"0" , attention :"1" , sendToDesktop : "1"} attention|sendToDesktop 1支持 0不支持
     */
    export function isSupport(callback:(resultInfo:SocialSupportCallbackInfo)=>any) {
        var data = {module: "app", action: "isSupport"};
        callRuntime(data, callback);
    }

    /**
     * 关注
     * @param appInfo
     * @param callback
     */
    export function attention(appInfo:any, callback:(resultInfo:core.ResultCallbackInfo)=>any) {
        var data = {module: "app", action: "attention", param: appInfo};
        callRuntime(data, callback);
    }

    /**
     * 退出游戏，回到 App 界面
     * @param appInfo
     * @param callback
     */
    export function exitGame(appInfo:any, callback:(resultInfo:core.ResultCallbackInfo)=>any) {
        var data = {module: "app", action: "exitGame", param: appInfo};
        callRuntime(data, callback);
    }

    /**
     * 发送到桌面
     * @param appInfo
     * @param callback
     * @param callback-param result 0表示添加桌面成功，-1表示添加失败
     */
    export function sendToDesktop(appInfo:any, callback:(resultInfo:core.ResultCallbackInfo)=>any) {
        var data = {module: "app", action: "sendToDesktop", param: appInfo};
        callRuntime(data, callback);
    }

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
    export function getInfo(appInfo:any, callback:(resultInfo:InfoesCallbackInfo)=>any) {
        var data = {module: "app", action: "getInfo", param: appInfo};
        callRuntime(data, callback);
    }

    export interface SocialSupportCallbackInfo extends core.ResultCallbackInfo{
        status:number;
        attention?:number;
        sendToDesktop?:number;
        exitGame?:number;
    }

    export interface InfoesCallbackInfo extends core.ResultCallbackInfo {
        contact:string;//可用联系方式
        qq?:string[];//qq联系方式数组[],如果没有响应联系方式将没有该字段
        qqgroup?:string[];//qq群联系方式数组[],如果没有响应联系方式将没有该字段
        weixin?:string[];//微信联系方式数组[],如果没有响应联系方式将没有该字段
        email?:string[];//email联系方式数组[],如果没有响应联系方式将没有该字段
    }
}

module nest {
    var externalArr:Array<any> = [];

    /**
     * @private
     */
    export interface NestData {

        module:string;

        action:string;

        param?:Object;
    }

    /**
     * @private
     * @param data
     * @param callback
     * @param parallel
     */
    export function callRuntime(data:NestData, callback, parallel:boolean = false) {

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
            externalArr.push({"data": data, "callback": callback});
            _getData();

        }

    }

    var isRunning:boolean = false;

    function _getData():void {
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
}

declare module egret_native {

    export function getOption(option:string):any;


}


