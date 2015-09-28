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
var GameView = (function (_super) {
    __extends(GameView, _super);
    function GameView() {
        _super.call(this);
        this.skinName = skins.GameViewSkin;
    }
    var d = __define,c=GameView;p=c.prototype;
    p.createChildren = function () {
        _super.prototype.createChildren.call(this);
        this.payButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPayButtonTapHandler, this);
        this.shareButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShareButtonTapHandler, this);
        this.logoutButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLogoutButtonTapHandler, this);
    };
    p.onLogoutButtonTapHandler = function (e) {
        var loginInfo = {};
        nest.user.logout(loginInfo, function (data) {
            alert(data);
        });
    };
    p.onPayButtonTapHandler = function (e) {
        var payInfo = {
            goodsId: "testpay2",
            goodsNumber: "1",
            serverId: "1",
            ext: "1"
        };
        nest.iap.pay(payInfo, this.onPayHandler.bind(this));
    };
    p.onPayHandler = function (payInfo) {
        console.log(payInfo);
    };
    p.onShareButtonTapHandler = function (e) {
        var self = this;
        nest.share.isSupport(function (supportData) {
            if (supportData.share) {
                var shareInfo = {
                    title: "分享标题",
                    description: "分享内容",
                    img_title: "图片标题",
                    img_url: "file:///sdcard/QQBrowser/",
                    url: "分享URL"
                };
                nest.share.share(shareInfo, this.onShareCompleteHandler.bind(self));
            }
        });
    };
    p.onShareCompleteHandler = function (data) {
        if (data.result >= 0) {
            console.log("分享成功");
        }
    };
    return GameView;
})(egret.gui.SkinnableComponent);
egret.registerClass(GameView,"GameView");
