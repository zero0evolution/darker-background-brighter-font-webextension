

var defaultFontSizeNum = 16

var defaultColorStr = "rgb(255,255,255)"

// 無顏色的背景就為白色
var defaultBgColorStr = "rgb(0,0,0)"


var setTopIfNoProperty = function(docElem){
	// 回傳是否有更改
	var docElemStyleObj = getComputedStyle(docElem)
	
	// font-size
	if(typeof(optionInfo.minFontSize.value) === "number"){
		var fontSizeStr = docElemStyleObj.getPropertyValue("font-size")
		var fontSizeMatchObj = fontSizeStr.match(/(\d+)px/i)
		if(fontSizeMatchObj){
			// 得到 defaultFontSizeNum
			defaultFontSizeNum = Number(fontSizeMatchObj[1])
			// 若比optionInfo.minFontSize.value小 設定為其值
			
			if(defaultFontSizeNum<optionInfo.minFontSize.value){
				defaultFontSizeNum = optionInfo.minFontSize.value
				docElem.style.setProperty("font-size",
					String(optionInfo.minFontSize.value)+"px")
			}
		}
	}

	// color
	if(optionInfo.changeColorFlag.value){
		var colorStr = docElemStyleObj.getPropertyValue("color")
		var colorMatchObj = colorStr.match(/^rgba?\((.*)\)$/i)
		if(!colorMatchObj){
			docElem.style.setProperty("color",defaultColorStr)
		}
		else{
			// 轉數字
			var rgbNums = colorMatchObj[1].split(",")
			for(let i in rgbNums){rgbNums[i] = Number(rgbNums[i])}
			if(rgbNums.length === 3){rgbNums.push(1)}
			var opacityVal = rgbNums[3]
			for(let i of [0,1,2]){rgbNums[i] = rgbNums[i]*opacityVal}
			rgbNums.pop()
			var newRgbNums = rgbNumsBrightnessTrans["brighter"](rgbNums)
			if(!checkObjEqual(newRgbNums,rgbNums)){
				defaultColorStr = "rgb("+newRgbNums.join(",")+")"
				docElem.style.setProperty("color",defaultColorStr)
			}
		}
	}
		


	// background-color
	if(optionInfo.changeColorFlag.value){
		var bgColorStr = docElemStyleObj.getPropertyValue("background-color")
		var bgColorMatchObj = bgColorStr.match(/^rgba?\((.*)\)$/i)
		if(!bgColorMatchObj){
			docElem.style.setProperty("background-color",defaultBgColorStr)
		}
		else{
			// 轉數字
			var rgbNums = bgColorMatchObj[1].split(",")
			for(let i in rgbNums){rgbNums[i] = Number(rgbNums[i])}
			if(rgbNums.length === 3){rgbNums.push(1)}
			var opacityVal = rgbNums[3]
			for(let i of [0,1,2]){
				rgbNums[i] = rgbNums[i]*opacityVal+255*(1-opacityVal)
			}
			rgbNums.pop()
			var newRgbNums = rgbNumsBrightnessTrans["darker"](rgbNums)
			if(!checkObjEqual(newRgbNums,rgbNums)){
				defaultBgColorStr = "rgb("+newRgbNums.join(",")+")"
				docElem.style.setProperty("background-color",defaultBgColorStr)
			}
		}
	}
}

var reStyleDocElem = function(docElem){
	setTopIfNoProperty(docElem)
	
	if(optionInfo.changeColorFlag.value){
		loadCustomCss(
			"content script/customCss_color.css",
			docElem.querySelector("head"))
	}
	if(typeof(optionInfo.minFontSize.value) === "number"){
		loadCustomCss(
			"content script/customCss_fontSize.css",
			docElem.querySelector("head"))
	}

	// 先建立NewNodeObserver
	creatNewNodeObserver(docElem)
	// 輸入所有的elem
	nodeRecursion(docElem,nodeToFuncPointer)
}


var reStyleDoc = function(doc){
	if(doc.readyState !== "loading"){
		reStyleDocElem(doc.documentElement)
	}
	else{

		doc.addEventListener(
			"DOMContentLoaded",function(event){
				reStyleDocElem(event.target.documentElement)
			}
		)
		// doc.defaultView.onabort = function(event){
		// 	reStyleDocElem(event.target.document.documentElement)
		// }
		// doc.defaultView.onbeforeunload = function(event){
		// 	reStyleDocElem(event.target.document.documentElement)
		// }
		// doc.defaultView.onunload = function(event){
		// 	reStyleDocElem(event.target.document.documentElement)
		// }
		// doc.onpagehide = function(event){
		// 	reStyleDocElem(event.target.documentElement)
		// }
		// doc.onpageshow = function(event){
		// 	reStyleDocElem(event.target.documentElement)
		// }
		// doc.onreadystatechange = function(event){
		// 	reStyleDocElem(event.target.documentElement)
		// }
	}
}



loadPropertyInfo()

if(optionInfo.changeColorFlag.value || typeof(optionInfo.minFontSize.value) === "number"){
	console.log("啟動darker background brighter font")
	reStyleDoc(document)
}


// 建立elem style mutation observer
// 取消reStyle CSS?
// 

// bug:



// background-image 混在暗色背景中看不到
// https://cdn.sstatic.net/Sites/stackoverflow/img/sprites.svg?v=1b3cdae197be
// 偵測圖片亮度 調整圖片亮度


// background-position 導致 background-image 降低亮度功能失效
// ex:https://eshop.cht.com.tw/Web/Personal/Product/Details?megaID=D32E9AD3-2998-4055-B9C3-F2A17AC06BCC



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

// math element 無效問題

// 暗底亮字功能無法套用在web file
// https://raw.githubusercontent.com/mdn/webextensions-examples/master/devtools-panels/manifest.json


// github 變白色
// https://leetcode.com/zero0evolution/

// linkedIn 





// 可不需要改的issue

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

