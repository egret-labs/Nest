var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var __define = this.__define || function (o, p, g, s) {   Object.defineProperty(o, p, { configurable:true, enumerable:true, get:g,set:s }) };
/**
 *
 * @author
 *
 */
var GameEvent = (function (_super) {
    __extends(GameEvent, _super);
    function GameEvent(type) {
        _super.call(this, type, true);
    }
    var d = __define,c=GameEvent;p=c.prototype;
    GameEvent.LOGIN_SUCCESS = "loginSuccess";
    return GameEvent;
})(egret.Event);
egret.registerClass(GameEvent,"GameEvent");
