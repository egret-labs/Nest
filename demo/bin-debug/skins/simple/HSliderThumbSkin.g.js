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
        var HSliderThumbSkin = (function (_super) {
            __extends(HSliderThumbSkin, _super);
            function HSliderThumbSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.elementsContent = [this.__4_i()];
                this.states = [
                    new egret.gui.State("up", [
                    ]),
                    new egret.gui.State("down", [
                    ]),
                    new egret.gui.State("disabled", [
                    ])
                ];
            }
            var d = __define,c=HSliderThumbSkin;p=c.prototype;
            p.__4_i = function () {
                var t = new egret.gui.UIAsset();
                this.__s(t, ["fillMode", "percentHeight", "source", "percentWidth"], ["scale", 100, "hslider_thumb_png", 100]);
                return t;
            };
            return HSliderThumbSkin;
        })(egret.gui.Skin);
        simple.HSliderThumbSkin = HSliderThumbSkin;
        egret.registerClass(HSliderThumbSkin,"skins.simple.HSliderThumbSkin");
    })(simple = skins.simple || (skins.simple = {}));
})(skins || (skins = {}));
