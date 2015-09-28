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
        var HScrollBarSkin = (function (_super) {
            __extends(HScrollBarSkin, _super);
            function HScrollBarSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.__s(this, ["minHeight", "minWidth"], [10, 20]);
                this.elementsContent = [this.track_i(), this.thumb_i()];
                this.states = [
                    new egret.gui.State("normal", [
                    ]),
                    new egret.gui.State("disabled", [
                    ])
                ];
            }
            var d = __define,c=HScrollBarSkin;p=c.prototype;
            d(p, "skinParts"
                ,function () {
                    return HScrollBarSkin._skinParts;
                }
            );
            p.thumb_i = function () {
                var t = new egret.gui.Button();
                this.thumb = t;
                this.__s(t, ["height", "skinName", "verticalCenter", "width"], [10, skins.simple.HScrollBarThumbSkin, 0, 24]);
                return t;
            };
            p.track_i = function () {
                var t = new egret.gui.UIAsset();
                this.track = t;
                this.__s(t, ["height", "left", "right", "source", "verticalCenter", "percentWidth"], [10, 10, 10, "hscrolltrack_png", 0, 100]);
                return t;
            };
            HScrollBarSkin._skinParts = ["track", "thumb"];
            return HScrollBarSkin;
        })(egret.gui.Skin);
        simple.HScrollBarSkin = HScrollBarSkin;
        egret.registerClass(HScrollBarSkin,"skins.simple.HScrollBarSkin");
    })(simple = skins.simple || (skins.simple = {}));
})(skins || (skins = {}));
