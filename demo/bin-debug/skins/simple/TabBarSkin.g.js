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
        var TabBarSkin = (function (_super) {
            __extends(TabBarSkin, _super);
            function TabBarSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.__s(this, ["minHeight", "minWidth"], [20, 60]);
                this.elementsContent = [this.dataGroup_i()];
                this.states = [
                    new egret.gui.State("normal", [
                    ]),
                    new egret.gui.State("disabled", [
                    ])
                ];
            }
            var d = __define,c=TabBarSkin;p=c.prototype;
            d(p, "skinParts"
                ,function () {
                    return TabBarSkin._skinParts;
                }
            );
            p.dataGroup_i = function () {
                var t = new egret.gui.DataGroup();
                this.dataGroup = t;
                this.__s(t, ["percentHeight", "itemRenderer", "itemRendererSkinName", "percentWidth"], [100, new egret.gui.ClassFactory(egret.gui.TabBarButton), skins.simple.TabBarButtonSkin, 100]);
                t.layout = this.__3_i();
                return t;
            };
            p.__3_i = function () {
                var t = new egret.gui.HorizontalLayout();
                this.__s(t, ["gap", "horizontalAlign", "verticalAlign"], [-1, "justify", "contentJustify"]);
                return t;
            };
            TabBarSkin._skinParts = ["dataGroup"];
            return TabBarSkin;
        })(egret.gui.Skin);
        simple.TabBarSkin = TabBarSkin;
        egret.registerClass(TabBarSkin,"skins.simple.TabBarSkin");
    })(simple = skins.simple || (skins.simple = {}));
})(skins || (skins = {}));
