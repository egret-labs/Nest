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

class Main extends egret.DisplayObjectContainer {

    private container:egret.DisplayObjectContainer;

    private resultText:egret.TextField;


    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

        this.createGameScene();
    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene():void {
        this.container = new egret.DisplayObjectContainer();
        this.addChild(this.container);
        this.resultText = new egret.TextField();
        this.resultText.multiline = true;
        this.resultText.width = 300;
        this.resultText.height = 400;
        this.addChild(this.resultText);
        this.resultText.x = 100;
        this.resultText.y = 400;

        this.createButton("保存桌面信息", this.testInitDesktop, this);
        this.createButton("检查支持", this.testSupport, this);
        this.createButton("检查登录类型", this.testLoginSupport, this);
        this.createButton("检测是否登录", this.testCheckLogin, this);
        this.createButton("登录", this.testLogin, this);
        this.createButton("支付", this.testPay, this);
        this.createButton("分享", this.testShare, this);
        this.createButton("好友列表", this.testFriends, this);
        this.createButton("发送到桌面", this.testSendToDesktop, this);
        this.createButton("打开游戏论坛", this.testOpenBBS, this);
    }

    private createButton(label:string, callback:Function, thisObject:any):egret.DisplayObject {
        var loginButton:egret.TextField = new egret.TextField();
        loginButton.touchEnabled = true;
        loginButton.text = label;
        loginButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN, callback, thisObject);
        this.container.addChild(loginButton);
        var index:number = this.container.numChildren;
        loginButton.x = 100;
        loginButton.y = index * 50;
        return loginButton;
    }

    private print(text:any) {
        this.resultText.text = JSON.stringify(text);
    }

    //初始化浏览器快捷登陆需要的信息
    private testInitDesktop():void {
        nest.app.initDesktop({
            Title: "Egret测试桌面",
            DetailUrl: "",
            PicUrl: "https://avatars2.githubusercontent.com/u/6657668?v=3&s=200"
        });
    }

    //检测功能支持
    private testSupport():void {

        var self = this;
        nest.share.isSupport(function (data) {
            console.log("cm old share " + JSON.stringify(data))
            self.print(data);
        })
        nest.app.isSupport(function (data) {
            console.log("cm old app  " + JSON.stringify(data))
            self.print(data);
        })
    }

    //检测是否已登录
    private testCheckLogin():void {
        var self = this;
        nest.user.checkLogin(null, function (data) {

            self.print(data);
        })
    }

    //调用渠道登录接口
    private testLogin():void {

        var self = this;
        var loginInfo:nest.user.LoginInfo = {};
        //loginInfo.loginType = "wx";
        nest.user.login(loginInfo, function (data) {

            self.print(data);
        })
    }

    //判断支持那种登录方式
    private testLoginSupport():void {
        var self = this;
        nest.user.isSupport(function (data) {

            self.print(data);
        })
    }

    //充值调用
    private testPay():void {
        var self = this;
        var payInfo:nest.iap.PayInfo = {
            goodsId: "8",
            goodsNumber: "1",
            serverId: "1",
            ext: "fdsfdsf"
        };

        nest.iap.pay(payInfo, function (data) {
            self.print(data);
        })
    }

    //分享信息
    private testShare():void {
        var self = this;

        var data:nest.share.ShareInfo = {

            title: "分享游戏得元宝",
            description: "了",
            img_title: "古龙群侠传",
            img_url: "http://sglqxz.egret-labs.org/common/glqxzshareicon.png",
            url: "http://glqxzqqb.gz.1251278653.clb.myqcloud.com/share.html"


        };
        nest.share.share(data, function (data) {
            self.print(data);
        })
    }

    //获取好友猎豹
    private testFriends():void {

        var self = this;
        var data = {};
        nest.social.getFriends(data, function (data) {
            self.print(data);
        })
    }

    //生成桌面快捷图标
    private testSendToDesktop():void {

        var self = this;
        var data = {};
        nest.app.sendToDesktop(data, function (data) {
            self.print(data);
        })
    }

    //打开bbs
    private testOpenBBS():void {
        var self = this;
        nest.social.openBBS(null, function (data) {

            self.print(data);
        })
    }
}


