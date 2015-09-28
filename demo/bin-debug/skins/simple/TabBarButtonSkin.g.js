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
        var TabBarButtonSkin = (function (_super) {
            __extends(TabBarButtonSkin, _super);
            function TabBarButtonSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.__s(this, ["height", "minWidth"], [60, 140]);
                this.elementsContent = [this.__7_i(), this.labelDisplay_i()];
                this.states = [
                    new egret.gui.State("up", [
                    ]),
                    new egret.gui.State("down", [
                        new egret.gui.SetProperty("__7", "source", "button_down_png")
                    ]),
                    new egret.gui.State("disabled", [
                        new egret.gui.SetProperty("__7", "source", "button_disabled_png")
                    ]),
                    new egret.gui.State("upAndSelected", [
                        new egret.gui.SetProperty("__7", "source", "button_down_png")
                    ]),
                    new egret.gui.State("downAndSelected", [
                        new egret.gui.SetProperty("__7", "source", "button_down_png")
                    ]),
                    new egret.gui.State("disabledAndSelected", [
                        new egret.gui.SetProperty("__7", "source", "button_down_png")
                    ])
                ];
            }
            var d = __define,c=TabBarButtonSkin;p=c.prototype;
            d(p, "skinParts"
                ,function () {
                    return TabBarButtonSkin._skinParts;
                }
            );
            p.labelDisplay_i = function () {
                var t = new egret.gui.Label();
                this.labelDisplay = t;
                this.__s(t, ["bottom", "fontFamily", "left", "right", "size", "textAlign", "textColor", "top", "verticalAlign"], [12, "Tahoma", 10, 10, 20, "center", 0x111111, 8, "middle"]);
                return t;
            };
            p.__7_i = function () {
                var t = new egret.gui.UIAsset();
                this.__7 = t;
                this.__s(t, ["percentHeight", "source", "percentWidth"], [100, "button_normal_png", 100]);
                return t;
            };
            TabBarButtonSkin._skinParts = ["labelDisplay"];
            return TabBarButtonSkin;
        })(egret.gui.Skin);
        simple.TabBarButtonSkin = TabBarButtonSkin;
        egret.registerClass(TabBarButtonSkin,"skins.simple.TabBarButtonSkin");
    })(simple = skins.simple || (skins.simple = {}));
})(skins || (skins = {}));
