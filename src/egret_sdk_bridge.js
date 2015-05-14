/**
 * Created by wander on 15-4-21.
 */
if (!("egret_native" in this)){

    nest.user.checkLogin = function(loginInfo,callback){
        EgretH5Sdk.checkLogin(callback,this);
    }

    nest.user.login = function(loginInfo,callback){
        EgretH5Sdk.login(callback,this);

    }
}