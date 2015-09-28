var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var __define = this.__define || function (o, p, g, s) {   Object.defineProperty(o, p, { configurable:true, enumerable:true, get:g,set:s }) };
var skins;
(function (skins) {
    var LoginViewSkin = (function (_super) {
        __extends(LoginViewSkin, _super);
        function LoginViewSkin() {
            _super.call(this);
            this.__s = egret.gui.setProperties;
            this.__s(this, ["height", "width"], [800, 480]);
            this.elementsContent = [this.__3_i()];
            this.states = [
                new egret.gui.State("normal", [
                ]),
                new egret.gui.State("disabled", [
                ])
            ];
        }
        var d = __define,c=LoginViewSkin;p=c.prototype;
        d(p, "skinParts"
            ,function () {
                return LoginViewSkin._skinParts;
            }
        );
        p.info_txt_i = function () {
            var t = new egret.gui.Label();
            this.info_txt = t;
            this.__s(t, ["bottom", "horizontalCenter", "text", "textColor"], [100, 0, "状态文本", 0x000000]);
            return t;
        };
        p.login_button_i = function () {
            var t = new egret.gui.Button();
            this.login_button = t;
            this.__s(t, ["bottom", "horizontalCenter", "label"], [200, 0, "登录"]);
            return t;
        };
        p.__3_i = function () {
            var t = new egret.gui.Panel();
            this.__s(t, ["height", "horizontalCenter", "verticalCenter", "width"], [415, 0, 0, 370]);
            t.elementsContent = [this.login_button_i(), this.info_txt_i()];
            return t;
        };
        LoginViewSkin._skinParts = ["login_button", "info_txt"];
        return LoginViewSkin;
    })(egret.gui.Skin);
    skins.LoginViewSkin = LoginViewSkin;
    egret.registerClass(LoginViewSkin,"skins.LoginViewSkin");
})(skins || (skins = {}));
