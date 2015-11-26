declare module nest.core {
    interface StartupInfo {
        /**
         * egret 平台分配的 AppId
         */
        egretAppId: number;
    }
    interface ResultCallbackInfo {
        /**
         * 回调参数是否正确，0 正确，其他 错误
         */
        result: number;
    }
    /**
     * @private
     * @type {number}
     */
    var appId: number;
    /**
     * 启动Nest
     * @param info 启动参数
     * @param callback 启动完成回调
     */
    function startup(info: StartupInfo, callback: (resultInfo: ResultCallbackInfo) => any): void;
    function callCustomMethod(customInfo: any, callback: Function): void;
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
     * @param loginInfo 请传递一个{}
     * @param callback
     * @callback-param  @see nest.user.LoginCallbackInfo
     */
    function checkLogin(loginInfo: LoginInfo, callback: (resultInfo: LoginCallbackInfo) => any): void;
    /**
     * 调用渠道登录接口
     * @param loginInfo
     * @param callback
     * @callback-param  @see nest.user.LoginCallbackInfo
     */
    function login(loginInfo: LoginInfo, callback: (resultInfo: LoginCallbackInfo) => any): void;
    /**
     * 登出接口
     * @param loginInfo 可以传递{}
     * @param callback
     * @callback-param   { result : 0 };
     */
    function logout(loginInfo: LoginInfo, callback: (resultInfo: core.ResultCallbackInfo) => any): void;
    /**
     * 检测支持何种登录方式
     * @param callback
     * @callback-param  @see nest.user.LoginCallbackInfo
     */
    function isSupport(callback: (resultInfo: UserSupportCallbackInfo) => any): void;
    /**
     * 获取用户信息，目前只有qq浏览器支持
     * @param callback
     */
    function getInfo(callback: (resultInfo: Object) => any): void;
    /**
     * 登录接口传递参数
     *
     */
    interface LoginInfo {
        /**
         * 登录类型：如 QQ登录，微信支付。如果没有，则不需要赋值
         */
        loginType?: string;
    }
    interface LoginCallbackInfo extends core.ResultCallbackInfo {
        /**
         * checkLogin , login 函数返回。
         * 用户 token 信息，如果checkLogin函数中没有token则表示用户尚未登录
         */
        token: string;
    }
    interface UserSupportCallbackInfo extends core.ResultCallbackInfo {
        /**
         * isSupport 函数返回。
         * 登录方式。
         * 以QQ浏览器为例，返回 ["qq","wx"]
         * 开发者应该主动判断登录方式，如果返回了 null ，则表示没有特殊登录方式
         */
        loginType: Array<string>;
        /**
         * 是否支持获取用户信息
         */
        getInfo?: number;
    }
}
declare module nest.iap {
    /**
     * 支付
     * @param orderInfo
     * @param callback
     */
    function pay(orderInfo: PayInfo, callback: (result: PayCallbackInfo) => any): void;
    interface PayInfo {
        goodsId: string;
        goodsNumber: string;
        serverId: string;
        ext: string;
    }
    interface PayCallbackInfo extends core.ResultCallbackInfo {
        ext?: string;
    }
}
declare module nest.share {
    /**
     * 是否支持分享
     * @param callback
     * @callback-param {status:0, share:0}  share 1支持 0不支持
     */
    function isSupport(callback: (resultInfo: ShareSupportCallbackInfo) => any): void;
    /**
     * 分享
     * @param shareInfo
     * @param callback
     * @callback-param result 0 表示分享成功，-1表示用户取消
     */
    function share(shareInfo: ShareInfo, callback: (resultInfo: ShareCallbackInfo) => any): void;
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
    interface ShareCallbackInfo extends core.ResultCallbackInfo {
    }
    interface ShareSupportCallbackInfo extends core.ResultCallbackInfo {
        status: number;
        share: number;
    }
}
declare module nest.social {
    function isSupport(callback: (resultInfo: SocialSupportCallbackInfo) => any): void;
    function getFriends(socialInfo: any, callback: Function): void;
    function openBBS(socialInfo: any, callback: (resultInfo: core.ResultCallbackInfo) => any): void;
    interface SocialSupportCallbackInfo extends core.ResultCallbackInfo {
        status: number;
        getFriends?: number;
        openBBS?: number;
    }
}
declare module nest.app {
    /**
     * 是否支持特定功能
     * @param callback
     * @callback-param  { status:"0" , attention :"1" , sendToDesktop : "1"} attention|sendToDesktop 1支持 0不支持
     */
    function isSupport(callback: (resultInfo: SocialSupportCallbackInfo) => any): void;
    /**
     * 关注
     * @param appInfo
     * @param callback
     */
    function attention(appInfo: any, callback: (resultInfo: core.ResultCallbackInfo) => any): void;
    /**
     * 退出游戏，回到 App 界面
     * @param appInfo
     * @param callback
     */
    function exitGame(appInfo: any, callback: (resultInfo: core.ResultCallbackInfo) => any): void;
    /**
     * 发送到桌面
     * @param appInfo
     * @param callback
     * @param callback-param result 0表示添加桌面成功，-1表示添加失败
     */
    function sendToDesktop(appInfo: any, callback: (resultInfo: core.ResultCallbackInfo) => any): void;
    /**
     * 获取渠道信息
     * @param appInfo 获取信息参数,没有请传递{}
     * @param callback 回调函数
     * 回调参数:
     * {
     * "result": , //result为0说明成功
     * "contact": , //可用联系方式
     *   "qq": //qq联系方式数组[],如果没有响应联系方式将没有该字段
     *   "qqgroup": //qq群联系方式数组[],如果没有响应联系方式将没有该字段
     *   "weixin": //微信联系方式数组[],如果没有响应联系方式将没有该字段
     *   "email": //email联系方式数组[],如果没有响应联系方式将没有该字段
     * }
     */
    function getInfo(appInfo: any, callback: (resultInfo: InfoesCallbackInfo) => any): void;
    interface SocialSupportCallbackInfo extends core.ResultCallbackInfo {
        status: number;
        attention?: number;
        sendToDesktop?: number;
        exitGame?: number;
    }
    interface InfoesCallbackInfo extends core.ResultCallbackInfo {
        contact: string;
        qq?: string[];
        qqgroup?: string[];
        weixin?: string[];
        email?: string[];
    }
}
declare module nest {
    /**
     * @private
     */
    interface NestData {
        module: string;
        action: string;
        param?: Object;
    }
    /**
     * @private
     * @param data
     * @param callback
     * @param parallel
     */
    function callRuntime(data: NestData, callback: any, parallel?: boolean): void;
}
declare module egret_native {
    function getOption(option: string): any;
}
declare module nest.cm {
    /**
     * @private
     */
    interface EgretData {
        egretUserId: string;
    }
    /**
     * @private
     */
    interface NestData {
        module: string;
        action: string;
        param?: any;
        postData?: any;
    }
    /**
     * @private
     */
    var spid: number;
    /**
     * @private
     */
    function getSpid(): number;
    /**
     * @private
     */
    function callRuntime(data: NestData, callback: any): void;
    /**
     * @private
     */
    function loginBefore(callback: any): void;
    /**
     * @private
     */
    function loginAfter(postdata: any, callback: any, isNew: boolean): void;
    /**
     * @private
     */
    function payBefore(orderInfo: nest.iap.PayInfo, callback: any): void;
}
/**
 * @private
 */
declare module nest.cm.user {
    /**
     * @private
     */
    function checkLogin(loginInfo: nest.user.LoginInfo, callback: any): void;
    /**
     * @private
     * 调用渠道登录接口
     * @param loginInfo
     * @param callback
     * @callback-param  @see nest.user.LoginCallbackInfo
     */
    function login(loginInfo: nest.user.LoginInfo, callback: Function): void;
}
/**
 * @private
 */
declare module nest.cm.iap {
    /**
     * @private
     */
    var isFirst: boolean;
    /**
     * 支付
     * @param orderInfo
     * @param callback
     */
    function pay(orderInfo: nest.iap.PayInfo, callback: Function): void;
}
/**
 * @private
 */
declare module nest.cm.share {
    /**
     * 是否支持分享
     * @private
     * @param callback
     * @callback-param {status:0, share:0}
     */
    function isSupport(callback: Function): void;
}
/**
 * @private
 */
declare module nest.cm.app {
    /**
     * @private
     */
    interface IDesktopInfo {
        Title: string;
        DetailUrl: string;
        PicUrl: string;
    }
    /**
     * @private
     * 初始化浏览器快捷登陆需要的信息（目前只有猎豹可用，其他为空实现）
     * @param param
     */
    function $initDesktop(param: IDesktopInfo): void;
    /**
     * 是否支持特定功能
     * @private
     * @param callback
     * @callback-param  { status:"0" , attention :"1" , sendToDesktop : "1"}
     */
    function isSupport(callback: Function): void;
    /**
     * 发送到桌面
     * @private
     * @param appInfo
     * @param callback
     * @param callback-param result 0表示添加桌面成功，-1表示添加失败
     */
    function sendToDesktop(appInfo: any, callback: Function): void;
}
declare module nest.h5 {
    var uid: number;
}
declare class NestForQQHall {
}
declare module nest.qqhall {
    var login_call_type: number;
    var login_back_call_type: number;
    var pay_call_type: number;
    var share_call_type: number;
    var login_callback_type: number;
    var pay_callback_type: number;
    var share_callback_type: number;
    var loginCallback: Function;
    var payCallback: Function;
    var shareCallback: Function;
    var version: string;
    var loginNum: number;
    var spid: number;
    var gameType: any;
    var gameVersion: any;
    var OpenId: any;
    var OpenKey: any;
    var enterType: any;
    var enterId: any;
    var payToken: any;
    var userId: any;
    var payOrderInfo: any;
    function payBefore(orderInfo: nest.iap.PayInfo, callback: any): void;
    function callHall(data: any): void;
}
declare module nest.qqhall.user {
    function isSupport(callback: Function): void;
    function checkLogin(loginInfo: nest.user.LoginInfo, callback: Function): void;
    function login(loginInfo: nest.user.LoginInfo, callback: Function): void;
}
declare module nest.qqhall.iap {
    function pay(orderInfo: nest.iap.PayInfo, callback: Function): void;
    /**
     * 大厅充值成功后，再次调用付费接口
     */
    function repay(): void;
}
declare module nest.qqhall.app {
    function isSupport(callback: Function): void;
    function exitGame(callback: Function): void;
    function attention(appInfo: any, callback: Function): void;
    function sendToDesktop(appInfo: any, callback: Function): void;
}
declare module nest.qqhall.share {
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
    function share(shareInfo: nest.share.ShareInfo, callback: Function): void;
}
declare module nest.qqhall.social {
    function isSupport(callback: Function): void;
    function getFriends(socialInfo: any, callback: Function): void;
    function openBBS(socialInfo: any, callback: Function): void;
}
