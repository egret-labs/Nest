declare var CMGAME_EGRET: {
    checkIsGameSDK(callback:Function): void;
    saveShortcutInfo(option:Object): void;
    pushIcon(option:Object): void;
    dispatchGameLoginData(option:Object, callback:Function):void;
    getGameSDKDeviceID():string;
    getGameSDKDeviceIDAsync(callback:Function):void;
}