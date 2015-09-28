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
        var SkinnableContainerSkin = (function (_super) {
            __extends(SkinnableContainerSkin, _super);
            function SkinnableContainerSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.__s(this, ["maxWidth", "minHeight", "minWidth"], [710, 230, 470]);
                this.elementsContent = [this.contentGroup_i()];
                this.states = [
                    new egret.gui.State("normal", [
                    ]),
                    new egret.gui.State("disabled", [
                    ])
                ];
            }
            var d = __define,c=SkinnableContainerSkin;p=c.prototype;
            d(p, "skinParts"
                ,function () {
                    return SkinnableContainerSkin._skinParts;
                }
            );
            p.contentGroup_i = function () {
                var t = new egret.gui.Group();
                this.contentGroup = t;
                this.__s(t, ["percentHeight", "percentWidth"], [100, 100]);
                return t;
            };
            SkinnableContainerSkin._skinParts = ["contentGroup"];
            return SkinnableContainerSkin;
        })(egret.gui.Skin);
        simple.SkinnableContainerSkin = SkinnableContainerSkin;
        egret.registerClass(SkinnableContainerSkin,"skins.simple.SkinnableContainerSkin");
    })(simple = skins.simple || (skins.simple = {}));
})(skins || (skins = {}));
