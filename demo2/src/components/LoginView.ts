/**
 *
 * @author 
 *
 */
class LoginView extends egret.gui.SkinnableComponent{
	
    
    public info_txt: egret.gui.Label;
    
    public login_button: egret.gui.Button;
    quickTest_btn: egret.gui.Button;
    public constructor() {
        super();
        this.skinName = skins.LoginViewSkin;
	}
	
	
	public createChildren(){
        super.createChildren();  
        //this.login_button.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchTapHandler,this);
        //this.quickTest_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onQuickTestHandler,this);

        this.onTouchTapHandler(null);
	}
	
	private onQuickTestHandler(e:egret.TouchEvent):void {
        utils.changeView(new QuickTestView());
	}
	
	private onTouchTapHandler(e:egret.TouchEvent):void{

        var self = this;
        nest.easeuser.startup({egretAppId : 88888, version : 2, debug:true}, function(resultInfo:nest.core.ResultCallbackInfo) {
            if (resultInfo.result == 0) {
                self.login();
            }
        });
	}

	private login():void{
        egret.log("login start");

        var loginTypes:Array<nest.easeuser.ILoginType> = nest.easeuser.getLoginTypes();

        if (loginTypes.length) {//需要显示对应的登录按钮
            var loginView:LoginTypeView = new LoginTypeView(loginTypes, function (logType:nest.easeuser.ILoginType) {
                nest.easeuser.login(logType, function (data:nest.user.LoginCallbackInfo) {
                    if (data.result == 0) {
                        egret.log("log Success");
                        new Login().login(data);
                    }
                    else {
                        egret.log("log Fail");
                    }
                });
            });

            utils.changeView(loginView);
        }
        else {//不需要登录按钮，直接调用登录进游戏
            nest.easeuser.login({}, function (data:nest.user.LoginCallbackInfo) {
                if (data.result == 0) {
                    egret.log("log Success");
                    new Login().login(data);
                }
                else {
                    egret.log("log Fail");
                }
            });
        }
	}
}
