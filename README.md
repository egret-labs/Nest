# Nest

最新 Nest 下载地址

[Nest 2.5](https://github.com/egret-labs/Nest)
[Nest 2.0](https://github.com/egret-labs/Nest/tree/2.0.x)


## 接入

   按照[第三方库接入流程](http://edn.egret.com/cn/index.php/article/index/id/172)将Nest添加到项目中

## 调用流程

 * 登录功能逻辑：

		1.初始化项目数据
		2.在游戏中展示一张登录背景界面
		3.调用 checkLogin 函数判断是否已经登录过，如果登录过，进入步骤7，否则进入步骤4
		4.调用 isSupport 函数判断支持的登录类型，根据登录类型显示对应的登录图标
		5.用户点击登录图标后，调用 login 函数打开登录面板进行登录
 		6.如果登录成功，进入步骤7
 		7.退出登录界面，进入游戏

 * 登出功能逻辑：

		1.在游戏中放置一个“退出游戏”或者“切换账号”的按钮
		2.用户点击“退出游戏”图标后，调用 logout 函数
		3.在登出成功后，返回到登录逻辑的步骤4

## api 参数说明

在 Nest 中，使用了传参并通过回调函数返回数据，这里通过 nest.core.startup 来说明下各个参数的意思。

* nest.core.startup(info:nest.core.StartupInfo, callback:(resultInfo:nest.core.ResultCallbackInfo)=>any)： 开发者调用的 api 方法。

* info:nest.core.StartupInfo：方法需要传入的参数，为 nest.core.StartupInfo 类型。

		由于在 Nest 中 nest.core.StartupInfo 被声明为一个接口（interface），因此大家不可以直接通过 new 的方式来创建 nest.core.StartupInfo 对象，其实只需要通过简单的 Object 对象赋值即可。比如这里可以直接通过赋值
		{"egretAppId": 88888}.

* callback:(resultInfo:nest.core.ResultCallbackInfo)=>any)：方法回调函数，一个拥有参数为 resultInfo:nest.core.LoginCallbackInfo 返回值为 any 的函数。

* 示例：

		nest.core.startup({"egretAppId" : 88888},
			function(resultInfo:nest.core.ResultCallbackInfo) {
		    	if (resultInfo.result == 0) {//成功

		    	}
		    	else {//失败

		    	}
			});



## api 详解

##### 1、nest.core.startup 初始化项目数据

* 参数说明

		info:nest.core.StartupInfo 初始化信息。比如 {"egretAppId" : 88888}
		  |--- egretAppId egret 开放平台申请的游戏 id

		callback:(resultInfo:ResultCallbackInfo)=>any。回调结果函数
			resultInfo：回调函数的参数数据
				|--- result 回调参数是否正确，0 正确，其他 错误

* 示例

		nest.core.startup({"egretAppId" : 88888},
			function(resultInfo:nest.core.ResultCallbackInfo) {
		    	if (resultInfo.result == 0) {//成功

		    	}
		    	else {//失败

		    	}
			});

##### 2、nest.user.checkLogin 检测是否已经登录

* 参数说明

		loginInfo:nest.user.LoginInfo 初始化信息。请填 {}
		  |--- egretAppId egret 开放平台申请的游戏 id

		callback:(resultInfo:LoginCallbackInfo)=>any 回调结果函数
			resultInfo：回调函数的参数数据
				|--- result 回调参数是否正确，0 正确，其他 错误
				|--- token 用户 token 信息，result 为 0 时才会有

* 示例

		nest.user.checkLogin({}, function(resultInfo:nest.user.LoginCallbackInfo) {
		    if (resultInfo.result == 0) {
		        //直接进入到游戏。
		    }
		    else {
		    	//进行nest.user.isSupport获取判断
		    }
		});

##### 3、nest.user.isSupport 检测支持何种登录方式
* 参数说明

		callback:(resultInfo:LoginCallbackInfo)=>any 回调结果函数
			resultInfo：回调函数的参数数据
				|--- result 回调参数是否正确，0 正确，其他 错误
				|--- loginType 登录方式，以QQ浏览器为例，返回 ["qq","wx"]

* 示例

		nest.user.isSupport(function(resultInfo:nest.user.LoginCallbackInfo) {
		    if (resultInfo.result == 0) {
		        //resultInfo.loginType = ["qq", "wx"];
		        if (resultInfo.loginType && resultInfo.loginType.length > 0) {
		            //需要替换界面，显示根据 resultInfo.loginType 返回的类型显示的图标。
		        }
		        else {
		            //调用无登陆类型 nest.user.login
		        }
		    }
		    else {
		        //调用无登陆类型 nest.user.login
		    }
		});

###### 4、nest.user.login 调用渠道登录接口
* 参数说明

		loginInfo:nest.user.LoginInfo 初始化信息。比如 {"loginType" : "qq"}，没有 loginType 则 {}
		  |--- loginType 登陆类型，没有则不需要赋值

		callback:(resultInfo:ResultCallbackInfo)=>any。回调结果函数
			resultInfo：回调函数的参数数据
				|--- result 回调参数是否正确，0 正确，其他 错误
				|--- token 用户 token 信息，result 为 0 时才会有

* 示例

		nest.user.login({"loginType" : "qq"}, function (resultInfo:nest.user.LoginCallbackInfo) {
		    if (resultInfo.result == 0) {
		    	//登陆成功 可以获取到 token
		    }
		    else {
		        //登录失败
		    }
		});

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

		nest.user.getInfo(function (resultInfo:Object) {
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