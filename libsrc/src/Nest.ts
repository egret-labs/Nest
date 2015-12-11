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
    export module core {
        export interface StartupInfo {
            /**
             * egret 平台分配的 AppId
             */
            egretAppId: number;
            /**
             * 使用的 Nest 版本,默认为1
             * 使用新版 Nest 接口请传2
             */
            version:number;
        }
    }

    export interface core {

    }

    export var core:{
        /**
         * 启动Nest,请务必最先调用此函数
         * @param startupInfo 启动参数
         * @param callback 启动完成回调
         */
        startup(startupInfo:nest.core.StartupInfo, callback:Function):void;

        callCustomMethod(customInfo:any, callback:Function):void;
    };

    /**
     * 登录功能
     *
     * 逻辑：
     * 1.在游戏中展示一张登录背景界面
     * 2.调用 checkLogin 函数判断是否已经登录过，如果登录过，进入步骤6，否则进入步骤3
     * 3.调用 isSupport 函数判断支持的登录类型，根据登录类型显示对应的登录图标
     * 4.用户点击登录图标后，调用 login 函数打开登录面板进行登录
     * 5.如果登录成功，进入步骤6
     * 6.退出登录界面，进入游戏
     *
     *
     * 登出功能：
     *
     * 逻辑：
     * 1.在游戏中放置一个“退出游戏”或者“切换账号”的按钮
     * 2.用户点击“退出游戏”图标后，调用 logout 函数
     * 3.在登出成功后，返回到登录逻辑的步骤1
     *
     *
     */
    export module user {
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
             * 该值未来可能会被废弃,请使用result进行判断
             */
            status?:number;
            /**
             * 结果值，0表示成功
             */
            result:number;
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
            /**
             * 是否支持获取用户信息
             */
            getInfo?:number;
        }
    }

    export interface user {

    }

    export var user:{
        /**
         * 检测是否已登录
         * @param loginInfo 请传递一个{}
         * @param callback
         * @callback-param  @see nest.user.LoginCallbackInfo
         */
        checkLogin(loginInfo:nest.user.LoginInfo, callback:Function):void;
        /**
         * 调用渠道登录接口
         * @param loginInfo
         * @param callback
         * @callback-param  @see nest.user.LoginCallbackInfo
         */
        login(loginInfo:nest.user.LoginInfo, callback:Function):void;
        /**
         * 登出接口
         * @param loginInfo 可以传递{}
         * @param callback
         * @callback-param   { result : 0 };
         */
        logout(loginInfo:nest.user.LoginInfo, callback:Function):void;
        /**
         * 检测支持何种登录方式
         * @param callback
         * @callback-param  @see nest.user.LoginCallbackInfo
         */
        isSupport(loginInfo:nest.user.LoginInfo, callback:Function):void;
        /**
         * 获取用户信息，目前只有qq浏览器支持
         * @param callback
         */
        getInfo(loginInfo:nest.user.LoginInfo, callback:Function):void;
    };

    export module iap {
        export interface PayInfo {
            goodsId:string;
            goodsNumber:string;
            serverId:string;
            ext:string;
        }
    }

    export interface iap {

    }

    export var iap:{
        /**
         * 支付
         * @param orderInfo
         * @param callback
         */
        pay(payInfo:nest.iap.PayInfo, callback:Function):void;
    };

    export module share {
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

    export interface share {

    }

    export var share:{
        /**
         * 是否支持分享
         * @param callback
         * @callback-param {result:0, share:0}  share 1支持 0不支持
         */
        isSupport(callback:Function):void;

        /**
         * 设置默认分享内容,以便某些渠道在游戏外点击分享按钮时显示分享内容
         * @param shareInfo
         * @param callback
         * @callback-param result 0 表示成功，-2表示失败
         */
        setDefaultData(shareInfo:nest.share.ShareInfo, callback:Function):void;

        /**
         * 分享
         * @param shareInfo
         * @param callback
         * @callback-param result 0 表示分享成功，-1表示用户取消
         */
        share(shareInfo:nest.share.ShareInfo, callback:Function):void;
    };

    export interface social {

    }

    export var social:{
        isSupport(callback:Function):void;
        getFriends(socialInfo:any, callback:Function):void;
        openBBS(socialInfo:any, callback:Function):void;
    };

    export module app {
        export interface IDesktopInfo {
            Title:string;           // 桌面图标标题，不要超过五个中文字
            DetailUrl:string;      // 桌面图标对应的页面url
            PicUrl: string; //120*120
        }
    }

    export interface app {

    }

    export var app:{
        /**
         * 是否支持特定功能
         * @param callback
         * @callback-param  { result:"0" , attention :"1" , sendToDesktop : "1" , exitGame : "1" , getInfo : "1"}
         * attention|sendToDesktop|exitGame|getInfo 1支持 0不支持
         */
        isSupport(callback:Function):void;
        /**
         * 关注
         * @param appInfo
         * @param callback
         */
        attention(appInfo:any, callback:Function):void;
        /**
         * 退出游戏，回到 App 界面
         * @param appInfo
         * @param callback
         */
        exitGame(appInfo:any, callback:Function):void;
        /**
         * 发送到桌面
         * @param appInfo
         * @param callback
         * @param callback-param result 0表示添加桌面成功，-1表示添加失败
         */
        sendToDesktop(appInfo:any, callback:Function):void;
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
        getInfo(appInfo:any, callback:Function):void;
    };
}