/**
 * Created by yjtx on 15-10-16.
 */

class QuickTest implements nest.easeuser.ILoginCallbacks {

    private logStr = "";

    private text:egret.gui.Label;

    init(text:egret.gui.Label):void {
        this.text = text;
    }

    start():void {

        if (window && window.location && window.location.href) {
            this.addLog("href:" + window.location.href);
        }

        var self = this;
        nest.core.startup({
            egretAppId: 88888,
            version: 2,
            debug: true
        }, function (resultInfo:nest.core.ResultCallbackInfo) {
            if (resultInfo.result == 0) {
                self.checkLogin();
            }
        });
    }

    private addLog(msg:string):void {
        this.logStr = msg + "\n\n" + this.logStr;

        this.text.text = this.logStr;
    }

    public onCreate = (data: nest.easeuser.ILoginTypes):void =>  {
        utils.changeView(new LoginTypeView(data));
    };

    public onSuccess = (data: nest.user.LoginCallbackInfo):void => {
        this.logData = data;
        egret.log("log Success");

        this.getInfo();
    };

    public onFail = (data: nest.core.ResultCallbackInfo):void => {
        egret.log("log Fail");
    };

    private checkLogin():void {
        this.addLog("checkLogin start");

        nest.easeuser.login(this);
    }

    private logData:nest.user.LoginCallbackInfo;

    private getInfo() {

        this.addLog("getInfo start");

        //为了保证安全性，这段代码请务必放在服务器端实现
        var appId:number = 336;
        var appkey:string = "r83RydQxkjhjOsqFVs2OD";
        var token = this.logData.token;
        var requestParams:any = {
            action: "user.getInfo",
            appId: appId,
            serverId: 1,
            time: Date.now(),
            token: token
        };
        var signStr = "";
        for (var key in requestParams) {
            signStr += key + "=" + requestParams[key];
        }
        signStr += appkey;
        requestParams.sign = new md5().hex_md5(signStr);

        var urlLoader:egret.URLLoader = new egret.URLLoader();
        var request:egret.URLRequest = new egret.URLRequest();
        request.url = "http://api.egret-labs.org/games/api.php";

        var variable:egret.URLVariables = new egret.URLVariables();
        variable.variables = requestParams;
        request.data = variable;

        request.method = egret.URLRequestMethod.POST;
        urlLoader.load(request);

        this.addLog("url: " + request.url);
        this.addLog("variables: " + JSON.stringify(requestParams));
        this.addLog("method: " + request.method);

        var self = this;
        urlLoader.addEventListener(egret.Event.COMPLETE, function (e:egret.Event) {
            var data = JSON.parse(urlLoader.data);

            self.addLog("response: " + JSON.stringify(data, null, 4));
            self.addLog("getInfo end");

            self.getInfoSuccessNext();
        }, this);
    }

    private getInfoSuccessNext():void {
        this.payTrue();
    }

    private payTrue():void {
        var self = this;
        this.addLog("payTrue start");

        var payInfo:nest.iap.PayInfo = {
            goodsId: "testpay1",
            goodsNumber: "2",
            serverId: "1",
            ext: "1"
        };

        this.addLog("request:" + JSON.stringify(payInfo, null, 4));

        nest.iap.pay(payInfo, function (callInfo:{result:number}) {
            self.addLog("response:" + JSON.stringify(callInfo, null, 4));
            self.addLog("payTrue end");
            if (callInfo.result == 0) {
                self.payTrueSuccess();
            }
            else {
                self.addLog("payTrue fail");
            }
        });
    }

    private payTrueSuccess():void {
        this.payFalse();
    }

    private payFalse():void {
        var self = this;
        this.addLog("payFalse start");

        var payInfo:nest.iap.PayInfo = {
            goodsId: "",
            goodsNumber: "2",
            serverId: "1",
            ext: "1"
        };

        nest.iap.pay(payInfo, function (callInfo:nest.iap.PayCallbackInfo) {
            this.addLog("response:" + JSON.stringify(callInfo, null, 4));
            this.addLog("payFalse end");
            if (callInfo.result == 0) {
                self.payFalseSuccess();
            }
            else {
                self.addLog("payTrue fail");
            }
        });
    }

    private payFalseSuccess():void {
        this.logout();
    }

    private share():void {

    }

    private logout():void {
        this.addLog("logout start");
        var loginInfo:nest.user.LoginInfo = {};

        var self = this;
        nest.easeuser.logout(loginInfo, function (data) {
            this.addLog(JSON.stringify(data, null, 4));
            this.addLog("logout end");

            if (data["result"] == 0) {
                self.logoutSuccess();
            }
            else {
                self.addLog("logout fail");
            }
        });
    }

    private logoutSuccess():void {
        this.loginAgain();
    }

    private loginAgain():void {
        var self = this;
        self.addLog("loginAgin start");
        nest.user.checkLogin({}, function (data:nest.user.LoginCallbackInfo) {
            self.addLog(JSON.stringify(data));

            self.addLog("loginAgin end");

            self.allSuccess();

        });
    }

    private allSuccess():void {
        this.addLog("allSuccess");
    }
}