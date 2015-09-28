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
        var DropDownListOpenButtonSkin = (function (_super) {
            __extends(DropDownListOpenButtonSkin, _super);
            function DropDownListOpenButtonSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.__s(this, ["height", "minWidth"], [60, 140]);
                this.elementsContent = [this.__4_i(), this.__5_i()];
                this.states = [
                    new egret.gui.State("up", [
                    ]),
                    new egret.gui.State("down", [
                        new egret.gui.SetProperty("__4", "source", "DropDownListButtonSkin_down_png"),
                        new egret.gui.SetProperty("__5", "source", "dropdownlist_arrow_down_png")
                    ]),
                    new egret.gui.State("disabled", [
                    ])
                ];
            }
            var d = __define,c=DropDownListOpenButtonSkin;p=c.prototype;
            p.__4_i = function () {
                var t = new egret.gui.UIAsset();
                this.__4 = t;
                this.__s(t, ["percentHeight", "source", "percentWidth"], [100, "DropDownListButtonSkin_up_png", 100]);
                return t;
            };
            p.__5_i = function () {
                var t = new egret.gui.UIAsset();
                this.__5 = t;
                this.__s(t, ["right", "source", "verticalCenter"], [4, "dropdownlist_arrow_up_png", 0]);
                return t;
            };
            return DropDownListOpenButtonSkin;
        })(egret.gui.Skin);
        simple.DropDownListOpenButtonSkin = DropDownListOpenButtonSkin;
        egret.registerClass(DropDownListOpenButtonSkin,"skins.simple.DropDownListOpenButtonSkin");
    })(simple = skins.simple || (skins.simple = {}));
})(skins || (skins = {}));
