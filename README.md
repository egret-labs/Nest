# Nest

最新 Nest 下载地址

[Nest 2.5](https://github.com/egret-labs/Nest)

[Nest 2.0](https://github.com/egret-labs/Nest/tree/2.0.x)


## 接入

   按照[第三方库接入流程](http://edn.egret.com/cn/index.php/article/index/id/172)将Nest添加到项目中

## 调用流程
`请完全按照本步骤来，不要修改任何顺序`

 * 登录功能逻辑：

		1.初始化项目数据
		2.在游戏中展示一张登录背景界面
		3.调用 checkLogin 函数判断是否已经登录过，如果登录过并且没有记录登出状态，进入步骤7，否则进入步骤4
		4.调用 isSupport 函数判断支持的登录类型，根据登录类型显示对应的登录图标
		5.用户点击登录图标后，调用 login 函数打开登录面板进行登录
 		6.如果登录成功，进入步骤7
 		7.退出登录界面，进入游戏，取消登出状态

 * 登出功能逻辑：

		1.在游戏中放置一个“退出游戏”或者“切换账号”的按钮
		2.用户点击“退出游戏”图标后，调用 logout 函数
		3.在登出成功后，返回到登录逻辑的步骤4，并且手动记录登出状态

## api 参数说明

在 Nest 中，使用了传参并通过回调函数返回数据，这里通过 nest.core.startup 来说明下各个参数的意思。

* nest.core.startup(info:nest.core.StartupInfo, callback:(resultInfo:nest.core.ResultCallbackInfo)=>any)： 开发者调用的 api 方法。

* info:nest.core.StartupInfo：方法需要传入的参数，为 nest.core.StartupInfo 类型。

		由于在 Nest 中 nest.core.StartupInfo 被声明为一个接口（interface），因此大家不可以直接通过 new 的方式来创建 nest.core.StartupInfo 对象，其实只需要通过简单的 Object 对象赋值即可。比如这里可以直接通过赋值
		{"egretAppId": 88888, "version": 2}.

* callback:(resultInfo:nest.core.ResultCallbackInfo)=>any)：方法回调函数，一个拥有参数为 resultInfo:nest.core.LoginCallbackInfo 返回值为 any 的函数。

* 示例：
 
		var info:any = {};
		//设置游戏id，这里是在测试步骤1中获取的游戏appId
		info.egretAppId = 88888;
		//设置使用 Nest 版本。默认为1，新版请传递2
		info.version = 2;
		//在debug模式下，请求nest接口会有日志输出。建议调试时开启
		info.debug = true;
		nest.core.startup(info, function (data) {
		    if(data.result == 0) {
		        //初始化成功，进入游戏
		    }
		    else {
		        //初始化失败，可能是url地址有问题，请联系官方解决
		    }
		})

## api 详解

##### 1、nest.core.startup 初始化项目数据

* 参数说明

		info:nest.core.StartupInfo 初始化信息。比如 {"egretAppId" : 88888, "version" : 2}
		  |--- egretAppId egret 开放平台申请的游戏 id
		  |--- version 使用的Nest版本,新版为2,可以不传

		callback:(resultInfo:ResultCallbackInfo)=>any。回调结果函数
			resultInfo：回调函数的参数数据
				|--- result 回调参数是否正确，0 正确，其他 错误

* 示例

		var info:any = {};
		//设置游戏id，这里是在测试步骤1中获取的游戏appId
		info.egretAppId = 88888;
		//设置使用 Nest 版本。默认为1，新版请传递2
		info.version = 2;
		//在debug模式下，请求nest接口会有日志输出。建议调试时开启
		info.debug = true;
		nest.core.startup(info, function (data) {
		    if(data.result == 0) {
		        //初始化成功，进入游戏
		    }
		    else {
		        //初始化失败，可能是url地址有问题，请联系官方解决
		    }
		})

##### 2、nest.user.checkLogin 检测是否已经登录

* 参数说明

		loginInfo:nest.user.LoginInfo 初始化信息。请填 {}

		callback:(resultInfo:LoginCallbackInfo)=>any 回调结果函数
			resultInfo：回调函数的参数数据
				|--- result 回调参数是否正确，0 正确，其他 错误
				|--- token 用户 token 信息，result 为 0 时才会有

* 示例

		nest.user.checkLogin({}, function (data) {
		     if(data.token) {
		         //用户已经登录过，获取用户token和用户id
		         //这时候就不需要显示登陆界面，直接进入游戏即可
		         var token = data.token;
		     }
		     else {
		         //用户没有登录，调用 nest.user.isSupport，根据loginType显示登陆按钮
		     }
		 })

##### 3、nest.user.isSupport 检测支持何种登录方式
* 参数说明

		callback:(resultInfo:nest.user.UserSupportCallbackInfo)=>any 回调结果函数
			resultInfo：回调函数的参数数据
				|--- loginTypes 登录方式，以QQ浏览器为例，返回 [{"loginType": "qq", "accInfo": {nickName : "name", avatarUrl :"a.png"}}]
				|--- loginType 登录方式，以QQ浏览器为例，返回 ["qq","wx"]

* 示例

		nest.user.isSupport({}, function (data:nest.user.UserSupportCallbackInfo) {
		    //获取是否支持nest.user.getInfo接口，有该字段并且该字段值为1表示支持
		    var getInfo = data.getInfo;
		    //已经登录过的信息，该字段目前只有新版qq浏览器runtime有
		    //如果有该字段，请放弃使用loginType字段，并用该字段获取可用的登录方式以及登录信息
		    var loginTypes = data.loginTypes;
		    if(loginTypes && loginTypes.length) {
		        for(var i:number = 0 ; i < loginTypes.length ; i++) {
		            var info:any = loginTypes[i];
		            //登录类型
		            var infoLoginType:string = info.loginType;
		            //如果不为空，标识本地已有该类型的身份信息
		            var accInfo:any = info.accInfo;
		            if(accInfo) {
		                //昵称
		                var nickName = accInfo.nickName;
		                //头像
		                var avatarUrl = accInfo.avatarUrl;
		            }
		        }
		    }    
		    else if (data.loginType && data.loginType.length) {
		        //获取登录方式数组，如["qq","wx"]
		        //开发者应该主动判断登录方式，如果返回了 null ，则表示没有特殊登录方式
		        var loginType = data.loginType;
		    }
		    else {
		    	//直接调用 login，无需传参数
		    }
		})

###### 4、nest.user.login 调用渠道登录接口
* 参数说明

		loginInfo:nest.user.LoginInfo 初始化信息。比如 {"loginType" : "qq"}，没有 loginType 则 {}
		  |--- loginType 登陆类型，没有则不需要赋值

		callback:(resultInfo:ResultCallbackInfo)=>any。回调结果函数
			resultInfo：回调函数的参数数据
				|--- result 回调参数是否正确，0 正确，其他 错误
				|--- token 用户 token 信息，result 为 0 时才会有

* 示例

		//如果是用户点击某个登录按钮，则传递loginType，否则不传
		nest.user.login({loginType:qq}, function (data) {
		    if(data.token) {
		        //登录成功，获取用户token，并根据token获取用户id，之后进入游戏
		        //获取id代码请看Nest工程中的LoginView文件，这个代码请务必放在服务端实现
		        var token = data.token;
		        
		    }
		    else {
		        //登录失败，需要重新登陆
		    }
		})

###### nest.user.logout 登出
* 参数说明

		loginInfo:nest.user.LoginInfo 请传入 {}

		callback:(resultInfo:ResultCallbackInfo)=>any。回调结果函数
			resultInfo：回调函数的参数数据
				|--- result 回调参数是否正确，0 正确，其他 错误

* 示例

		nest.user.logout({}, function (resultInfo:nest.user.LoginCallbackInfo) {
		    if (resultInfo.result == 0) {
		    	//登出成功
		    }
		    else {
		        //登出失败
		    }
		});

###### nest.user.getInfo 获取用户信息，目前只有qq浏览器支持
* 参数说明

		loginInfo:nest.user.LoginInfo 请传入 {}

		callback:(resultInfo:Object)=>any 回调结果函数
			resultInfo：回调函数的参数数据

* 示例

		nest.user.getInfo({}, function (resultInfo:Object) {
		});


###### nest.iap.pay 支付
* 参数说明

		orderInfo:nest.iap.PayInfo 支付信息
				|--- goodsId 配置id
				|--- goodsNumber 购买数量
				|--- serverId 哪个服
				|--- ext

		callback:(resultInfo:ResultCallbackInfo)=>any。回调结果函数
			resultInfo：回调函数的参数数据
				|--- result 回调参数是否正确，0 正确，其他 错误

* 示例

		nest.iap.pay(payInfo, function (callInfo:nest.user.LoginCallbackInfo) {
		    if (callInfo.result == 0) {
		    	//支付成功，请验证支付额度是否正确
		    }
		    else {
		    	//支付失败
		    }
		});



###### nest.share.isSupport 是否支持分享
###### nest.share.share 分享

###### nest.social.isSupport 社交相关支持
###### nest.social.getFriends 获取好友列表
###### nest.social.openBBS 打开论坛

###### nest.app.isSupport 是否支持特定功能
###### nest.app.attention 关注
###### nest.app.exitGame 退出游戏，回到 App 界面
###### nest.app.sendToDesktop 发送到桌面
###### nest.app.getInfo 获取客服信息



## 本地测试 （使用测试gameId 88888 测试）


###### h5

* http://10.0.4.160/Egret/Nest/launcher/index.html?platInfo=open_88888_9166
 选择其他登陆，测试账号 guest/123456

###### runtime

* runtime目前只支持android系统。

* 下载 egret runtime 的测试包  http://arena.egret.com/Egret_Guidance/EgretRuntimeCheck.zip

* 提供一个可以返回类似如下数据的地址（即 runtime 测试地址）比如 http://pay.csgj.egret-labs.org:12000/main.php。

~~~
 {
	 //游戏代码包路径
	 "code_url":"http://your-cdn-domain/game/version_1/game_code.zip",
	 //游戏资源前缀路径
	 "update_url":"http://your-cdn-domain/game/version_1/",
	 //游戏代码公钥，在默认情况下请勿填写此字段
	 "password":"your-code-password",
	 //游戏参数
	 "customParams":
	 {
		 //使用自定义Loading功能，在默认情况下请勿填写此字段
		 "customLoading":1
	 }
 }
 ~~~

* 用软件扫码扫描上述地址，测试 game id  88888，点击启动游戏即可


## 线上测试

* 需要配置在平台以及渠道配置相关信息后方可测试。


* runtime:（目前只支持qq\猎豹，且必须先确保游戏已经在对应的平台上配置过游戏信息，非h5信息）
         http://runtime.egret-labs.org/nest/runtime.html?url=http://10.0.11.177/Egret/Nest/test/publishJson.html&id=88&orientation=portrait

         url：为 游戏提供的runtime地址（返回的json数据的地址）
         id：测试游戏的gameId
         orientation：横竖屏设置 portrait 竖屏  landscape横屏