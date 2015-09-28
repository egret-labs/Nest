var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var __define = this.__define || function (o, p, g, s) {   Object.defineProperty(o, p, { configurable:true, enumerable:true, get:g,set:s }) };
var skins;
(function (skins) {
    var GameViewSkin = (function (_super) {
        __extends(GameViewSkin, _super);
        function GameViewSkin() {
            _super.call(this);
            this.__s = egret.gui.setProperties;
            this.width = 400;
            this.elementsContent = [this.__5_i()];
            this.states = [
                new egret.gui.State("normal", [
                ]),
                new egret.gui.State("disabled", [
                ])
            ];
        }
        var d = __define,c=GameViewSkin;p=c.prototype;
        d(p, "skinParts"
            ,function () {
                return GameViewSkin._skinParts;
            }
        );
        p.__4_i = function () {
            var t = new egret.gui.Group();
            t.setStyle("textAlign", "center");
            t.setStyle("verticalAlign", "middle");
            this.__s(t, ["horizontalCenter", "verticalCenter"], [0, 0]);
            t.layout = this.__3_i();
            t.elementsContent = [this.payButton_i(), this.shareButton_i(), this.bbsButton_i(), this.desktopButton_i(), this.logoutButton_i()];
            return t;
        };
        p.__5_i = function () {
            var t = new egret.gui.Panel();
            this.__s(t, ["width", "x", "y"], [379, 10, 11]);
            t.elementsContent = [this.__4_i()];
            return t;
        };
        p.bbsButton_i = function () {
            var t = new egret.gui.Button();
            this.bbsButton = t;
            t.label = "打开论坛";
            return t;
        };
        p.desktopButton_i = function () {
            var t = new egret.gui.Button();
            this.desktopButton = t;
            t.label = "发送到桌面";
            return t;
        };
        p.logoutButton_i = function () {
            var t = new egret.gui.Button();
            this.logoutButton = t;
            t.label = "登出";
            return t;
        };
        p.payButton_i = function () {
            var t = new egret.gui.Button();
            this.payButton = t;
            t.label = "支付";
            return t;
        };
        p.shareButton_i = function () {
            var t = new egret.gui.Button();
            this.shareButton = t;
            t.label = "分享";
            return t;
        };
        p.__3_i = function () {
            var t = new egret.gui.TileLayout();
            return t;
        };
        GameViewSkin._skinParts = ["payButton", "shareButton", "bbsButton", "desktopButton", "logoutButton"];
        return GameViewSkin;
    })(egret.gui.Skin);
    skins.GameViewSkin = GameViewSkin;
    egret.registerClass(GameViewSkin,"skins.GameViewSkin");
})(skins || (skins = {}));
