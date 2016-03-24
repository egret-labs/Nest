#Nest

* nest [下载地址](https://github.com/egret-labs/Nest) 

	egret 引擎：下载完后按照 [第三方库接入流程](http://edn.egret.com/cn/index.php/article/index/id/172) 将Nest添加到项目中，path 指向到 ```nest/libsrc``` 下。

	非 egret 引擎：下载完后，请将 ```libsrc/bin/nest/nest.min.js``` 文件按普通 js 一样加入到项目中。

* 按钮资源
  
  可以使用 loginAssets 下默认的资源或者自行找对应的素材。

## 新版说明

```nest.easeuser.login``` 代替了老版本的 ```nest.user.checkLogin``` ```nest.user.isSupport```以及 ```nest.user.login```，登录只需要这个接口就可以。

```nest.easeuser.logout``` 代替老版本的 ```nest.user.logout```

```nest.easeuser.getInfo``` 代替老版本的 ```nest.user.getInfo```

```nest.easeuser.isSupport``` 简化成只判断有没有 ```getInfo``` 这个 api 调用

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

##### nest.core.startup 初始化项目数据

``` 这个是其他 api 调用的前提，请确保首先调用此 api ```

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

##### nest.easeuser.login 登录

```请确保已经调用过  nest.core.startup ```

* 参数说明

		loginInfo:nest.easeuser.ILoginCallbacks 登录对象，此对象需要实现 onCreate，onSuccess，onFail 3个方法。

 
 	* onCreate:(data:nest.easeuser.ILoginTypes):void 根据传入的参数需要创建对应的按钮（目前为止出现能为 qq（显示 qq 按钮）、wx（显示微信按钮）、default（显示一个游戏内的默认按钮），可能只有1个），并在触发点击事件后，回调 onChoose 函数。如果传入的参数带有 accInfo 信息，请根据 accInfo.avatarUrl 来显示头像，并修改名称为 XX一键登录。
		
		~~~
		function onCreate(data:nest.easeuser.ILoginTypes):void {
        	for (var i:number = 0; i < data.loginTypes.length; i++) {
        		//根据 loginType 类型创建对应的按钮，如果能获取到 accInfo，则需要显示出头像，并且显示到舞台上
             	var btn;
             	btn.name = data.loginTypes[i].loginType;
             	
             	btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
             		data.onChoose(this.name);//请确保传入的参数对应为点击的参数，这里只是一个示例，不是非要将类型放到 name 上，开发者可以根据自己的需求来写，只要确保传入的参数正确就行
             		}, btn);
             	}
		}
		~~~
		
		![image](btns.png)
		
	* onSuccess(data:nest.user.LoginCallbackInfo):void 登录成功，直接进入到游戏逻辑，如果有登录按钮显示，记得处理（看项目需求要不要单独删除）
		
	* onFail(data:nest.core.ResultCallbackInfo):void 登录失败。请查看失败原因。
		
##### nest.easeuser.isSupport 检测是否支持 getInfo 方法调用
* 参数说明
		
		info:Object 请传递 {}
		
		callback:(resultInfo:nest.easeuser.UserSupportCallbackInfo)=>void 回调结果函数
			getInfo：获取渠道是否支持获得用户信息接口，1是支持，其他不支持。如果支持可以使用nest.easeuser.getInfo获取用户信息

* 示例

		nest.easeuser.isSupport({}, function (data:nest.easeuser.UserSupportCallbackInfo) {
		    //获取是否支持nest.user.getInfo接口，有该字段并且该字段值为1表示支持
		    var getInfo = data.getInfo;
		})

###### nest.easeuser.getInfo 获取用户信息，目前只有qq浏览器支持

```调用前，请确保 nest.easeuser.isSupport 返回结果支持调用```

* 参数说明

		loginInfo:nest.user.LoginInfo 请传入 {}

		callback:(resultInfo:Object)=>any 回调结果函数
			resultInfo：回调函数的参数数据

* 示例

		nest.easeuser.getInfo({}, function (data) {
		    if(data.result == 0) {
		        //获取用户信息成功
		         var msg = data.msg;              //传回的提示信息
		         var nickName = data.nickName;    //昵称
		         var avatarUrl = data.avatarUrl;  //头像
		         var sex = data.sex;              //性别, 0未知，1男，2女
		         var city = data.city;            //城市
		         var language = data.language;    //语言
		         var isVip = data.isVip;          //是否vip, 1是，0不是
		         var province = data.province;    //省份
		         var country = data.country;      //国家
		    }
		    else {
		         //获取用户信息失败
		    }
		})



###### nest.easeuser.logout 登出
* 参数说明

		loginInfo:nest.user.LoginInfo 请传入 {}

		callback:(resultInfo:nest.core.ResultCallbackInfo)=>any。回调结果函数
			resultInfo：回调函数的参数数据
				|--- result 回调参数是否正确，0 正确，其他 错误

* 示例

		nest.easeuser.logout({}, function (resultInfo:nest.core.ResultCallbackInfo) {
		    if (resultInfo.result == 0) {
		    	//登出成功，再次登录请使用直接按之前的登录方式登录 nest.easeuser.login
        		
		    }
		    else {
		        //登出失败，有可能是该平台不支持登出接口
		    }
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

		var info = {};
		//购买物品id，在开放平台配置的物品id
		info.goodsId = "1";
		//购买数量，当前默认传1，暂不支持其他值
		info.goodsNumber = "1";
		//所在服
		info.serverId = "1";
		//透传参数
		info.ext = "xx";
		nest.iap.pay(info, function (data) {
		     if(data.result == 0) {
		         //支付成功
		     }
		     else if(data.result == -1) {
		         //支付取消
		    }
		    else {
		        //支付失败
		    }
		})



###### nest.share.isSupport 是否支持分享
* 示例

		nest.share.isSupport({}, function (data) {
		    //获取是否支持nest.share.share接口，有该字段并且该字段值为1表示支持
		    var share = data.share;
		})
	
###### nest.share.setDefaultData 设置默认分享信息接口


* 示例

		var info:any = {};
		//分享标题
		info.title = "title";
		//分享文字内容
		info.description = "descriscription";
		//分享链接
		info.url = "http://url";
		//分享图片URL
		info.image_url = "http://imageUrl";
		//分享图片title
		info.image_title = "image_title";
		nest.share.setDefaultData(info, function (data) {
		    if(data.result == 0) {
		        //设置成功
		    }
		    else {
		        //设置失败
		    }
		})
		
###### nest.share.share 分享

```调用此接口前请先使用 nest.share.isSupport 判断是否支持该功能```

* 示例

			var info:any = {};
		//分享标题
		info.title = "title";
		//分享文字内容
		info.description = "descriscription";
		//分享链接
		info.url = "http://url";
		//分享图片URL
		info.imageUrl = "http://imageUrl";
		nest.share.share(info, function (data) {
		    if(data.result == 0) {
		        //分享成功
		    }
		    else if(data.result == -1) {
		        //分享取消
		    }
		    else {
		        //分享失败
		    }
		})	


###### nest.social.isSupport 社交相关支持

* 示例

		nest.social.isSupport({}, function (data) {
		    //获取是否支持nest.social.openBBS接口，有该字段并且该字段值为1表示支持
		    var openBBS = data.openBBS;
		    var getFriends = data.getFriends;
		})
		
		
###### nest.social.getFriends 获取好友列表

```调用此接口前请先使用 nest.social.isSupport 判断是否支持该功能```

* 示例

		
###### nest.social.openBBS 打开论坛

```调用此接口前请先使用 nest.social.isSupport 判断是否支持该功能```

* 示例

		nest.social.openBBS({}, function (data) {
		    if(data.result == 0) {
		        //打开成功
		    }
		    else {
		        //打开失败
		    }
		})

###### nest.app.isSupport 是否支持特定功能

* 示例

		nest.app.isSupport({}, function (data) {
		    //获取是否支持 nest.app.attention 接口，有该字段并且该字段值为1表示支持，0表示不支持，2表示已关注
		    //已关注的信息在某些平台可能获取不到，请不要过渡依赖该信息，如果游戏有首次关注奖励可以自行在后台存储
		    var attention = data.attention;
		    //获取是否支持nest.app.exitGame接口，有该字段并且该字段值为1表示支持
		    var exitGame = data.exitGame;
		    //获取是否支持nest.app.sendToDesktop接口，有该字段并且该字段值为1表示支持
		    var sendToDesktop = data.sendToDesktop;
		    //获取是否支持nest.app.getInfo接口，有该字段并且该字段值为1表示支持
		    var getInfo = data.getInfo;
		})
		
		
###### nest.app.attention 关注

```调用此接口前请先使用 nest.app.isSupport 判断是否支持该功能```

* 示例

		nest.app.attention({}, function (data) {
		    if(data.result == 0) {
		        //关注成功
		    }
		    else if(data.result == -1) {
		        //关注取消
		     }
		    else {
		        //关注失败
		    }
		})
				
###### nest.app.exitGame 退出游戏，回到 App 界面

```调用此接口前请先使用 nest.app.isSupport 判断是否支持该功能```

* 示例

		nest.app.exitGame({}, function (data) {
		    if(data.result == 0) {
		        //退出成功
		    }
		    else {
		        //退出失败
		    }
		})
				
###### nest.app.sendToDesktop 发送到桌面

```调用此接口前请先使用 nest.app.isSupport 判断是否支持该功能```

* 示例

		nest.app.sendToDesktop({}, function (data) {
		    if(data.result == 0) {
		        //保存成功
		    }
		    else {
		        //保存失败
		    }
		})
		
###### nest.app.getInfo 获取客服信息

```调用此接口前请先使用 nest.app.isSupport 判断是否支持该功能```

* 示例

		nest.app.getInfo({}, function (data) {
		    if(data.result == 0) {
		        //获取成功
		        //获取联系方式
		        var contact = data.contact;
		        //获取qq联系方式，没有该字段表示没有可用的qq联系方式，请到开放平台进行配置。该字段为一个数组
		        var qq = contact.qq;
		        //获取qq群联系方式，没有该字段表示没有可用的qq群联系方式，请到开放平台进行配置。该字段为一个数组
		        var qqgroup = contact.qqgroup;
		        //获取微信联系方式，没有该字段表示没有可用的微信联系方式，请到开放平台进行配置。该字段为一个数组
		        var weixin = contact.weixin;
		        //获取邮件联系方式，没有该字段表示没有可用的邮件联系方式，请到开放平台进行配置。该字段为一个数组
		        var email = contact.email;
		    }
		    else {
		        //获取失败
		    }
		})



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

在开放平台注册游戏，获取游戏appId
使用测试渠道9166进行测试，这里以appId为```88888```进行演示，将游戏测试链接后面加上相关参数：

http://localhost:63342/HelloGUI/launcher/index.html?platInfo=open\_```88888```_9166&egret.runtime.spid=9166&appId=```88888```&channelId=9166&egretSdkDomain=http://api.egret-labs.org/v2&egretServerDomain=http://api.egret-labs.org/v2

弹出登录窗之后选择其他方式登陆，用户名：```guest1```到```guest8```，密码：```123456```


## 注意
* 请先使用nest.core.startup初始化Nest
* runtime目前只支持android系统。