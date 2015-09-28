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
        var ToggleButtonSkin = (function (_super) {
            __extends(ToggleButtonSkin, _super);
            function ToggleButtonSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.__s(this, ["height", "minWidth"], [60, 140]);
                this.elementsContent = [this.__7_i(), this.__9_i()];
                this.states = [
                    new egret.gui.State("up", [
                    ]),
                    new egret.gui.State("down", [
                        new egret.gui.SetProperty("__7", "source", "togglebutton_over_png"),
                        new egret.gui.SetProperty("labelDisplay", "textColor", 0x1e7465)
                    ]),
                    new egret.gui.State("disabled", [
                        new egret.gui.SetProperty("__7", "source", "togglebutton_disabled_png"),
                        new egret.gui.SetProperty("labelDisplay", "textColor", 0xcccccc)
                    ]),
                    new egret.gui.State("upAndSelected", [
                        new egret.gui.SetProperty("__7", "source", "togglebutton_selected_png"),
                        new egret.gui.SetProperty("labelDisplay", "textColor", 0xeeedec)
                    ]),
                    new egret.gui.State("downAndSelected", [
                        new egret.gui.SetProperty("__7", "source", "togglebutton_over_png"),
                        new egret.gui.SetProperty("labelDisplay", "textColor", 0x1e7465)
                    ]),
                    new egret.gui.State("disabledAndSelected", [
                        new egret.gui.SetProperty("__7", "source", "togglebutton_disabled_png"),
                        new egret.gui.SetProperty("labelDisplay", "textColor", 0xcccccc)
                    ])
                ];
            }
            var d = __define,c=ToggleButtonSkin;p=c.prototype;
            d(p, "skinParts"
                ,function () {
                    return ToggleButtonSkin._skinParts;
                }
            );
            p.__8_i = function () {
                var t = new egret.gui.HorizontalLayout();
                this.__s(t, ["gap", "horizontalAlign", "verticalAlign"], [0, "center", "middle"]);
                return t;
            };
            p.__9_i = function () {
                var t = new egret.gui.Group();
                this.__s(t, ["bottom", "left", "right", "top"], [10, 10, 10, 10]);
                t.layout = this.__8_i();
                t.elementsContent = [this.iconDisplay_i(), this.labelDisplay_i()];
                return t;
            };
            p.iconDisplay_i = function () {
                var t = new egret.gui.UIAsset();
                this.iconDisplay = t;
                return t;
            };
            p.labelDisplay_i = function () {
                var t = new egret.gui.Label();
                this.labelDisplay = t;
                this.__s(t, ["fontFamily", "size", "textAlign", "textColor", "verticalAlign"], ["Tahoma", 20, "center", 0x1e7465, "middle"]);
                return t;
            };
            p.__7_i = function () {
                var t = new egret.gui.UIAsset();
                this.__7 = t;
                this.__s(t, ["percentHeight", "source", "percentWidth"], [100, "togglebutton_normal_png", 100]);
                return t;
            };
            ToggleButtonSkin._skinParts = ["iconDisplay", "labelDisplay"];
            return ToggleButtonSkin;
        })(egret.gui.Skin);
        simple.ToggleButtonSkin = ToggleButtonSkin;
        egret.registerClass(ToggleButtonSkin,"skins.simple.ToggleButtonSkin");
    })(simple = skins.simple || (skins.simple = {}));
})(skins || (skins = {}));
