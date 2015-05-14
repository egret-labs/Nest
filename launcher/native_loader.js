//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

require("launcher/native_require.js");

egret_native.egtMain = function () {
    egret_native.egretInit();

    egret_native.loadVersion(egret_native.loadAllChange);
};

egret_native.loadAllChange = function () {
    egret_native.initLoadingUI();

    var list = egret.MainContext.instance.netContext.getChangeList();
    var errorList = [];
    var errorCount = 0;

    var loader = new egret.NativeResourceLoader();
    loader.addEventListener(egret.IOErrorEvent.IO_ERROR, loadError, this);
    loader.addEventListener(egret.Event.COMPLETE, loadComplete, this);
    loader.addEventListener(egret.ProgressEvent.PROGRESS, loadProgress, this);

    var loadBytes = 0;
    var totalBytes = 0;
    for (var key in list) {
        totalBytes += list[key]["size"];
    }

    loadNext();
    function loadNext() {
        if (list.length > 0) {
            loader.load(list[0]["url"], list[0]["size"]);
        }
        else if (errorCount > 3) {
            //结束，加载出错
            //End with loading error
            loader.removeEventListener(egret.IOErrorEvent.IO_ERROR, loadError, this);
            loader.removeEventListener(egret.Event.COMPLETE, loadComplete, this);
            loader.removeEventListener(egret.ProgressEvent.PROGRESS, loadProgress, this);

            egret_native.loadError();
        }
        else if (errorList.length > 0) {
            list = errorList;
            errorList = [];
            errorCount++;

            loadComplete();
        }
        else {
            //结束，加载成功
            //End with loading successfully
            loader.removeEventListener(egret.IOErrorEvent.IO_ERROR, loadError, this);
            loader.removeEventListener(egret.Event.COMPLETE, loadComplete, this);
            loader.removeEventListener(egret.ProgressEvent.PROGRESS, loadProgress, this);

            egret_native.removeUI();

            egret_native.egretStart();
        }
    }

    function loadComplete(e) {
        loadBytes += parseInt(list[0]["size"]);
        list.shift();
        loadNext();
    }

    function loadProgress(e) {
        egret_native.setProgress(parseInt(loadBytes) + parseInt(e.bytesLoaded), totalBytes);
    }

    function loadError() {
        errorList.push(list[0]);
        list.shift();
        loadComplete();
    }
};

var textField;
egret_native.initLoadingUI = function () {
    textField = new egret.TextField();
    egret.MainContext.instance.stage.addChild(textField);
    textField.y = egret.MainContext.instance.stage.stageHeight / 2;
    textField.x = egret.MainContext.instance.stage.stageWidth / 2;
    textField.textAlign = "center";
    textField.anchorX = textField.anchorY = 0.5;
};

egret_native.setProgress = function (current, total) {
    console.log("egret_native  " + Math.round(current / 1024) + "KB / " + Math.round(total / 1024) + "KB");
    textField.text = "Loading Resource..." + Math.round(current / 1024) + "KB / " + Math.round(total / 1024) + "KB";
};

egret_native.loadError = function () {
    textField.text = "Resource loading failed，please check the network connection and exit back into the game！";
};

egret_native.removeUI = function () {
    egret.MainContext.instance.stage.removeChild(textField);
};