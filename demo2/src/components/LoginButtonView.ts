/**
 *
 * @author 
 *
 */
class LoginButtonView extends egret.gui.SkinnableContainer{

    right_ui:egret.gui.UIAsset;
    name_txt:egret.gui.Label;

    private type:string;
    private url:string;

	public constructor(type:string, url:string) {
        super();
        this.skinName = skins.LoginTypeViewSkin;
	}
	
	public createChildren(){
        super.createChildren();

        if (this.url && this.url != "") {
            this.right_ui.visible = true;

            var con:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
            var shape:egret.Shape = new egret.Shape();
            shape.graphics.beginFill(0xff0000);
            shape.graphics.drawCircle(100, 100, 100);
            shape.graphics.endFill();
            con.addChild(shape);

            var bitmap:egret.Bitmap = new egret.Bitmap();
            RES.getResByUrl(this.url, function (texture) {
                bitmap.texture = texture;
                bitmap.width = 200;
                bitmap.height = 200;
            }, this, RES.ResourceItem.TYPE_IMAGE);
            con.addChild(bitmap);
            bitmap.mask = shape;

            var icon:egret.gui.UIAsset = new egret.gui.UIAsset();
            icon.source = con;
            this.addElementAt(icon, 0);
        }
        else {

            this.right_ui.visible = false;
        }

        var ui:egret.gui.UIAsset = new egret.gui.UIAsset();
        ui.source = this.type;
        this.addElementAt(ui, 0);

        this.name_txt.text = this.getLabelName(this.type, this.url && this.url != "");
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


}
