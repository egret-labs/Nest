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
        var TextAreaSkin = (function (_super) {
            __extends(TextAreaSkin, _super);
            function TextAreaSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.__s(this, ["minHeight", "minWidth"], [30, 100]);
                this.elementsContent = [this.__3_i(), this.textDisplay_i()];
                this.states = [
                    new egret.gui.State("normal", [
                    ]),
                    new egret.gui.State("disabled", [
                        new egret.gui.SetProperty("textDisplay", "textColor", 0xAAAAAA)
                    ])
                ];
            }
            var d = __define,c=TextAreaSkin;p=c.prototype;
            d(p, "skinParts"
                ,function () {
                    return TextAreaSkin._skinParts;
                }
            );
            p.__3_i = function () {
                var t = new egret.gui.UIAsset();
                this.__s(t, ["percentHeight", "source", "percentWidth"], [100, "textbox_png", 100]);
                return t;
            };
            p.textDisplay_i = function () {
                var t = new egret.gui.EditableText();
                this.textDisplay = t;
                this.__s(t, ["bottom", "percentHeight", "left", "right", "size", "textColor", "top", "percentWidth"], [8, 100, 10, 10, 20, 0x000000, 8, 100]);
                return t;
            };
            TextAreaSkin._skinParts = ["textDisplay"];
            return TextAreaSkin;
        })(egret.gui.Skin);
        simple.TextAreaSkin = TextAreaSkin;
        egret.registerClass(TextAreaSkin,"skins.simple.TextAreaSkin");
    })(simple = skins.simple || (skins.simple = {}));
})(skins || (skins = {}));
