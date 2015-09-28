var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var __define = this.__define || function (o, p, g, s) {   Object.defineProperty(o, p, { configurable:true, enumerable:true, get:g,set:s }) };
/**
 *
 * @author
 *
 */
var LoginView = (function (_super) {
    __extends(LoginView, _super);
    function LoginView() {
        _super.call(this);
        this.skinName = skins.LoginViewSkin;
    }
    var d = __define,c=LoginView;p=c.prototype;
    p.createChildren = function () {
        _super.prototype.createChildren.call(this);
        this.login_button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTapHandler, this);
    };
    p.onTouchTapHandler = function (e) {
        this.checkLogin();
    };
    p.checkLogin = function () {
        this.info_txt.text = "正在检查是否已登录...";
        //        var loginInfo: nest.user.LoginInfo = {};
        var loginInfo = {};
        nest.user.checkLogin(loginInfo, this.onCheckLoginCallback.bind(this));
    };
    p.onCheckLoginCallback = function (data) {
        if (!data.token) {
            this.info_txt.text += "\n正在登录...";
            var loginInfo = {};
            nest.user.login(loginInfo, this.onLoginCallback.bind(this));
        }
        else {
            this.onLoginCallback(data);
        }
    };
    p.onLoginCallback = function (data) {
        if (data.result == 0) {
            this.getUserInfo(data, this.onGetUserInfoCallback);
        }
        else {
            //登录失败
            this.info_txt.text += "\n正在获取用户信息...";
        }
    };
    p.onGetUserInfoCallback = function (data) {
        console.log(data);
        this.info_txt.text += "\n正在进入游戏...";
        this.dispatchEvent(new GameEvent(GameEvent.LOGIN_SUCCESS));
    };
    p.getUserInfo = function (data, onGetUserInfoCallback) {
        //为了保证安全性，这段代码请务必放在服务器端实现
        this.info_txt.text += "\n正在获取用户信息...";
        var appId = 336;
        var appkey = "r83RydQxkjhjOsqFVs2OD";
        var token = data.token;
        var requestParams = {
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
        ;
        var urlLoader = new egret.URLLoader();
        var request = new egret.URLRequest();
        request.url = "http://api.egret-labs.org/games/api.php";
        var variable = new egret.URLVariables();
        variable.variables = requestParams;
        request.data = variable;
        request.method = egret.URLRequestMethod.POST;
        urlLoader.load(request);
        urlLoader.addEventListener(egret.Event.COMPLETE, function (e) {
            var data = JSON.parse(urlLoader.data);
            onGetUserInfoCallback.call(this, data);
        }, this);
    };
    return LoginView;
})(egret.gui.SkinnableComponent);
egret.registerClass(LoginView,"LoginView");
