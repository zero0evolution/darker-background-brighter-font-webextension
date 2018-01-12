'use strict';

var init = async function(){
	// global setting initialize
	var globalSetting = await loadOptions([""])
	if(!globalSetting.hasOwnProperty("")){

		// 若版本大於57 將runTaskQuantityAt1Time 初始值調為20
		var browserInfo = await getBrowserInfo()
		var versionMatchObj = browserInfo.version.match(/^\d+(?:\.\d+)?/)
		if(versionMatchObj){
			var version = Number(versionMatchObj[0])
			if(version>=57){
				optionInfo["runTaskQuantityAt1Time"].value = 20
			}
		}

		// 寫入初始設定
		var initGlobalSetting = {}
		initGlobalSetting[""] = {}
		for(let key of optionKeys){
			initGlobalSetting[""][key] = optionInfo[key].value
		}
		saveOptions(initGlobalSetting)
	}

	// 設定每個頁面都顯示pageAction
	browser.tabs.query({}).then(
		(tabs) => {
			for (let tab of tabs) {
				browser.pageAction.show(tab.id)
			}
		}
	)
	browser.tabs.onUpdated.addListener(
		(tabId, changeInfo, tab) => {
			browser.pageAction.show(tab.id)
		}
	)
}
init()


// input text color

// 顯示剩餘數量bug

// 顏色轉換調整

// 儲存次數修改

// 在頁面內開啟選單(取消存取頁面權限)

// 頁面下每個iframe 都有自己的domain

// 建立elem style mutation observer

// bug:
// background-image 混在暗色背景中看不到
// https://translate.google.com.tw/?hl=zh-TW&tab=wT#en/zh-TW
// 偵測圖片亮度 調整圖片亮度


// background-position 導致 background-image 降低亮度功能失效
// ex:https://eshop.cht.com.tw/Web/Personal/Product/Details?megaID=D32E9AD3-2998-4055-B9C3-F2A17AC06BCC
// pchome
// http://www.books.com.tw



// body background image 被 html background color 蓋過
// https://www.w3schools.com/cssref/tryit.asp?filename=trycss3_background_multiple




// 找不到的css檔
// https://protonmail.com/support/knowledge-base/single-password/
// https://protonmail.com/support/wp-content/themes/support/css/sidebar.css
// http://blog.shihshih.com/drop-shadow-vs-box-shadow/
// http://www.books.com.tw/products/0010643442
// css檔到底跑到哪去了?

// iframe
// https://mail.protonmail.com/account
// SecurityError: Permission denied to access property "document" on cross-origin object
// 實在沒辦法，也許可以新建立一個iframe?

// border-image

// 暗底亮字功能無法套用在web file
// https://raw.githubusercontent.com/mdn/webextensions-examples/master/devtools-panels/manifest.json

// linkedIn



// 可不改的issue


// css variable
// ex:youtube


// scroll bar color
// 不用做也不影響

// textarea,input,select user agent background
// 目前直接使用自訂 CSS 覆蓋設定

// ex:http://www.wantgoo.com/stock/astock/techchart?stockno=2405
// svg <rect fill="#FFFFFF"></rect>
// 目前當做圖片處理

// 亮度反轉
// filter:invert(100%) hue-rotate(180deg)

// 為每個domain建立custom css

// 頁面一開始都白色 需想辦法改
// 沒辦法改

// colorName:currentcolor graytext highlighttext highlight
// 可不理

// 搶在domcontentloaded 之前reStyle的問題
// document mutation observer
// stylesheet mutation observer
// 目前是在domcontentloaded之後在改


// 將原值儲存在elem.dataset之中 這樣改變設定時就能引用原值
// (原值不一定一樣 且太過複雜)
// elem.dataset.originBackgroundColor
// elem.dataset.originColor
// elem.dataset.originBackgroundImage
// elem.dataset.originFontSize
// elem.dataset.originLineHeight
// elem.dataset.originHeight



// 優先權四種設定
// css 
// elem style
// css + important
// elem style + important


// badge:顯示任務剩餘數量，需要onMessage sendMessage()
// browser.browserAction.setBadgeText(
// 	{
// 		text: ,
// 		tabId:
// 	}
// )