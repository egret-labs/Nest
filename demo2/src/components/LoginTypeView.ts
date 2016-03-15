/**
 *
 * @author
 *
 */
class LoginTypeView extends egret.gui.SkinnableComponent {


    public btnGroup:egret.gui.Group;

    private loginType:nest.user.ILoginTypes;

    public constructor(loginType:nest.user.ILoginTypes) {
        super();

        this.loginType = loginType;
        this.skinName = skins.LoginTypeViewSkin;
    }

    public createChildren() {
        super.createChildren();

        var self = this;

        for (var i:number = 0; i < this.loginType.loginTypes.length; i++) {
            var logT:nest.user.ILoginType = this.loginType.loginTypes[i];

            var url = "";
            if (logT.accInfo && logT.accInfo.avatarUrl) {
                url = logT.accInfo.avatarUrl;
            }
            var btn:LoginButtonView = new LoginButtonView(logT.loginType, url);
            btn.name = logT.loginType;
            this.btnGroup.addElement(btn);
            btn.scaleX = btn.scaleY = 0.5;

            btn.touchEnabled = true;
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e:egret.TouchEvent) {
                self.loginType.onChoose(this.name);
            }, btn);
        }
    }

    private getLabelName(type:string, hasUrl:boolean):string {

        var str:string = "";
        switch (type) {
            case "qq" :
                str = "qq";
                break;
            case "wx" :
                str = "微信";
                break;
            case "wb" :
                str = "微博";
                break;
        }

        if (hasUrl) {
            return str + "--" + "一键登录";
        }

        return str + "登录";
    }

    private onClickHandler(e:egret.TouchEvent):void {
        var btn:egret.gui.Button = <egret.gui.Button>e.currentTarget;
        var index:number = this.btnGroup.getElementIndex(btn);
        var value:string = this.loginType[index];

        console.log(value);

        new Login().login(value);
    }
}
