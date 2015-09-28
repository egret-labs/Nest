declare module nest.core {
    function startup(info: StartupInfo, callback: Function): void;
    function callCustomMethod(customInfo: any, callback: Function): void;
    interface StartupInfo {
        egretAppId: string;
    }
}
/**
 * 登录功能
 *
 * 逻辑：
 * 1.在游戏中展示一张登录背景界面
 * 2.调用 checkLogin 函数判断是否已经登录过，如果登录过，进入步骤6，否则进入步骤3
 * 3.调用 isSupport 函数判断支持的登录类型，根据登录类型显示对应的登录图标
 * 4.用户点击登录图标后，调用 login 函数打开登录面板进行登录
 * 5.如果登录成功，进入步骤6
 * 6.退出登录界面，进入游戏
 *
 *
 * 登出功能：
 *
 * 逻辑：
 * 1.在游戏中放置一个“退出游戏”或者“切换账号”的按钮
 * 2.用户点击“退出游戏”图标后，调用 logout 函数
 * 3.在登出成功后，返回到登录逻辑的步骤1
 *
 *
 */
declare module nest.user {
    /**
     * 检测是否已登录
     * @param loginInfo 请传递一个null
     * @param callback
     * @callback-param  @see nest.user.LoginCallbackInfo
     */
    function checkLogin(loginInfo: LoginInfo, callback: Function): void;
    /**
     * 调用渠道登录接口
     * @param loginInfo
     * @param callback
     * @callback-param  @see nest.user.LoginCallbackInfo
     */
    function login(loginInfo: LoginInfo, callback: Function): void;
    /**
     * 登出接口
     * @param loginInfo 可以传递null
     * @param callback
     * @callback-param   { result : 0 };
     */
    function logout(loginInfo: LoginInfo, callback: Function): void;
    /**
     * 检测支持何种登录方式
     * @param callback
     * @callback-param  @see nest.user.LoginCallbackInfo
     */
    function isSupport(callback: Function): void;
    /**
     * 登录接口传递参数
     *
     */
    interface LoginInfo {
        /**
         * 登录类型：如 QQ登录，微信支付
         */
        loginType?: string;
    }
    interface LoginCallbackInfo {
        /**
         * 状态值，0表示成功
         * 该值未来可能会被废弃
         */
        status: number;
        /**
         * 结果值，0表示成功
         */
        result: number;
        /**
         * isSupport 函数返回。
         * 登录方式。
         * 以QQ浏览器为例，返回 ["qq","wx"]
         * 开发者应该主动判断登录方式，如果返回了 null ，则表示没有特殊登录方式
         */
        loginType: Array<string>;
        /**
         * checkLogin , login 函数返回。
         * 用户 token 信息，如果checkLogin函数中没有token则表示用户尚未登录
         */
        token: string;
    }
}
declare module nest.iap {
    /**
     * 支付
     * @param orderInfo
     * @param callback
     */
    function pay(orderInfo: PayInfo, callback: Function): void;
    interface PayInfo {
        goodsId: string;
        goodsNumber: string;
        serverId: string;
        ext: string;
    }
    interface PayCallbackInfo {
        result: number;
    }
}
declare module nest.share {
    /**
     * 是否支持分享
     * @param callback
     * @callback-param {status:0, share:0}  share 1支持 0不支持
     */
    function isSupport(callback: Function): void;
    /**
     * 分享
     * @param shareInfo
     * @param callback
     * @callback-param result 0 表示分享成功，-1表示用户取消
     */
    function share(shareInfo: ShareInfo, callback: Function): void;
    /**
     * 分享接口传递参数
     */
    interface ShareInfo {
        title: string;
        description: string;
        img_title: string;
        img_url: string;
        url: string;
    }
    interface ShareCallbackInfo {
        result: number;
    }
}
declare module nest.social {
    function isSupport(callback: Function): void;
    function getFriends(socialInfo: any, callback: Function): void;
    function openBBS(socialInfo: any, callback: Function): void;
}
declare module nest.app {
    interface IDesktopInfo {
        Title: string;
        DetailUrl: string;
        PicUrl: string;
    }
    /**
     * 是否支持特定功能
     * @param callback
     * @callback-param  { status:"0" , attention :"1" , sendToDesktop : "1"} attention|sendToDesktop 1支持 0不支持
     */
    function isSupport(callback: Function): void;
    /**
     * 关注
     * @param appInfo
     * @param callback
     */
    function attention(appInfo: any, callback: Function): void;
    /**
     * 退出游戏，回到 App 界面
     * @param appInfo
     * @param callback
     */
    function exitGame(appInfo: any, callback: Function): void;
    /**
     * 发送到桌面
     * @param appInfo
     * @param callback
     * @param callback-param result 0表示添加桌面成功，-1表示添加失败
     */
    function sendToDesktop(appInfo: any, callback: Function): void;
}
declare module nest {
    interface NestData {
        module: string;
        action: string;
        param?: Object;
    }
    function callRuntime(data: NestData, callback: any, parallel?: boolean): void;
}
declare module egret_native {
    function getOption(option: string): any;
}
declare module nest.cm {
    interface EgretData {
        egretUserId: string;
    }
    function callRuntime(data: NestData, callback: any): void;
    function loginBefore(callback: any): void;
    function loginAfter(postdata: any, callback: any, isNew: boolean): void;
    function payBefore(orderInfo: nest.iap.PayInfo, callback: any): void;
}
declare module nest.cm.user {
    function checkLogin(loginInfo: nest.user.LoginInfo, callback: any): void;
    /**
     * 调用渠道登录接口
     * @param loginInfo
     * @param callback
     * @callback-param  @see nest.user.LoginCallbackInfo
     */
    function login(loginInfo: nest.user.LoginInfo, callback: Function): void;
}
declare module nest.cm.iap {
    var isFirst: boolean;
    /**
     * 支付
     * @param orderInfo
     * @param callback
     */
    function pay(orderInfo: nest.iap.PayInfo, callback: Function): void;
}
declare module nest.cm.share {
    /**
     * 是否支持分享
     * @param callback
     * @callback-param {status:0, share:0}
     */
    function isSupport(callback: Function): void;
}
declare module nest.cm.app {
    /**
     * 初始化浏览器快捷登陆需要的信息（目前只有猎豹可用，其他为空实现）
     * @param param
     */
    function initDesktop(param: nest.app.IDesktopInfo): void;
    /**
     * 是否支持特定功能
     * @param callback
     * @callback-param  { status:"0" , attention :"1" , sendToDesktop : "1"}
     */
    function isSupport(callback: Function): void;
    /**
     * 发送到桌面
     * @param appInfo
     * @param callback
     * @param callback-param result 0表示添加桌面成功，-1表示添加失败
     */
    function sendToDesktop(appInfo: any, callback: Function): void;
}
declare module nest.h5 {
    var uid: number;
    var appid: number;
}
