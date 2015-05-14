declare var CMPAY_DEBUG:boolean;
declare var CMPAY_EGRET: {
	on(eventName: String, callback: Function):void;
	off(eventName: String, callback: Function): void;
	fire(eventName: String, ...args): void;
	isReady: boolean;
	type: string;
	ready(callback: Function): void;
	purchase(option: Object): void;
};