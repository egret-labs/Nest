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
        var SkinnableDataContainer = (function (_super) {
            __extends(SkinnableDataContainer, _super);
            function SkinnableDataContainer() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.elementsContent = [this.dataGroup_i()];
                this.states = [
                    new egret.gui.State("normal", [
                    ]),
                    new egret.gui.State("disabled", [
                    ])
                ];
            }
            var d = __define,c=SkinnableDataContainer;p=c.prototype;
            d(p, "skinParts"
                ,function () {
                    return SkinnableDataContainer._skinParts;
                }
            );
            p.dataGroup_i = function () {
                var t = new egret.gui.DataGroup();
                this.dataGroup = t;
                t.itemRenderer = new egret.gui.ClassFactory(egret.gui.ItemRenderer);
                t.layout = this.__3_i();
                return t;
            };
            p.__3_i = function () {
                var t = new egret.gui.VerticalLayout();
                this.__s(t, ["gap", "horizontalAlign"], [0, "contentJustify"]);
                return t;
            };
            SkinnableDataContainer._skinParts = ["dataGroup"];
            return SkinnableDataContainer;
        })(egret.gui.Skin);
        simple.SkinnableDataContainer = SkinnableDataContainer;
        egret.registerClass(SkinnableDataContainer,"skins.simple.SkinnableDataContainer");
    })(simple = skins.simple || (skins.simple = {}));
})(skins || (skins = {}));
