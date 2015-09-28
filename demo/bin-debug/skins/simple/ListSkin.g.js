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
        var ListSkin = (function (_super) {
            __extends(ListSkin, _super);
            function ListSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.elementsContent = [this.__4_i()];
                this.states = [
                    new egret.gui.State("normal", [
                    ]),
                    new egret.gui.State("disabled", [
                    ])
                ];
            }
            var d = __define,c=ListSkin;p=c.prototype;
            d(p, "skinParts"
                ,function () {
                    return ListSkin._skinParts;
                }
            );
            p.__4_i = function () {
                var t = new egret.gui.Scroller();
                this.__s(t, ["percentHeight", "horizontalScrollPolicy", "percentWidth"], [100, "off", 100]);
                t.viewport = this.dataGroup_i();
                return t;
            };
            p.dataGroup_i = function () {
                var t = new egret.gui.DataGroup();
                this.dataGroup = t;
                t.layout = this.__3_i();
                return t;
            };
            p.__3_i = function () {
                var t = new egret.gui.VerticalLayout();
                this.__s(t, ["gap", "horizontalAlign"], [0, "contentJustify"]);
                return t;
            };
            ListSkin._skinParts = ["dataGroup"];
            return ListSkin;
        })(egret.gui.Skin);
        simple.ListSkin = ListSkin;
        egret.registerClass(ListSkin,"skins.simple.ListSkin");
    })(simple = skins.simple || (skins.simple = {}));
})(skins || (skins = {}));
