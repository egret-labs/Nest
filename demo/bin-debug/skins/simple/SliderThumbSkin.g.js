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
        var SliderThumbSkin = (function (_super) {
            __extends(SliderThumbSkin, _super);
            function SliderThumbSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.__s(this, ["height", "width"], [0, 0]);
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
            var d = __define,c=SliderThumbSkin;p=c.prototype;
            p.__4_i = function () {
                var t = new egret.gui.UIAsset();
                this.__s(t, ["source", "x", "y"], ["hslider_thumb_png", -9, -9]);
                return t;
            };
            return SliderThumbSkin;
        })(egret.gui.Skin);
        simple.SliderThumbSkin = SliderThumbSkin;
        egret.registerClass(SliderThumbSkin,"skins.simple.SliderThumbSkin");
    })(simple = skins.simple || (skins.simple = {}));
})(skins || (skins = {}));
