
"use strict"
// ==UserScript==
// @name         darker background brighter font
// @namespace    
// @version      4.0
// @description  
// @author       zero0evolution
// @include      /.*/
// ==/UserScript==
		'use strict';

var optionKeys = ["changeColorFlag","imgBrightness","bgImgBrightness","minFontSize","runTaskQuantityAt1Time",]

var optionInfo = {
	changeColorFlag:{
		types:["boolean"],
		value:true,
	},
	imgBrightness:{
		types:["number","boolean"],
		maxValue:1,
		minValue:0,
		step:0.05,
		value:0.7,
		defaultNumValue:1,
	},
	bgImgBrightness:{
		types:["number","boolean"],
		maxValue:1,
		minValue:0,
		step:0.05,
		value:0.5,
		defaultNumValue:1,
	},
	minFontSize:{
		types:["number","boolean"],
		maxValue:48,
		minValue:12,
		step:1,
		value:false,
		defaultNumValue:12,
	},
	runTaskQuantityAt1Time:{
		types:["number"],
		maxValue:100,
		minValue:1,
		step:1,
		value:1,
		defaultNumValue:1,
	},
}

var getBrowserVersion = function(){
	var matchVersionObj = navigator.userAgent.match(
		/(?:firefox|chrome)\/(\d+(?:\.\d+)?)/im)
	if(matchVersionObj){
		var version = Number(matchVersionObj[1])
		return(version)
	}
	return(1)
}
var browserVersion = getBrowserVersion()

var browserType = ""
if(typeof(browser) !== "undefined"){
	browserType = "Firefox"
	if(navigator.userAgent.match(/mobile/i)){
		browserType+=" Mobile"
	}
}
else{
	if(typeof(chrome) !== "undefined"){
		var browser = chrome
		browserType = "Chrome"
	}
}


if(!(browserType === "Firefox" && browserVersion<57)){
	optionInfo.runTaskQuantityAt1Time.value = 20
	optionInfo.runTaskQuantityAt1Time.defaultNumValue = 20
}

var urlToDomain = function(url){
	var domain = url
	// 解析 domain
	var domainMatchObj = url.match(/^(.*?[^\/])\/(?=[^\/]|$)/)
	if(domainMatchObj){domain = domainMatchObj[1]}

	return(domain)
}
var loadOptions = function(domains){
	return(
		new Promise(
			function(resolve,reject){
				if(browserType.match(/Firefox/i)){
					browser.storage.local.get(domains).then(
						function(returnObj){resolve(returnObj)},
						function(error){
							reject("載入 "+domains+" options 失敗:"+`${error}`)
						}
					)
				}
				else if(browserType.match(/Chrome/i)){
					browser.storage.local.get(
						domains,function(items){resolve(items)}
					)
				}
				else{
					reject("未知的瀏覽器:"+browserType)
				}
			}
		)
	)
}

var checkObjEqual = function(a1,a2){
	// if(a1 instanceof Array && a2 instanceof Array){

	// }
	if(a1.length !== a2.length){return(false)}

	for(let i in a1){
		if(a1[i] instanceof Array && a2[i] instanceof Array){
			if(!checkObjEqual(a1[i],a2[i])){
				return(false)
			}
		}
		else if(a1[i] instanceof Object && a2[i] instanceof Object){
			if(!checkObjEqual(a1[i],a2[i])){
				return(false)
			}
		}
		else if(a1[i] !== a2[i]){
			return(false)
		}
	}
	return(true)
}
var customCssElemId = "customCss"
var loadCustomCss = function(cssFilePathName,pasteElem){
	var customCssElem = document.createElement("link")
	customCssElem.rel = "stylesheet"
	customCssElem.type="text/css"
	customCssElem.href = browser.extension.getURL(cssFilePathName)
	customCssElem.id = customCssElemId
	pasteElem.appendChild(customCssElem)
	return(customCssElem)
}
var propertyInfo = {}
var propertys = [
	"background-color","background-image","color",
	"border-left-color","border-top-color",
	"border-right-color","border-bottom-color",
	"box-shadow",
]

var loadPropertyInfo = function(){
	var backgroundMethod = "darker"
	var fontMethod = "brighter"

	// color
	propertyInfo["color"] = {
		transMethod:fontMethod,
		transFunc:function(obj,getStyleObj,setStyleObj,property,propertyVal){

			var newPropertyVal = fullColorStrBrightnessTransFunc(
				propertyVal,propertyInfo[property].transMethod)

			return(newPropertyVal)
		}
	}
	propertyInfo["border-left-color"] = propertyInfo["color"]
	propertyInfo["border-top-color"] = propertyInfo["color"]
	propertyInfo["border-right-color"] = propertyInfo["color"]
	propertyInfo["border-bottom-color"] = propertyInfo["color"]
	propertyInfo["box-shadow"] = propertyInfo["color"]

	// background-color
	propertyInfo["background-color"] = {
		transMethod:backgroundMethod,
		transFunc:function(obj,getStyleObj,setStyleObj,property,propertyVal){

			var newPropertyVal = fullColorStrBrightnessTransFunc(
				propertyVal,propertyInfo[property].transMethod)

			return(newPropertyVal)
		}
	}

	// background-image
	propertyInfo["background-image"] = {
		transMethod:backgroundMethod,
		transFunc:function(obj,getStyleObj,setStyleObj,property,propertyVal){

			var transMethod = propertyInfo[property].transMethod
			// 更改純顏色部份
			var newPropertyVal = fullColorStrBrightnessTransFunc(
				propertyVal,transMethod)

			var changeFlag = Boolean(newPropertyVal)
			if(changeFlag){propertyVal = newPropertyVal}

			// 若背景圖亮度需要調整 送到 bgImgUrlBrightnessTrans
			if(typeof(optionInfo.bgImgBrightness.value) === "number"){
				// if(obj instanceof Element){
					if(propertyVal.match(/url\(.+?\)/im)){
					
						changeFlag = true
						newPropertyVal = bgImgUrlBrightnessTrans(
							getStyleObj,setStyleObj,
							propertyVal,optionInfo.bgImgBrightness.value
						)
					}
				// }
			}

			if(!changeFlag){return(null)}
			// console.log(selectorText,property,":")
			// console.log(propertyVal)
			// console.log("====",transMethod,"==>")
			// console.log(newPropertyVal,"\n")
			return(newPropertyVal)
		}
	}
}

loadPropertyInfo()
var addWhiteBorder = function(getStyleObj,setStyleObj){
	// 若沒有加drop-shadow 就加上
	var filterProperty = getStyleObj.getPropertyValue("filter")
	var dropShadowStr = "drop-shadow(rgb(255, 255, 255) 0px 0px 1px)"
	if(filterProperty.indexOf(dropShadowStr) < 0){
		if(filterProperty.match(/^(?:none|)$/)){
			var newFilterProperty = [dropShadowStr,dropShadowStr].join(" ")
		}
		else{
			var newFilterProperty = filterProperty+" "+[dropShadowStr,dropShadowStr].join(" ")
		}
		setStyleObj.setProperty("filter",newFilterProperty)
	}
	return(newFilterProperty)
}
var fontSizePropertyInfos = {
	"font-size":{
		min:function(){
			return(optionInfo.minFontSize.value)
		},
		requireProperys:[],
	},
	"line-height":{
		min:function(){
			return(optionInfo.minFontSize.value+12)
		},
		requireProperys:[],
	},
	"min-height":{
		min:function(){
			return(optionInfo.minFontSize.value+12)
		},
		requireProperys:["font-size","line-height"],
	}
}
var fontSizePropertys = ["font-size","line-height","min-height"]

var changeMinFontSize = function(obj,getStyleObj,setStyleObj,selectorText){
	// obj有可能是element 或 cssRule
	var hasPropertyFlagObj = {}
	for(let property of fontSizePropertys){
		
		var propertyValueStr = getStyleObj.getPropertyValue(property)
		var propertyValueMatchObj = propertyValueStr.match(/^(\d+(?:\.\d+)?)([a-z]+?)$/i)
		if(propertyValueMatchObj){
			var propertyValueNum = Number(propertyValueMatchObj[1])
			var propertyValueUnit = propertyValueMatchObj[2]
			if(typeof(unitToPx[propertyValueUnit]) !== "function"){
				console.log("未知length 單位:",propertyValueUnit)
				continue
			}
			var propertyValuePxNum = unitToPx[propertyValueUnit](propertyValueNum)
		}
		else if(unitToPx.hasOwnProperty(propertyValueStr)){
			var propertyValuePxNum = unitToPx[propertyValueStr](12)
		}
		else{continue}

		hasPropertyFlagObj[property] = true

		var requireProperys = fontSizePropertyInfos[property].requireProperys
		if(requireProperys.length>0){
			var checkFlag = requireProperys.filter(
				(requirePropery)=>{
					return(
						hasPropertyFlagObj.hasOwnProperty(requirePropery) && hasPropertyFlagObj[requirePropery] === true)
				}
			).includes(true)
			if(!checkFlag){continue}
		}

		if(propertyValuePxNum<fontSizePropertyInfos[property].min()){
			var newPropertyValuePxStr = String(fontSizePropertyInfos[property].min())+"px"
			setStyleObj.setProperty(
				property,newPropertyValuePxStr/*,"important"*/)
			// console.log(
			// 	selectorText,property,":",
			// 	propertyValueStr,"==>",newPropertyPxStr)
		}
	}
}

var unitToPx = {
	px:function(num){return(num)},
	pt:function(num){return(num*4/3)},
	mm:function(num){return(num*96/25.4)},
	cm:function(num){return(num*96/2.54)},
	pc:function(num){return(num*16)},
	in:function(num){return(num*96)},
	// em:function(num){
	// 	return(num*12)	//為此elem的大小比例，但懶得寫
	// },
	rem:function(num){
		return(num*defaultFontSizeNum)
	},
	vw:function(num){return(num*window.innerWidth/100)},
	vh:function(num){return(num*window.innerHeight/100)},
	vmin:function(num){
		return(num*Math.min(window.innerWidth,window.innerHeight)/100)
	},
	vmax:function(num){
		return(num*Math.max(window.innerWidth,window.innerHeight)/100)
	},
	"xx-small":function(num){return(num-6)},
	"x-small":function(num){return(num-4)},
	"small":function(num){return(num-2)},
	"medium":function(num){return(num)},
	"large":function(num){return(num+2)},
	"x-large":function(num){return(num*1.5)},
	"xx-large":function(num){return(num*2)},
	// larger:function(num){return(num*2)},
	// smaller:function(num){return(num*2)},
}
// const notTextContentPattern = /^[\n\t\s\r]*?$/
var tagNameToHasText = {
	input:true,
	textarea:true,
	select:true,
}
var checkElemHasTextNode = function(elem){
	//需要輸入文字的elem算是有text
	var tagName = elem.tagName.toLowerCase()
	if(tagNameToHasText.hasOwnProperty(tagName)){
		return(tagNameToHasText[tagName])
	}
	//找childNode為文字節點
	for(let childNode of elem.childNodes){
		if(childNode.nodeType === 3){
			return(true)
		}
	}
	return(false)
}
var getSelectorText = function(elem){
	let cssSelectors = []
	cssSelectors.push(elem.tagName)

	if(elem.id){
		cssSelectors.push("#"+elem.id)
	}
	for(let className of elem.classList){
		cssSelectors.push("."+className)
	}
	return(cssSelectors.join(""))
}

var getXpath = function(elem){
	let cssSelectors = []

	while(true){
		let eachSelectorText = getSelectorText(elem)
		cssSelectors.unshift(eachSelectorText)
		if(eachSelectorText.match(/^html/i)){
			return(cssSelectors.join(" > "))
		}
		elem = elem.parentElement
	}
}

var getStyleSheetNodeXpath = function(){
	for(let sheet of document.styleSheets){
		if(sheet.ownerNode instanceof Element){
			console.log(getXpath(sheet.ownerNode))
		}
		else{
			console.log("沒有node的sheet",sheet)
		}
	}
}
var oldStyleTransFunc = function(elem){
	for(let property in oldAttributeTransObj){
		oldAttributeTransObj[property](elem)
	}
}

var oldAttributeTransObj = {
	color:function(elem){
		var color = elem.color
		elem.removeAttribute("color")
		if(color && (!(elem.style.getPropertyValue("color"))) ){
			var newColor = color.replace(
				/^\#?([0-9a-f]{3}[0-9a-f]{3}?)$/i,function(matchStr,p1){
					if(p1){return("#"+p1)}
					return(matchStr)
				}
			)
			elem.style.setProperty("color",newColor)
		}
	},
	bgColor:function(elem){
		var bgColor = elem.bgColor
		elem.removeAttribute("bgColor")
		if(bgColor && (!(elem.style.getPropertyValue("background-color"))) ){
			
			var newBgColor = bgColor.replace(
				/^\#?([0-9a-f]{3}[0-9a-f]{3}?)$/i,function(matchStr,p1){
					if(p1){return("#"+p1)}
					return(matchStr)
				}
			)
			elem.style.setProperty("background-color",newBgColor)
		}
	},
	background:function(elem){
		var bgImg = elem.background
		elem.removeAttribute("background")
		if(bgImg && (!(elem.style.getPropertyValue("background-image"))) ){
			elem.style.setProperty("background-image",'url("'+bgImg+'")')
		}
	},
	size:function(elem){
		var size = elem.size
		elem.removeAttribute("size")
		if(size && (!elem.style.getPropertyValue("font-size"))){
			var sizeToFontSizeObj = {
				1:"x-small",
				2:"small",
				3:"medium",
				4:"large",
				5:"x-large",
				6:"xx-large",
				7:"xxx-large",
			}
			var sizeNum = parseInt(size)
			if(sizeToFontSizeObj.hasOwnProperty(sizeNum)){
				elem.style.setProperty("font-size",sizeToFontSizeObj[sizeNum])
			}
		}
	}
}


var nodeToFuncPointer = function(node){
	if(node.nodeType === 1){
		if(node.dataset instanceof DOMStringMap){
			// changeStyleTimes
			if(node.dataset.hasOwnProperty("changeStyleTimes")){
				var count = Number(node.dataset.changeStyleTimes)+1
			}
			else{
				var count = 1
			}
			node.dataset.changeStyleTimes = String(count)

			// nodeToFunc
			let elemTagName = node.tagName.toLowerCase()
			
			try{
				// 載入tagName 對應的功能
				if(tagNameToFunc.hasOwnProperty(elemTagName)){
					var childFlag = tagNameToFunc[elemTagName](node)
					return(childFlag)
				}
				else{
					// 若是沒見過的tagName 寫入對應功能
					tagNameToFunc[elemTagName] = function(node){
						// oldStyleTransFunc(node)
						addToTask(node)
						return(true)
					}
					var childFlag = tagNameToFunc[elemTagName](node)

					return(childFlag)
				}
			}
			catch(error){
				console.error("Error:",error)
			}
		}
	}
}


var nodeRecursion = function(node,func){
	var childFlag = func(node)
	if(childFlag){
		for(let childNode of node.childNodes){
			nodeRecursion(childNode,func)
		}
	}
}


var noFunc = function(elem){}

var imgElemFunc = function(elem){
	setTimeout(
		function(elem){
			// 將圖片加上白框(全黑的圖片才看得到)
			if(optionInfo.changeColorFlag.value){
				addWhiteBorder(getComputedStyle(elem),elem.style)
			}
				
			// 若需要改亮度、超過指定的大小 就更改亮度
			if(typeof(optionInfo.imgBrightness.value) === "number"){
				imgElemBrightnessTrans(
					getComputedStyle(elem),elem.style,
					optionInfo.imgBrightness.value)
			}
		},0,elem
	)
}

var styleElemFunc = function(elem){
	if(elem.id === customCssElemId){return(null)}
	if(elem.sheet instanceof StyleSheet){
		var success = styleSheetBrightnessTransFunc(elem.sheet)
	}
}

// iframeElemFunc 凍結
var iframeElemFunc = function(elem){
	addToTask(elem)

	// 安全因素 更改iframe有困難
	/*if(!(elem.contentDocument instanceof HTMLDocument)){
		
		console.log("請求iframe:",elem.src)
		var requestObj = new XMLHttpRequest()
		requestObj._elem = elem
		requestObj.onreadystatechange = function() {
			if(this.readyState===this.DONE && this.status===200) {
				//頁面載入成功後
				this._elem.src = ""
				
				var tempElem = document.createElement("div")
				tempElem.innerHTML = this.responseText
				var iframeDocElem = tempElem.firstChild
				reStyleDocElem(iframeDocElem)

				this._elem.srcdoc = iframeDocElem.innerHTML
				console.log(this._elem.contentDocument)
			}
		}
		requestObj.open("GET",elem.src,true)
		requestObj.send()
	}*/
	return(true)
}


var tagNameToFunc = {
	//style,css link節點
	"style":styleElemFunc,
	"link":styleElemFunc,
	// image 節點
	"img":imgElemFunc,
	"canvas":imgElemFunc,
	"svg":imgElemFunc,
	// 若是script meta title 不動作
	"script":noFunc,
	"meta":noFunc,
	"title":noFunc,
	"noscript":noFunc,
	"br":noFunc,
	"head":function(elem){return(true)},
	"math":function(elem){},
	// 
	/*"iframe":iframeElemFunc,*/
	/*"optgroup":function(node){
		oldStyleTransFunc(node)
		addToTask(node)

		setTimeout(
			function(node){
				addToTask(node)
			},1000,node
		)
	}*/
}

//更改obj style
var reStyleFunc = function(obj){
	// getStyleObj,setStyleObj,selectorText
	
	if(obj instanceof CSSRule){
		var selectorText = obj.selectorText
		var getStyleObj = obj.style
		var setStyleObj = obj.style
	}
	else if(obj instanceof Element){
		var selectorText = getSelectorText(obj)
		var getStyleObj = getComputedStyle(obj)
		// var getStyleObj = getComputedStyle(obj)
		var setStyleObj = obj.style
		
	}
	else{
		console.log("reStyleFunc 未知格式的 obj:",obj)
		return(null)
	}
	

	// 改變顏色功能
	if(optionInfo.changeColorFlag.value){
		for(let eachProperty of propertys){

			var propertyVal = getStyleObj.getPropertyValue(eachProperty)
			var transMethod = propertyInfo[eachProperty].transMethod
			// 先找有沒有一樣的轉換紀錄 若有就直接載入紀錄
			if(colorTransRecordObj[transMethod].hasOwnProperty(propertyVal)){
				
				var newPropertyVal = colorTransRecordObj[transMethod][propertyVal]
				if(newPropertyVal){
					setStyleObj.setProperty(eachProperty,newPropertyVal/*,"important"*/)
				}
				//紀錄為null就不需修改
			}
			else{
				//沒有紀錄就計算格式
				var newPropertyVal = propertyInfo[eachProperty].transFunc(
					obj,getStyleObj,setStyleObj,eachProperty,propertyVal)
				// newElemStyleStr為null的情況:
				// 1.未預期的格式
				// 2.格式錯誤
				// 3.不需要更改

				// 記錄objStyleStr對應newElemStyleStr
				colorTransRecordObj[transMethod][propertyVal] = newPropertyVal

				if(newPropertyVal){
					// 設定style
					setStyleObj.setProperty(eachProperty,newPropertyVal/*,"important"*/)
					// 記錄newElemStyleStr對應null
					colorTransRecordObj[transMethod][newPropertyVal] = null
				}
				// log
				// 	console.log(selectorText,eachProperty,":")
				// 	console.log(propertyVal)
				// 	console.log("====",transMethod,"==>")
				// 	console.log(newPropertyVal,"\n")
			}
		}
	}
	

	// 改變文字大小
	if(typeof(optionInfo.minFontSize.value) === "number"){
		
		// if(obj instanceof Element){
		// 	if(!checkElemHasTextNode(obj)){return(null)}
		// }
		changeMinFontSize(obj,getStyleObj,setStyleObj,selectorText)
	}
}



var nodeTasks = []
// 隱藏node延後處理
var hideNodeTasks = []

var addToTask = function(node,insertPos = -1){
	var hasTaskFlag = (nodeTasks.length+hideNodeTasks.length)>0

	if(node.style.display === "none"){var tasks = hideNodeTasks}
	else{var tasks = nodeTasks}

	if( (insertPos < 0) || (insertPos > tasks.length) ){
		insertPos = tasks.length
	}
	tasks.splice(insertPos, 0, node)

	// 若沒有在運行任務 就開始任務
	if(!hasTaskFlag){
		setTimeout(processTask,0)
		setTimeout(creatShowTasksLenElem,0)
	}
}

var processTask = function(){
	var i = 0
	while(i<optionInfo.runTaskQuantityAt1Time.value){
		if(nodeTasks.length>0){
			reStyleFunc(nodeTasks.shift())
		}
		else if(hideNodeTasks.length>0){
			reStyleFunc(hideNodeTasks.shift())
		}
		else{
			break
		}
		i++
	}
	if((nodeTasks.length+hideNodeTasks.length)>0){
		setTimeout(processTask,0)
	}
}

var showTasksLenElem = null

var creatShowTasksLenElem = function(){
	if(showTasksLenElem instanceof Element){
		return(null)
	}
	showTasksLenElem = document.createElement("div")
	showTasksLenElem.style.position = "fixed"
	showTasksLenElem.style.bottom = "0px"
	showTasksLenElem.style.right = "0px"
	showTasksLenElem.style.display = "block"

	showTasksLenElem.style.backgroundColor = "black"
	showTasksLenElem.style.color = "white"

	showTasksLenElem.style.boxShadow = "0px 0px 5px 0px white"
	// showTasksLenElem.style.setProperty("pointer-events","none")

	showTasksLenElem.onmouseenter = function(event){
		event.target.style.opacity = "0"
		event.target.style.setProperty("pointer-events","none")

		setTimeout(
			function(elem){
				elem.style.opacity = "1"
				elem.style.setProperty("pointer-events","auto")
			},2000,event.target
		)
	}
	/*showTasksLenElem.onmouseleave = function(event){
		event.target.style.opacity = "0.8"
	}*/
	document.body.appendChild(showTasksLenElem)

	var updateTasksLen = function(elem){
		var tasksSum = nodeTasks.length+hideNodeTasks.length
		if(tasksSum>1){
			elem.innerText = 
				browser.i18n.getMessage("showTaskLenText")+String(tasksSum)

			setTimeout(updateTasksLen,500,elem)
		}
		else{
			elem.remove()
			showTasksLenElem = null
		}
	}
	updateTasksLen(showTasksLenElem)
}

	
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
// 背景圖片亮度變暗功能
var bgImgUrlBrightnessTrans = function(getStyleObj,setStyleObj,bgImgStr,brightness){
	
	var blackBgOpacity = 1-brightness
	var bgRgbaStr = "rgba(0, 0, 0, "+String(blackBgOpacity)+")"
	var addBgStr = "linear-gradient("+bgRgbaStr+", "+bgRgbaStr+")"

	if(bgImgStr.indexOf(addBgStr)<0){
		bgImgStr = addBgStr+", "+bgImgStr

		for(let eachProperty in newBackgroundPropertyToValue){
			var eachPropertyVal = getStyleObj.getPropertyValue(eachProperty)
			// 載入初始值
			if(!eachPropertyVal){
				eachPropertyVal = "initial"
			}

			var newEachPropertyVal = newBackgroundPropertyToValue[eachProperty]+","+eachPropertyVal
			setStyleObj.setProperty(eachProperty,newEachPropertyVal)
			// console.log(eachProperty,newEachPropertyVal)
		}
	}
	return(bgImgStr)
}

var backgroundPropertys = ["background-image","background-position","background-size","background-repeat","background-attachment","background-origin","background-clip","background-color"]

var getAllBackgroundPropertyStr = function(getStyleObj){
	var propertyVals = []
	for(let eachProperty of backgroundPropertys){
		eachPropertyVal = getStyleObj.getPropertyValue(eachProperty)
		if(eachPropertyVal){propertyVals.push(eachPropertyVal)}
	}
	return(propertyVals.join(" "))
}

var initBackgroundPropertyToValue = {
	"background-repeat":"no-repeat",
	"background-attachment":"scroll",
	"background-position": "0% 0%",
	"background-size": "auto auto",
	"background-origin": "padding-box",
	"background-clip": "border-box",
}

var newBackgroundPropertyToValue = {
	"background-repeat":"no-repeat",
	"background-attachment":"fixed",
	"background-position": "0% 0%",
	"background-size": "auto auto",
	"background-origin": "padding-box",
	"background-clip": "border-box",
}


/*var bgImgUrlBrightnessTrans = function(
	setStyleObj,propertyVal,targetBrightness){

	var newPropertyVal = propertyVal.replace(
		/url\(([^\(^\)]+?)\)/img,async function(matchStr,p1){
			var matchUrlObj = p1.match(/(\"|\')(.*?)(\"|\')/)
			if(matchUrlObj){
				var imgUrl = matchUrlObj[1]
				var prefix = matchUrlObj[0]
				var suffix = matchUrlObj[2]
			}
			else{
				var imgUrl = p1
				var prefix = ""
				var suffix = ""
			}

			var imgData = await imgToData(imgUrl)
			return(prefix+imgData+suffix)
		}
	)
}*/


/*var imgUrlToData = function(imgUrl){
	return(new Promise(
		function(resolve,reject){
			var tailMatchObj = imgUrl.match(/[^\/]+?$/)
			if(tailMatchObj){
				var fileNameMatchObj = tailMatchObj[0].match(/.*?(?=\?|$)/)
				if(fileNameMatchObj){
					var subFileNameMatchObj = fileNameMatchObj[0].match(/\.(\w{1,5})$/)
					if(subFileNameMatchObj){
						var imgType = subFileNameMatchObj[1]

						var requestObj = new XMLHttpRequest();
						requestObj.open("GET", imgUrl, true)
						requestObj.responseType = "arraybuffer"

						requestObj.onreadystatechange = function() {
							if(this.readyState===this.DONE && this.status===200) {
								var byteArray = new Uint8Array(this.response)
								var binaryStrArray = new Array(byteArray.length)
								for(let i in byteArray){
									binaryStrArray[i] = String.fromCharCode(byteArray[i])
								}
								var data = binaryStrArray.join('')
								var base64 = btoa(data)

								resolve("data:image/"+imgType+";base64,"+base64)
							}
							else{
								reject(Error('Image did not load in; error code:' + this.statusText))
							}
						}
						requestObj.onerror = function(){
							reject(Error('network error. url:'+this.responseURL))
						}

						requestObj.send()
					}
					else{reject(Error("no image sub file name"))}
				}
				else{reject(Error("no image sub file name"))}
			}
			else{reject(Error("no image sub file name"))}
		}
	))	
}*/



// 若圖片位址非此網域無效 
/*var fixImgBrightness = function(imageSrc,targetBrightness) {
	
	var imgElem = document.createElement("img")
	imgElem.src = imageSrc
	imgElem.style.display = "none"
	document.body.appendChild(imgElem)

	// 得到圖片的最亮最暗值
	imgElem.onload = function(event) {
		var imgElem = event.target
		// create canvas
		var canvas = document.createElement("canvas")
		canvas.width = imgElem.clientWidth
		canvas.height = imgElem.clientHeight

		var ctx = canvas.getContext("2d")
		ctx.drawImage(imgElem,0,0)

		var imageData = ctx.getImageData(0,0,canvas.width,canvas.height)
		
		// var allPixelBrightnessSum = 0
		var maxBrightness = 0
		// var minBrightness = 255

		var i=0
		while(i<imageData.data.length){
			var rgb = imageData.data.slice(i,i+3)
			var pixelBrightness = (Math.max(...rgb)+Math.min(...rgb))/2
			// allPixelBrightnessSum += pixelBrightness
			maxBrightness = Math.max(maxBrightness,pixelBrightness)
			// minBrightness = Math.min(minBrightness,pixelBrightness)
			i+=4
		}

		// var avgBrightness = Math.round(
			// allPixelBrightnessSum / (canvas.width*canvas.height))
	
		
		if(maxBrightness<targetBrightness){
			
		}
		else if(maxBrightness>targetBrightness){
			
		}
	}
}*/

//定義的顏色值
const colorNameToRgb = {
	"aliceblue":[240,248,255],
	"antiquewhite":[250,235,215],
	"aqua":[0,255,255],
	"aquamarine":[127,255,212],
	"azure":[240,255,255],
	"beige":[245,245,220],
	"bisque":[255,228,196],
	"black":[0,0,0],
	"blanchedalmond":[255,235,205],
	"blue":[0,0,255],
	"blueviolet":[138,43,226],
	"brown":[165,42,42],
	"burlywood":[222,184,135],
	"cadetblue":[95,158,160],
	"chartreuse":[127,255,0],
	"chocolate":[210,105,30],
	"coral":[255,127,80],
	"cornflowerblue":[100,149,237],
	"cornsilk":[255,248,220],
	"crimson":[220,20,60],
	"cyan":[0,255,255],
	"darkblue":[0,0,139],
	"darkcyan":[0,139,139],
	"darkgoldenrod":[184,134,11],
	"darkgray":[169,169,169],
	"darkgrey":[169,169,169],
	"darkgreen":[0,100,0],
	"darkkhaki":[189,183,107],
	"darkmagenta":[139,0,139],
	"darkolivegreen":[85,107,47],
	"darkorange":[255,140,0],
	"darkorchid":[153,50,204],
	"darkred":[139,0,0],
	"darksalmon":[233,150,122],
	"darkseagreen":[143,188,143],
	"darkslateblue":[72,61,139],
	"darkslategray":[47,79,79],
	"darkslategrey":[47,79,79],
	"darkturquoise":[0,206,209],
	"darkviolet":[148,0,211],
	"deeppink":[255,20,147],
	"deepskyblue":[0,191,255],
	"dimgray":[105,105,105],
	"dimgrey":[105,105,105],
	"dodgerblue":[30,144,255],
	"firebrick":[178,34,34],
	"floralwhite":[255,250,240],
	"forestgreen":[34,139,34],
	"fuchsia":[255,0,255],
	"gainsboro":[220,220,220],
	"ghostwhite":[248,248,255],
	"gold":[255,215,0],
	"goldenrod":[218,165,32],
	"gray":[128,128,128],
	"grey":[128,128,128],
	"green":[0,128,0],
	"greenyellow":[173,255,47],
	"honeydew":[240,255,240],
	"hotpink":[255,105,180],
	"indianred":[205,92,92],
	"indigo":[75,0,130],
	"ivory":[255,255,240],
	"khaki":[240,230,140],
	"lavender":[230,230,250],
	"lavenderblush":[255,240,245],
	"lawngreen":[124,252,0],
	"lemonchiffon":[255,250,205],
	"lightblue":[173,216,230],
	"lightcoral":[240,128,128],
	"lightcyan":[224,255,255],
	"lightgoldenrodyellow":[250,250,210],
	"lightgray":[211,211,211],
	"lightgrey":[211,211,211],
	"lightgreen":[144,238,144],
	"lightpink":[255,182,193],
	"lightsalmon":[255,160,122],
	"lightseagreen":[32,178,170],
	"lightskyblue":[135,206,250],
	"lightslategray":[119,136,153],
	"lightslategrey":[119,136,153],
	"lightsteelblue":[176,196,222],
	"lightyellow":[255,255,224],
	"lime":[0,255,0],
	"limegreen":[50,205,50],
	"linen":[250,240,230],
	"magenta":[255,0,255],
	"maroon":[128,0,0],
	"mediumaquamarine":[102,205,170],
	"mediumblue":[0,0,205],
	"mediumorchid":[186,85,211],
	"mediumpurple":[147,112,219],
	"mediumseagreen":[60,179,113],
	"mediumslateblue":[123,104,238],
	"mediumspringgreen":[0,250,154],
	"mediumturquoise":[72,209,204],
	"mediumvioletred":[199,21,133],
	"midnightblue":[25,25,112],
	"mintcream":[245,255,250],
	"mistyrose":[255,228,225],
	"moccasin":[255,228,181],
	"navajowhite":[255,222,173],
	"navy":[0,0,128],
	"oldlace":[253,245,230],
	"olive":[128,128,0],
	"olivedrab":[107,142,35],
	"orange":[255,165,0],
	"orangered":[255,69,0],
	"orchid":[218,112,214],
	"palegoldenrod":[238,232,170],
	"palegreen":[152,251,152],
	"paleturquoise":[175,238,238],
	"palevioletred":[219,112,147],
	"papayawhip":[255,239,213],
	"peachpuff":[255,218,185],
	"peru":[205,133,63],
	"pink":[255,192,203],
	"plum":[221,160,221],
	"powderblue":[176,224,230],
	"purple":[128,0,128],
	"rebeccapurple":[102,51,153],
	"red":[255,0,0],
	"rosybrown":[188,143,143],
	"royalblue":[65,105,225],
	"saddlebrown":[139,69,19],
	"salmon":[250,128,114],
	"sandybrown":[244,164,96],
	"seagreen":[46,139,87],
	"seashell":[255,245,238],
	"sienna":[160,82,45],
	"silver":[192,192,192],
	"skyblue":[135,206,235],
	"slateblue":[106,90,205],
	"slategray":[112,128,144],
	"slategrey":[112,128,144],
	"snow":[255,250,250],
	"springgreen":[0,255,127],
	"steelblue":[70,130,180],
	"tan":[210,180,140],
	"teal":[0,128,128],
	"thistle":[216,191,216],
	"tomato":[255,99,71],
	"turquoise":[64,224,208],
	"violet":[238,130,238],
	"wheat":[245,222,179],
	"white":[255,255,255],
	"whitesmoke":[245,245,245],
	"yellow":[255,255,0],
	"yellowgreen":[154,205,50],
	
}

var colorStrBrightnessTrans = {
	rgba:function(rgbaStr,transMethod){
		// rgbaStr:"r","g","b"(?:,"a")?

		// 看先前紀錄
		if(colorTransRecordObj[transMethod].hasOwnProperty(rgbaStr)){
			return(colorTransRecordObj[transMethod][rgbaStr])
		}

		var funcName = "colorStrBrightnessTrans.rgba"
		var rgbNums = rgbaStr.split(",")

		// 轉數字
		for(let i of [0,1,2]){
			rgbNums[i] = Number(rgbNums[i])

		}

		if(rgbNums.length === 3){rgbNums.push(1)}

		var newRgbaStr = null
		if(rgbNums.length === 4){
			//轉換
			let newRgbNums = rgbNumsBrightnessTrans[transMethod](rgbNums)
			if(!checkObjEqual(rgbNums,newRgbNums)){
				newRgbaStr = newRgbNums.join(", ")
			}
		}

		// 顯示
		// console.log(funcName,":\n",rgbaStr,"====",transMethod,"==>",newRgbaStr)

		// 儲存
		colorTransRecordObj[transMethod][rgbaStr] = newRgbaStr
		
		// 輸出
		return(colorTransRecordObj[transMethod][rgbaStr])
	},
	hex:function(hexStr,transMethod){
		// 載入紀錄
		if(colorTransRecordObj[transMethod].hasOwnProperty(hexStr)){
			return(colorTransRecordObj[transMethod][hexStr])
		}
		
		// 轉換成rgbaNums
		var rgbNums = [0,0,0]
		
		let eachHexLen = hexStr.length/3
		let multiply = (eachHexLen === 2)?1:17
		for(let i of [0,1,2]){
			let eachHexStr = hexStr.substr(i*eachHexLen,eachHexLen)
			rgbNums[i] = parseInt(eachHexStr,16)*multiply
		}

		//亮度轉換
		let newRgbNums = rgbNumsBrightnessTrans[transMethod](rgbNums)

		// 轉成Hex
		var newHexStr = null
		if(!checkObjEqual(rgbNums,newRgbNums)){
			newHexStr = ""
			for(let i of [0,1,2]){
				newHexStr += newRgbNums[i].toString(16)
			}
		}
		var funcName = "colorStrBrightnessTrans.hex"
		// 顯示
		// console.log(funcName,":\n",hexStr,"====",transMethod,"==>",newHexStr)

		// 紀錄
		colorTransRecordObj[transMethod][hexStr] = newHexStr
		
		// 輸出
		return(newHexStr)
	},
	hsla:function(hslaStr,transMethod){
		// 載入紀錄
		if(colorTransRecordObj[transMethod].hasOwnProperty(hslaStr)){
			return(colorTransRecordObj[transMethod][hslaStr])
		}

		//亮度轉換 (亮度範圍:0~100)
		const brightnessNumTrans = {
			brightest:function(brightnessNum){return(100)},
			darkest:function(brightnessNum){return(0)},
			brighter:function(brightnessNum){
				return((brightnessNum<50)?(100-brightnessNum):brightnessNum)
			},
			darker:function(brightnessNum){
				return((brightnessNum>50)?(100-brightnessNum):brightnessNum)
			},
		}

		var changeFlag = false
		// 找最後一個%值(亮度值)
		var newHslaStr = hslaStr.replace(
			/\d+(?=\%[^\%]*?$)/,function(brightnessStr){
				// 轉數字
				var brightness = Number(brightnessStr)

				// 修正範圍
				brightness = Math.max(0,brightness)
				brightness = Math.min(100,brightness)
				// 轉換亮度
				var newBrightness = brightnessNumTrans[transMethod](brightness)
				// 確認有無改變
				changeFlag = (brightness !== newBrightness)
				return(String(newBrightness))
			}
		)
		if(!changeFlag){
			newHslaStr = null
		}

		var funcName = "colorStrBrightnessTrans.hsla"

		colorTransRecordObj[transMethod][hslaStr] = newHslaStr
		// console.log(funcName,":\n",hslaStr,"====",transMethod,"==>",newHslaStr)
		return(newHslaStr)
	},
	colorName:function(colorStr,transMethod){
		// 載入紀錄
		if(colorTransRecordObj[transMethod].hasOwnProperty(colorStr)){
			return(colorTransRecordObj[transMethod][colorStr])
		}

		//若有儲存於colorName中 載入儲存中的紀錄並轉換
		var colorNameStrLowerCase = colorStr.toLowerCase()
		var funcName = "colorStrBrightnessTrans.colorName"
		// 載入顏色
		if(!colorNameToRgb.hasOwnProperty(colorNameStrLowerCase)){
			colorTransRecordObj[transMethod][colorStr] = null
			console.log(funcName,"colorStr沒有對應的顏色格式:",colorStr)
			return(null)
		}
		var rgbNums = colorNameToRgb[colorNameStrLowerCase]
		// 轉換亮度
		var newRgbNums = rgbNumsBrightnessTrans[transMethod](rgbNums)
		var newColorStr = null
		if(!checkObjEqual(rgbNums,newRgbNums)){
			newColorStr = "rgb("+newRgbNums.join(", ")+")"
		}
		colorTransRecordObj[transMethod][colorStr] = newColorStr
		
		// console.log(funcName,":\n",colorStr,"====",transMethod,"==>",newColorStr)
		return(newColorStr)
	}
}
//顏色對應表 避免重新運算
var colorTransRecordObj = {
	darker:{},
	brighter:{},
	darkest:{},
	brightest:{},
}

var passColorStrList = "|none|inherit|initial|transparent|repeat|scroll|center|bottom|top|left|right|medium|solid|normal|ease|running|default|auto".split("|")

// 把不用改的字串寫進null
var writePassColorStrFunc = function(){
	for (let passColorStr of passColorStrList){
		for(let transMethod in colorTransRecordObj){
			colorTransRecordObj[transMethod][passColorStr] = null
		}
	}
}
writePassColorStrFunc()



for(let transMethod in colorTransRecordObj){
	colorTransRecordObj[transMethod][null] = null
}


colorTransRecordObj["darker"]["initial"] = "black"
colorTransRecordObj["darkest"]["initial"] = "black"

colorTransRecordObj["brighter"]["initial"] = "white"
colorTransRecordObj["brightest"]["initial"] = "white"
var fullColorStrBrightnessTransFunc = function(colorStr,transMethod){
	////////////////////////////////////////////
	//輸入種類 ColorName HEX RGBA HSLA none transparent inherit
	//若輸入是none transparent inherit 不修改

	//transMethod 必須為 Brightest Darkest Brighter Darker
	//透明度不會修改

	//輸入RGBA HEX ColorName
	//輸出RGBA

	//輸入HSLA
	//輸出HSLA
	
	////////////////////////////////////////////
	var changeFlag = false
	var newColorStr = colorStr.replace(
		new RegExp(
			[
				"(^|\\s|\\(|\\,)",
				"(?:",
					"rgba?\\((.+?)\\)",
					"|",
					"hsla?\\((.+?)\\)",
					"|",
					"\\#([0-9a-f]{3}[0-9a-f]{3}?)",
					"|",
					"([a-z]+)",
				")",
				"(?=$|\\s|\\)|\\,)",
			].join(""),"img"
		),function(matchStr,pp,p1,p2,p3,p4){
			// rgba
			var replaceStr = null
			if(p1){
				replaceStr = colorStrBrightnessTrans.rgba(p1,transMethod)
				if(!replaceStr){return(matchStr)}
				replaceStr = "rgba("+replaceStr+")"
			}
			// hsla
			else if(p2){
				replaceStr = colorStrBrightnessTrans.hsla(p2,transMethod)
				if(!replaceStr){return(matchStr)}
				replaceStr = "hsla("+replaceStr+")"
			}
			//HEX(3或6個16進制數字)
			else if(p3){
				replaceStr = colorStrBrightnessTrans.hex(p3,transMethod)
				if(!replaceStr){return(matchStr)}
				replaceStr = "#"+replaceStr
			}
			else if(p4){
				replaceStr = colorStrBrightnessTrans.colorName(p4,transMethod)
				if(!replaceStr){return(matchStr)}
			}
			changeFlag = true
			return(pp+replaceStr)
		}
	)

	if(!changeFlag){
		return(null)
	}
	return(newColorStr)
}

// 圖片亮度變暗功能
// filter: brightness(0.5);
var imgElemBrightnessTrans = function(getStyleObj,setStyleObj,brightness){
	// var elemStyle = getComputedStyle(elem)
	
	var filterProperty = getStyleObj.getPropertyValue("filter")
	
	var styleChangeFlag = false
	// 將裡面的brightness值*brightness
	var newFilterProperty = filterProperty.replace(
		/brightness\((.*?)\)/i,function(matchStr,elemBrightness){
			
			styleChangeFlag = true
			return("brightness("+String(brightness)+")")
		}
	)

	if(!styleChangeFlag){
		if(filterProperty.match(/^(?:none|)$/)){
			var newFilterProperty = "brightness("+String(brightness)+")"
		}
		else{
			var newFilterProperty = filterProperty+" brightness("+String(brightness)+")"
		}
	}
	
	setStyleObj.setProperty("filter",newFilterProperty)
	return(newFilterProperty)
}
// rgbNumsBrightnessTrans[transMethod](rgbNums)
//rgbNums r,g,b,a 必須都是數字 (rgb = 0~255)(a = 0~1)
//transMethod 必須為 Brightest (最亮) Darkest (最暗) Brighter (較亮) Darker (較暗)
const rgbNumsBrightnessTrans = {
	brightest:function(rgbNums){
		let newRgbNums = rgbNums.slice()
		// 取得最大值
		let addNum =255-Math.max(newRgbNums[0],newRgbNums[1],newRgbNums[2])
		//加到最大的數值
		for(let k of [0,1,2]){
			newRgbNums[k] += addNum
		}
		return(newRgbNums)
	},
	darkest:function(rgbNums){
		let newRgbNums = rgbNums.slice()
		//取得最小值
		let subtraNum = Math.min(newRgbNums[0],newRgbNums[1],newRgbNums[2])
		//減到最小的數值 
		for(let k of [0,1,2]){
			newRgbNums[k] -= subtraNum
		}
		return(newRgbNums)
	},
	brighter:function(rgbNums){
		let newRgbNums = rgbNums.slice()
		//計算亮度
		let maxNum = Math.max(newRgbNums[0],newRgbNums[1],newRgbNums[2])
		let minNum = Math.min(newRgbNums[0],newRgbNums[1],newRgbNums[2])
		let brightnessDouble = maxNum+minNum
		//若是較暗 就反轉亮度
		if(brightnessDouble<255){
			let addBrightness = 255-brightnessDouble
			for(let k of [0,1,2]){
				newRgbNums[k] += addBrightness
			}
		}
		return(newRgbNums)
	},
	darker:function(rgbNums){
		let newRgbNums = rgbNums.slice()
		//計算亮度
		let maxNum = Math.max(newRgbNums[0],newRgbNums[1],newRgbNums[2])
		let minNum = Math.min(newRgbNums[0],newRgbNums[1],newRgbNums[2])
		let brightnessDouble = maxNum+minNum
		//若是較暗 就反轉亮度
		if(brightnessDouble>255){
			let subtraBrightness = brightnessDouble-255
			for(let k of [0,1,2]){
				newRgbNums[k] -= subtraBrightness
			}
		}
		return(newRgbNums)
	},
}


var styleSheetBrightnessTransFunc = function(sheet){

	try{
		if(sheet.href){
			console.log("找到style sheet:",sheet.href)
		}
		if(sheet.cssRules instanceof CSSRuleList){
			for(let cssRule of sheet.cssRules){
				cssRuleRecursion(cssRule)
			}
			return(true)
		}
		else{
			if((!sheet.disabled) && sheet.href){
				try{
					requestStyleSheetLink(sheet)
				}
				catch(error){console.error(error)}
			}
		}
	}
	catch(error){
		//若是SecurityError 表示是載入網域外的css檔 禁止讀取內容
		//InvalidAccessError: "A parameter or an operation is not supported by the underlying object" code: 15 nsresult: 0x8053000f
		if(error.name === "SecurityError" || error.name === "InvalidAccessError"){
			// console.log("無法讀取Css連結:\n"+sheet.href)
			if((!sheet.disabled) && sheet.href){
				try{
					requestStyleSheetLink(sheet)
				}
				catch(error){console.error(error)}
			}
		}
		//其他問題
		else{console.error(error)}
	}
	return(false)
}

var cssRuleRecursion = function(cssRule){
	if(cssRule.style instanceof CSSStyleDeclaration){
		reStyleFunc(cssRule)
	}

	if(cssRule.cssRules instanceof CSSRuleList){
		for(let subCssRule of cssRule.cssRules){
			cssRuleRecursion(subCssRule)
		}
	}
}

var requestStyleSheetLink = function(sheet){
	//宣告要求
	var requestObj = new XMLHttpRequest()
	console.log("請求跨領域CSS檔案:",sheet.href)
	
	requestObj.onreadystatechange = function() {
		if(this.readyState===this.DONE && this.status===200) {
			//頁面載入成功後
			var newNode = document.createElement("style")
			newNode.rel = "stylesheet"
			newNode.type="text/css"
			var cssText = this.responseText.replace(/\n/mg," ")

			// 修改路徑(相對路徑會遵照 sheet href,需改成絕對路徑)
			// ex:https://cdn.sstatic.net/Sites/stackoverflow/img/sprites.svg?v=1b3cdae197be
			var newCssText = cssText.replace(
				/url\((.*?)\)/img,
				function(matchStr,p1){
					p1 = p1.replace(/((^\s+)|(\s+$))/img,"")

					var innerUrlMatchObj = p1.match(/^(\"|\')([^\"^\']*?)(\"|\')$/)
					if(innerUrlMatchObj){
						p1 = innerUrlMatchObj[1]+
							getAbsUrl(innerUrlMatchObj[2],sheet.href)+
							innerUrlMatchObj[3]
					}
					else{
						p1 = getAbsUrl(p1,sheet.href)
					}
					return("url("+p1+")")
				}
			)

			newNode.innerText = newCssText
			newNode.className = sheet.ownerNode.className
			newNode.id = sheet.ownerNode.id
			document.head.appendChild(newNode)

			// newNode.sheet.disabled = sheet.disabled
			
			sheet.disabled = true
			// styleSheetBrightnessTransFunc(newNode.sheet)
		}
	}

	requestObj.open("GET",sheet.href,true)
	requestObj.send()
}



///////////////////////////////////////////////////////////////////////
var getAbsUrl = function(url,referenceUrl){
	// 絕對路徑
	if(url.match(/^[a-z]+\:/i)) {
		return(url)
	}
	if(url.match(/^\/\//i)) {
		var prevMatchObj = referenceUrl.match(/^(.*)\/\//)
		if(prevMatchObj){
			var absUrl = prevMatchObj[1]+url
			// console.log(url,"轉換成絕對路徑",absUrl)
			return(absUrl)
		}
	}
	if(url.match(/^\//i)) {
		var prevMatchObj = referenceUrl.match(/^(.*?\/\/.*?)\//)
		if(prevMatchObj){
			var absUrl = prevMatchObj[1]+url
			// console.log(url,"轉換成絕對路徑",absUrl)
			return(absUrl)
		}
	}
	var absUrl = referenceUrl.match(/^(.*\/)/)[1]+url
	// console.log(url,"轉換成絕對路徑",absUrl)
	return(absUrl)
}

var creatNewNodeObserver =  function(doc){

	console.log("建立newNodeObserver")
	// 監視是否有新的節點 加入reStyleTask
	var newNodeObserver = new MutationObserver(
		function (mutationRecords){
			for (let eachMutationObj of mutationRecords){
				// 所有新增的節點
				// console.log("新增節點數:",eachMutationObj.addedNodes.length)
				for(let eachAddNode of eachMutationObj.addedNodes){

					nodeRecursion(eachAddNode,nodeToFuncPointer)
					// if(eachAddNode instanceof Element){
					// 	console.log("新節點的子節點數:",eachAddNode.children.length)
					// }
				}
			}
		}
	)
	
	//設置DOM 變更時就動作
	newNodeObserver.observe(
		doc, //監視目標
		{
			childList:true,		//監視目標節點的子元素新增與移除
			subtree:true,			//監視對於所有目標節點子系
		}
	)
}


var creatStyleSheetMutationObserver = function(doc){
	console.log("建立styleSheetMutationObserver")
	//建立新的觀察物件
	var styleSheetMutationObserver = new MutationObserver(
		function (mutationObjs){
			console.log("偵測到改變:")
			for(let eachMutationObj of mutationObjs){
				//attributes,characterData,childList
				console.log("type:",eachMutationObj.type)
				//改變的節點
				console.log("target:",eachMutationObj.target)
				//回傳改變屬性的local name,若沒有屬性改變回傳null
				console.log("attributeName:",eachMutationObj.attributeName)
				//回傳改變屬性的namespace,若沒有屬性改變回傳null
				console.log("attributeNamespace:",eachMutationObj.attributeNamespace)

			}
		}
	)

	styleSheetMutationObserver.observe(
		doc,{
			attributes:true,
			attributeFilter:["style"],
		}
	)
}

/*var init = function(){
	document.documentElement.style.setProperty("background-color","black")

	window.onbeforeunload = function(){
		document.documentElement.style.setProperty(
			"background-color","black")
	}
	window.onunload = function(){
		document.documentElement.style.setProperty(
			"background-color","black")
	}
	document.onpagehide = function(){
		document.documentElement.style.setProperty(
			"background-color","black")
	}
	document.onpageshow = function(){
		document.documentElement.style.setProperty(
			"background-color","black")
	}
	window.onabort = function(){
		document.documentElement.style.setProperty(
			"background-color","black")
	}
	document.onreadystatechange = function(){
		document.documentElement.style.setProperty(
			"background-color","black")
	}
}
if(optionInfo.changeColorFlag.value){
	// init()
}*/

var reStyleDocElem = async function(docElem){


		
	if(optionInfo.changeColorFlag.value || typeof(optionInfo.minFontSize.value) === "number"){
		setTopIfNoProperty(docElem)
		
		// custom css
		/*var headElem = docElem.querySelector("head")
		if(optionInfo.changeColorFlag.value){
			loadCustomCss("content script/customCss_color.css",headElem)
		}
		if(typeof(optionInfo.minFontSize.value) === "number"){
			loadCustomCss("content script/customCss_fontSize.css",headElem)
		}*/
		// 先建立NewNodeObserver
		creatNewNodeObserver(docElem)
		// 輸入所有的elem
		nodeRecursion(docElem,nodeToFuncPointer)
	}
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
	}
}
reStyleDoc(document)
