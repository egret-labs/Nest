var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var __define = this.__define || function (o, p, g, s) {   Object.defineProperty(o, p, { configurable:true, enumerable:true, get:g,set:s }) };
var skins;
(function (skins) {
    var simple;
    (function (simple) {
        var ToggleSwitchSkin = (function (_super) {
            __extends(ToggleSwitchSkin, _super);
            function ToggleSwitchSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.elementsContent = [this.__7_i(), this.__8_i(), this.__9_i(), this.__10_i(), this.__11_i(), this.__12_i()];
                this.states = [
                    new egret.gui.State("up", [
                        new egret.gui.SetProperty("__7", "visible", true),
                        new egret.gui.SetProperty("__8", "visible", true),
                        new egret.gui.SetProperty("__9", "visible", true)
                    ]),
                    new egret.gui.State("down", [
                        new egret.gui.SetProperty("__7", "visible", true),
                        new egret.gui.SetProperty("__8", "visible", true),
                        new egret.gui.SetProperty("__9", "visible", true)
                    ]),
                    new egret.gui.State("disabled", [
                        new egret.gui.SetProperty("__7", "visible", true),
                        new egret.gui.SetProperty("__8", "visible", true),
                        new egret.gui.SetProperty("__9", "visible", true)
                    ]),
                    new egret.gui.State("upAndSelected", [
                        new egret.gui.SetProperty("__10", "visible", true),
                        new egret.gui.SetProperty("__11", "visible", true),
                        new egret.gui.SetProperty("__12", "visible", true)
                    ]),
                    new egret.gui.State("downAndSelected", [
                        new egret.gui.SetProperty("__10", "visible", true),
                        new egret.gui.SetProperty("__11", "visible", true),
                        new egret.gui.SetProperty("__12", "visible", true)
                    ]),
                    new egret.gui.State("disabledAndSelected", [
                        new egret.gui.SetProperty("__10", "visible", true),
                        new egret.gui.SetProperty("__11", "visible", true),
                        new egret.gui.SetProperty("__12", "visible", true)
                    ])
                ];
            }
            var d = __define,c=ToggleSwitchSkin;p=c.prototype;
            p.__10_i = function () {
                var t = new egret.gui.UIAsset();
                this.__10 = t;
                this.__s(t, ["source", "visible"], ["onoffbutton_on_track_png", false]);
                return t;
            };
            p.__11_i = function () {
                var t = new egret.gui.UIAsset();
                this.__11 = t;
                this.__s(t, ["right", "source", "verticalCenter", "visible"], [1, "onoffbutton_on_thumb_png", 0, false]);
                return t;
            };
            p.__12_i = function () {
                var t = new egret.gui.UIAsset();
                this.__12 = t;
                this.__s(t, ["left", "source", "verticalCenter", "visible"], [15, "onoffbutton_on_label_png", 0, false]);
                return t;
            };
            p.__7_i = function () {
                var t = new egret.gui.UIAsset();
                this.__7 = t;
                this.__s(t, ["source", "visible"], ["onoffbutton_off_track_png", false]);
                return t;
            };
            p.__8_i = function () {
                var t = new egret.gui.UIAsset();
                this.__8 = t;
                this.__s(t, ["left", "source", "verticalCenter", "visible"], [1, "onoffbutton_off_thumb_png", 0, false]);
                return t;
            };
            p.__9_i = function () {
                var t = new egret.gui.UIAsset();
                this.__9 = t;
                this.__s(t, ["right", "source", "verticalCenter", "visible"], [15, "onoffbutton_off_label_png", 0, false]);
                return t;
            };
            return ToggleSwitchSkin;
        })(egret.gui.Skin);
        simple.ToggleSwitchSkin = ToggleSwitchSkin;
        egret.registerClass(ToggleSwitchSkin,"skins.simple.ToggleSwitchSkin");
    })(simple = skins.simple || (skins.simple = {}));
})(skins || (skins = {}));
