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
        var VSliderSkin = (function (_super) {
            __extends(VSliderSkin, _super);
            function VSliderSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.__s(this, ["minHeight", "minWidth"], [13, 13]);
                this.elementsContent = [this.track_i(), this.trackHighlight_i(), this.thumb_i()];
                this.states = [
                    new egret.gui.State("normal", [
                    ]),
                    new egret.gui.State("disabled", [
                    ])
                ];
            }
            var d = __define,c=VSliderSkin;p=c.prototype;
            d(p, "skinParts"
                ,function () {
                    return VSliderSkin._skinParts;
                }
            );
            p.thumb_i = function () {
                var t = new egret.gui.Button();
                this.thumb = t;
                this.__s(t, ["height", "horizontalCenter", "skinName", "width"], [24, 0, skins.simple.VSliderThumbSkin, 24]);
                return t;
            };
            p.trackHighlight_i = function () {
                var t = new egret.gui.UIAsset();
                this.trackHighlight = t;
                this.__s(t, ["horizontalCenter", "source", "width"], [0, "vslider_fill_png", 10]);
                return t;
            };
            p.track_i = function () {
                var t = new egret.gui.UIAsset();
                this.track = t;
                this.__s(t, ["percentHeight", "horizontalCenter", "source", "width"], [100, 0, "vslider_track_png", 10]);
                return t;
            };
            VSliderSkin._skinParts = ["track", "trackHighlight", "thumb"];
            return VSliderSkin;
        })(egret.gui.Skin);
        simple.VSliderSkin = VSliderSkin;
        egret.registerClass(VSliderSkin,"skins.simple.VSliderSkin");
    })(simple = skins.simple || (skins.simple = {}));
})(skins || (skins = {}));
