'use strict';

var listObjFunc = function(obj,indent){
	if(typeof(indent) !== 'string'){
		indent = "";
	}
	if(Object.prototype.toString.call(obj) === '[object Object]'){
		var listObjStr = "";
		for(var objkey in obj){
			
			if(Object.prototype.toString.call(obj[objkey]) === '[object Object]'){
				var newIndent = indent+"    ";
				listObjStr = listObjStr.concat(objkey,":\n");
				listObjStr = listObjStr.concat(listObjFunc(obj[objkey],newIndent));
			}
			else{
				listObjStr = listObjStr.concat(
					indent,objkey,":",String(obj[objkey]),"\n");
			}
		}
		// var objStr = JSON.stringify(obj);
		return(listObjStr)
	}
	else{
		return(indent+String(obj))
	}
}

var listErrorInfoFunc = function(error){
	var errorInfo = "";
	
	errorInfo = errorInfo.concat("Error:", error.name,"\n");
	errorInfo = errorInfo.concat(error.stack,"\n");
	errorInfo = errorInfo.concat(error.message);
	return(errorInfo)
}



var boolToStrFunc = function({input,unknownReturn} = {input:undefined,unknownReturn:"null"}){
	// 輸入true false就回傳'true' 'false'，否則就回傳 'null'
	if(typeof(input) === 'boolean') return(String(input))
	else return(unknownReturn)
}

var strToBoolFunc = function({input,unknownReturn} = {input:undefined,unknownReturn:null}){
	// 輸入'true' 'false'就轉成true false，否則就回傳null
	if((input) === "true") return(true)
	else if((input) === "false") return(false)
	return(unknownReturn)
}

var numToBoolStrFunc = function({input,unknownReturn} = {input:undefined,unknownReturn:'null'}){
	// 只要是數字就回傳 'true'
	// 否則就回傳 'null'
	if(typeof(input) === 'number') return('true')
	else return(unknownReturn)
}

var optionAttrDict = {
	EnableReStyleColorFunc:{
		getBoolStr:boolToStrFunc,
		getValue:strToBoolFunc,
	},
	HighestReStyleColorPriority:{
		getBoolStr:boolToStrFunc,
		getValue:strToBoolFunc,
	},
	ChangeHoverColor:{
		getBoolStr:boolToStrFunc,
		getValue:strToBoolFunc,
	},
	ObserveStyle:{
		getBoolStr:boolToStrFunc,
		getValue:strToBoolFunc,
	},
	RemoveBgImg:{
		getBoolStr:boolToStrFunc,
		getValue:strToBoolFunc,
	},
	EnableBiggerFontFunc:{
		getBoolStr:boolToStrFunc,
		getValue:strToBoolFunc,
	},
	MinFontSize:{
		showTextElemId:"ShowMinFontSizeElem",
		textAttr:"innerText",
		getBoolStr:numToBoolStrFunc,
		getTextStr:function(value){
			if(typeof(value) === 'number') return(String(value))
			else return(String(optionAttrDict.MinFontSize.defaultValue))
		},
		getValue:function({boolStrValue,textStrValue}={boolStrValue:null,textStrValue:"26"}){
			
			if(boolStrValue === 'true'){
				if(typeof(textStrValue) === 'string'){
					if(!isNaN(textStrValue)){
						var textValueNum = Number(textStrValue);
						// 限定範圍8~72
						if(textValueNum<8) textValueNum = 8;
						else if(textValueNum>72) textValueNum = 72;
						return(textValueNum)
					}
				}
			}
			return(null)
		},
	},
	ReStyleElemsAtOneTime:{
		getBoolStr:numToBoolStrFunc,
		showTextElemId:"SetReStyleElemsNumAtOneTime",
		textAttr:"value",
		getTextStr:function(value){
			if(typeof(value) === 'number') return(String(value))
			else return("Custom")
		},
		getValue:function({boolStrValue,textStrValue} = {boolStrValue:null,textStrValue:"1"}){
			
			if(boolStrValue === 'true'){
				if(typeof(textStrValue) === 'string'){
					if(!isNaN(textStrValue)){

						var textValueNum = Number(textStrValue);
						// 最小值為1
						if(textValueNum<=0) textValueNum = 1;
						return(textValueNum)
					}
				}
			}
			
			return(null)
		},
	},
}

// 匯入 self.options.optionAttrDict 到 optionAttrDict
for(var optionKey in self.options.optionAttrDict){
	for(var optionAttrKey in self.options.optionAttrDict[optionKey]){
		optionAttrDict[optionKey][optionAttrKey] = self.options.optionAttrDict[optionKey][optionAttrKey]
	}
}

var creatOptionInterface = function(){
	var optionElems = document.getElementsByClassName('option')
	// 在各選項寫入text值
	for(var optionIndex=0;optionIndex<optionElems.length;optionIndex++){
		// 若option為button 且有data-value
		if((optionElems[optionIndex].hasAttribute('data-value')) &&(optionElems[optionIndex].tagName.match(/^button$/i))){
			// 寫入null title
			var optionValue = optionElems[optionIndex].getAttribute('data-value')
			if(optionValue === 'null'){
				optionElems[optionIndex].innerText = self.options.addonAttrDict.optionNullTitle
			}
			else if(optionValue === 'true'){
				optionElems[optionIndex].innerText = self.options.addonAttrDict.optionTrueTitle
			}
			else if(optionValue === 'false'){
				optionElems[optionIndex].innerText = self.options.addonAttrDict.optionFalseTitle
			}
		}

	}
	// 寫入title
	document.getElementById('showDomainTitle').innerText = self.options.addonAttrDict.showDomainTitle;
	document.getElementById('noDomainTitle').innerText = self.options.addonAttrDict.noDomainTitle;
	document.getElementById('openOptionForAllTitle').innerText = self.options.addonAttrDict.openOptionForAllTitle;

	document.getElementById('hidePanelElemId').innerText = self.options.addonAttrDict.hidePanelElemTitle;

	// 設定panel的文字大小 body button input
	var panelFontSizeStr = self.options.addonAttrDict.panelFontSizeStr;
	document.body.style.setProperty('font-size',panelFontSizeStr)

	var buttonElems = document.getElementsByTagName('button')
	for(var index = 0;index<buttonElems.length;index++){
		buttonElems[index].style.setProperty('font-size',panelFontSizeStr)
	}

	var inputElems = document.getElementsByTagName('input')
	for(var index = 0;index<inputElems.length;index++){
		inputElems[index].style.setProperty('font-size',panelFontSizeStr)
	}

	// 寫入optionTitle optionDescription
	var optionBlockElems = document.getElementsByClassName("optionBlock");
	for(var index = 0;index<optionBlockElems.length;index++){
		if(optionBlockElems[index].hasAttribute('data-name')){
			var optionBlockName = optionBlockElems[index].getAttribute('data-name')
			// console.log(optionBlockName)
			if(optionAttrDict.hasOwnProperty(optionBlockName)){
				optionBlockElems[index].getElementsByClassName("optionTitle")[0].innerText = optionAttrDict[optionBlockName]['title']

				optionBlockElems[index].getElementsByClassName("optionDescription")[0].innerText = optionAttrDict[optionBlockName]['description']
				
			}
		}
	}
}



var detectIsFirefoxAddon = function(){
	if(typeof(self) !== 'object') return(false)
	if(typeof(self.port) !== 'object') return(false)
	if(typeof(self.port.emit) !== 'function') return(false)
	if(typeof(self.port.once) !== 'function') return(false)
	if(typeof(self.port.on) !== 'function') return(false)
	return(true)
}

var detectIsChromeExtension = function(){
	if(typeof(chrome) !== 'object') return(false)
	
	if(typeof(chrome.tabs) !== 'object') return(false)
	if(typeof(chrome.tabs.sendMessage) !== 'function') return(false)
	if(typeof(chrome.tabs.query) !== 'function') return(false)

	if(typeof(chrome.storage) !== 'object') return(false)
	if(typeof(chrome.storage.sync) !== 'object') return(false)
	if(typeof(chrome.storage.sync.get) !== 'function') return(false)
	if(typeof(chrome.storage.sync.set) !== 'function') return(false)

	if(typeof(chrome.runtime) !== 'object') return(false)
	if(typeof(chrome.runtime.getURL) !== 'function') return(false)

	return(true)
}

var detectBrowserFunc = function(){
	if(detectIsFirefoxAddon()) return("Firefox");
	if(detectIsChromeExtension()) return("Chrome");
	return(null)
}

const browser = detectBrowserFunc();
console.log("偵測瀏覽器類別:"+browser);

const activeOptionClassName = "activeOption";
var addonOptionForDomainInitObj = {};

var writeToAddonOptionForDomainInitObjFunc = function(addonOptionForDomain){
	// 清空addonOption的初始值
	for(var key in addonOptionForDomainInitObj){
		delete(addonOptionForDomainInitObj[key])
	}
	// 紀錄addonOption的初始值
	for(var key in addonOptionForDomain){
		addonOptionForDomainInitObj[key] = addonOptionForDomain[key];
	}
}

var checkDiffWithAddonOptionForDomainInitObjFunc = function(addonOptionForDomain){
	// 確認addonOption是否有改變
	// 僅傳回有改變的選項
	var diffWithAddonOptionForDomain = {};

	for(var key in optionAttrDict){
		if(addonOptionForDomainInitObj[key] !== addonOptionForDomain[key]){
			diffWithAddonOptionForDomain[key] = addonOptionForDomain[key];
		}
	}
	return(diffWithAddonOptionForDomain)
}


var optionElemActiveFunc = function(elem){
	// 點選的 option elem 加上 activeOptionClassName
	// 其他同層的選項移除 activeOptionClassName
	var returnObj = {};
	returnObj['HasOptionClass'] = false;
	returnObj['AddActiveOptionClass'] = false;

	// 確認有option class
	if(elem.classList.contains('option')){
		returnObj['HasOptionClass'] = true;
		// 加入 activeOption class
		if(!elem.classList.contains(activeOptionClassName)){
			elem.classList.add(activeOptionClassName);
			returnObj['AddActiveOptionClass'] = true;
		}
		
		if(elem.hasAttribute("data-name")){
			returnObj['Name'] = elem.getAttribute("data-name");
		}
		if(elem.hasAttribute("data-value")){
			returnObj['Value'] = elem.getAttribute("data-value");
		}
		// 其他選項 移除activeOption class
		var nextElement = elem.nextElementSibling;
		while(Boolean(nextElement)){
			
			if(nextElement.getAttribute("data-name") === elem.getAttribute("data-name")){
				if(nextElement.classList.contains(activeOptionClassName)){
					nextElement.classList.remove(activeOptionClassName);
				}
			}
			nextElement = nextElement.nextElementSibling;
		}
		var previousElement = elem.previousElementSibling;
		while(Boolean(previousElement)){
			
			if(previousElement.getAttribute("data-name") === elem.getAttribute("data-name")){
				if(previousElement.classList.contains(activeOptionClassName)){
					previousElement.classList.remove(activeOptionClassName);
				}
			}
			previousElement = previousElement.previousElementSibling;
		}
		// 若是Chrome 就同時同步選項
		if(browser === 'Chrome'){
			
			syncPerOptionToBackgroundInChrome(elem);
			
		}
		return(returnObj)
	}
}
var getPerOptionValue = function(elem){
	var returnObj = {};
	returnObj['isActiveOption'] = false;
	if(!Boolean(elem)) return(returnObj)
	if(elem.nodeType !== 1) return(returnObj)
	// elem 必需要有data-name data-value activeOptionClassName
	if(!elem.hasAttribute('data-name')) return(returnObj)
	if(!elem.hasAttribute('data-value')) return(returnObj)
	if(!elem.classList.contains(activeOptionClassName)) return(returnObj)
	if(!optionAttrDict.hasOwnProperty(elem.getAttribute('data-name'))) return(returnObj)
	
	returnObj['isActiveOption'] = true;
	var name = elem.getAttribute('data-name')
	var boolStrValue = elem.getAttribute('data-value')
	if(typeof(optionAttrDict[name].showTextElemId) === 'string'){
		var showTextElemId = optionAttrDict[name].showTextElemId;
		var showTextElem = document.getElementById(showTextElemId);
		var textAttr = optionAttrDict[name].textAttr;
		var textStrValue = showTextElem[textAttr];
		var value = optionAttrDict[name].getValue(
			{
				boolStrValue:boolStrValue,
				textStrValue:textStrValue
			}
		);
	}
	else{
		var value = optionAttrDict[name].getValue(
			{
				input:boolStrValue,
				unknownReturn:null
			}
		)
	}
	
	returnObj['name'] = name;
	returnObj['boolStrValue'] = boolStrValue;
	returnObj['showTextElemId'] = showTextElemId;
	returnObj['textAttr'] = textAttr;
	returnObj['textStrValue'] = textStrValue;
	returnObj['value'] = value;
	
	return(returnObj)
}
// chrome版本的active option 還要再加上即時同步option 到 background.js
var syncPerOptionToBackgroundInChrome = function(elem){
	var optionElemInfo = getPerOptionValue(elem);
	if(Boolean(optionElemInfo.isActiveOption)){

		// 傳到background.js 同步
		var showDomainElem = document.getElementById("showDomainElemId");
		var theDomain = showDomainElem.innerText;
		var newAddonOption = {};
		newAddonOption[theDomain] = {};
		newAddonOption[theDomain][optionElemInfo.name] = optionElemInfo.value;
		backgroundPortInChrome.postMessage({'SyncAddonOption':newAddonOption});
		console.log(
			"Button Panel 傳輸Addon Option 到Background:\n"+
			listObjFunc(newAddonOption)
		);
	}	
}

var addOptionElemClickEventFunc = function(){
	// 設定option被點選的功能
	var optionElems = document.getElementsByClassName('option');
	for(var index=0;index<optionElems.length;index++){
		optionElems[index].addEventListener(
			"click",function(event){
				event.stopPropagation();

				optionElemActiveFunc(event.target);
			}
		);
	}
}

var checkReStyleElemsInnerText = function(elemStr,minNum = 1,maxDigit=4,minDigit=1){
	// 先除去不是數字的位元
	var elemCharArray = elemStr.split("");
	var newCharArray = new Array();
	for(var charIndex=0;charIndex<elemCharArray.length;charIndex++){
		if(!isNaN(elemCharArray[charIndex])){
			newCharArray.push(elemCharArray[charIndex]);
		}
	}
	var newElemStr = newCharArray.join("");
	// 最多四位數
	if(newElemStr.length>maxDigit){
		newElemStr = newElemStr.slice(0,maxDigit);
	}
	// 最少要一位數
	if(newElemStr.length<minDigit){
		newElemStr = String(minNum);
	}
	// 最小值為1
	if(parseInt(newElemStr)<minNum){
		newElemStr = String(minNum);
	}

	return(newElemStr)
}
var minFontSizeModifyFunc = function(modifyMethod){
	var changeSizeFlag = false;
	var showMinFontSizeElem = document.getElementById('ShowMinFontSizeElem');
	// 檢查目前顯示的是否是數字
	if(!isNaN(showMinFontSizeElem.innerText)){
		if(modifyMethod === 'add'){
			var newFontSize = parseInt(showMinFontSizeElem.innerText)+1;
			var maxFontSize = optionAttrDict['MinFontSize'].maxValue;
			// 若值太大就限制在最大值
			if(newFontSize>maxFontSize) newFontSize = maxFontSize;
			changeSizeFlag = true;
		}
		else if(modifyMethod === 'sub'){
			var newFontSize = parseInt(showMinFontSizeElem.innerText)-1;
			var minFontSize = optionAttrDict['MinFontSize'].minValue;
			// 若值太大就限制在最大值
			if(newFontSize<minFontSize) newFontSize = minFontSize;
			changeSizeFlag = true;
		}
		else{
			// 不改變值
		}
	}
	// 不是數字就顯示預設值
	else{
		var newFontSize = optionAttrDict['MinFontSize'].defaultValue;
		changeSizeFlag = true;
	}
	showMinFontSizeElem.innerText = String(newFontSize);
}

var addOptionForAllDomainLinkFunc = function(){
	// 寫入Option Menu for all click事件設定 會開新的tab(about:addons)
	var optionForAllDomainLinkElem = document.getElementById("openOptionForAllPage");
	// chrome有不同的option page路徑
	if(browser === 'Chrome'){
		var optionPageUrl = chrome.runtime.getURL('Option Page.html');
		optionForAllDomainLinkElem.innerText = optionPageUrl;
	}
	optionForAllDomainLinkElem.addEventListener(
		"click",function(event){
			event.stopPropagation();
			
			if(browser === 'Firefox'){
				self.port.emit("openPrefs",'');
			}
			else if(browser === 'Chrome'){
				var optionPageUrl = event.target.innerText;
				// chrome.runtime.openOptionsPage();
				window.open(optionPageUrl);
				window.close();
			}
		}
	);
};

var addModifyMinFontSizeButtonClickEventFunc = function(){
	//設定 minFontSizeSet 按鈕功能(+1 -1)
	var minFontSizeAddButtonElem = document.getElementById("minFontSizeAddButton")
	minFontSizeAddButtonElem.addEventListener(
		"click",function(event){
			event.stopPropagation();
			minFontSizeModifyFunc("add");
			// 點擊option
			optionElemActiveFunc(event.target.parentElement);
		}
	);
	var minFontSizeSubButtonElem = document.getElementById("minFontSizeSubButton")
	minFontSizeSubButtonElem.addEventListener(
		"click",function(event){
			event.stopPropagation();
			minFontSizeModifyFunc("sub");
			// 點擊option
			optionElemActiveFunc(event.target.parentElement);
		}
	);

}

var clickOptionChildAlsoActiveOptionFunc = function(){
	// 點選showMinFontSizeElem同時也點選option
	document.getElementById('ShowMinFontSizeElem').addEventListener(
		"click",function(event){
			event.stopPropagation();
			optionElemActiveFunc(event.target.parentElement);
		}
	);
}

var addReStyleElemEventFunc = function(){
	// 設定SetReStyleElemsNum
	var setReStyleElemsNumElem = document.getElementById("SetReStyleElemsNumAtOneTime");
	
	setReStyleElemsNumElem.addEventListener(
		"click",function(event){
			
			event.stopPropagation();
			// 檢查格式
			event.target.value = checkReStyleElemsInnerText(event.target.value);
			// 點選時連同option一同點選
			optionElemActiveFunc(event.target.parentElement);
			// 直接選擇全部
			event.target.select();
		}
	);
	// 輸入時檢查格式
	setReStyleElemsNumElem.addEventListener(
		"keypress",function(event){
			event.stopPropagation();
			//在按下按鍵後檢查格式 
			setTimeout(
				function(elem){
					// 檢查格式 並寫入textarea
					elem.value = checkReStyleElemsInnerText(elem.value);
					
					if(browser === 'Chrome'){
						syncPerOptionToBackgroundInChrome(elem.parentElement);
					}
				},0,event.target
			);
		}
	);
}
var loadAddonOptionForDomainToMenuFunc = function(addonOptionForActiveDomain){
	console.log(
		"Button Panel讀取Addon選項:\n"+
		listObjFunc(addonOptionForActiveDomain)
	);
	// 載入設定
	for(var key in optionAttrDict){

		// 得到boolStr (option elem value)
		var boolStrValue = optionAttrDict[key].getBoolStr(
			{
				input:addonOptionForActiveDomain[key],
				unknownReturn:'null'
			}
		);
		// 在應該點選的option寫入 activeOption class
		var optionElems = document.getElementsByClassName("option");

		for(var index=0;index<optionElems.length;index++){
			// 檢查有 data-name data-value
			if(!optionElems[index].hasAttribute("data-name")) continue
			if(!optionElems[index].hasAttribute("data-value")) continue
			
			if(optionElems[index].getAttribute("data-name") === key){
				if(optionElems[index].getAttribute("data-value") === boolStrValue){
					// 符合的option elem加入 active class
					if(!optionElems[index].classList.contains(activeOptionClassName)){
						optionElems[index].classList.add(activeOptionClassName);
					}
				}
				else{
					// 不符合的option elem 移除 active class
					if(optionElems[index].classList.contains(activeOptionClassName)){
						optionElems[index].classList.remove(activeOptionClassName);
					}
				}
			}
		}
		
		// 得到 text value 寫入 showTextElem
		if('showTextElemId' in optionAttrDict[key]){
			var showTextElemId = optionAttrDict[key].showTextElemId;
			var showTextElem = document.getElementById(showTextElemId);
			var textStrValue = optionAttrDict[key].getTextStr(
				addonOptionForActiveDomain[key]);
			var textAttr = optionAttrDict[key].textAttr;
			showTextElem[textAttr] = textStrValue;
		}
	}
}
var addHidePanelElemClickEventFunc = function(){
	// 設定關閉視窗按鈕
	var hidePanelElem = document.getElementById("hidePanelElemId");
	hidePanelElem.addEventListener(
		"click",function(event){
			event.stopPropagation();
			if(browser === 'Firefox'){
				self.port.emit("HidePanel","");
			}
			else if(browser === 'Chrome'){
				// 關閉panel
				window.close();
			}
		}
	);
}

var loadDomainFunc = function(Domain){
	
	// 寫入domain
	var showDomainElem = document.getElementById("showDomainElemId");
	showDomainElem.innerText = Domain;
	// 隱藏沒有domain訊息
	var noDomainInfoElem = document.getElementById("NoDomainInfo");
	noDomainInfoElem.style.setProperty("display","none");
	// 顯示domain選單
	var domainOptionMenuElem = document.getElementById('DomainOptionMenu');
	domainOptionMenuElem.style.setProperty("display","inline");

	document.body.style.setProperty('height','auto');
	
}
var loadNoDomainFunc = function(Url){
	// 沒有domain的訊息 就隱藏選單 顯示沒有domain訊息 並顯示Url
	
	document.getElementById('ShowUrl').innerText = Url;
	// 顯示沒有domain訊息
	var noDomainInfoElem = document.getElementById("NoDomainInfo");
	noDomainInfoElem.style.setProperty("display","inline");
	// 隱藏domain選單
	var domainOptionMenuElem = document.getElementById('DomainOptionMenu');
	domainOptionMenuElem.style.setProperty("display","none");
	
}

var addDomainListenerInFirefox = function(){
	// 顯示domain
	self.port.on(
		"Domain",function(message){
			var messageObj = JSON.parse(message);
			if(messageObj.hasOwnProperty('Domain')){
				loadDomainFunc(messageObj['Domain']);
			}
			else if(messageObj.hasOwnProperty('Url')){
				loadNoDomainFunc(messageObj['Url']);
			}
		}
	);
}

var sendDomainRequestInChrome = function(){
	// 對當前頁面 傳送domain需求
	chrome.tabs.query(
		{
			active: true,				// Select active tabs
			// lastFocusedWindow: true,	// In the current window
			currentWindow:true,
		},function(arrayOfTabs){
			// 傳輸Domain請求
			chrome.tabs.sendMessage(
				arrayOfTabs[0].id,
				{
					Domain:true,Url:true
				},
				function(response){
					console.log(
						"從Content Script 傳送訊息到Button Panel:\n"+
						listObjFunc(response)
					);
					if(typeof(response) === 'object'){
						if(Object.prototype.toString.call(response) === '[object Object]'){
							
							// 若有domain 顯示option 選單
							if(response.hasOwnProperty('Domain')){
								loadDomainFunc(response['Domain']);
								loadAddonOptionInChrome(response['Domain']);
							}
							else if(response.hasOwnProperty('Url')){
								loadNoDomainFunc(response['Url']);
							}
						}
					}
				}
			);
		}
	);
}
var addLoadAddonOptionListenerInFirefox = function(){
	//載入設定
	self.port.on(
		"SendAddonOptionForActiveTabDomain",function(addonOptionForActiveDomainStr){
			// 載入設定
			var addonOptionForActiveDomain = JSON.parse(addonOptionForActiveDomainStr);
			
			writeToAddonOptionForDomainInitObjFunc(addonOptionForActiveDomain);

			loadAddonOptionForDomainToMenuFunc(addonOptionForActiveDomain);

		}
	);
}

	
var loadAddonOptionInChrome = function(domain){
	//載入設定
	chrome.storage.sync.get(
		domain,function(items){
			
			var addonOptionForDomain = {};

			// 載入設定
			if(typeof(items[domain])==="object"){
				for(var key in optionAttrDict){
					var loadOption = false;
					// 符合格式才載入設定
					if(typeof(items[domain][key]) === optionAttrDict[key].type){
						if(Object.prototype.toString.call(items[domain][key]) === optionAttrDict[key].objectType){
							loadOption = true;
							addonOptionForDomain[key] = items[domain][key];
						}
					}
					//若不符設定 就null
					if(!loadOption){
						console.log(domain,key,'沒有找到紀錄:',items[domain][key])
						addonOptionForDomain[key] = null;
					}
				}
			}
			//若根本沒有設定 就全部都null
			else{
				console.log(domain,'沒有找到紀錄',listObjFunc(addonOptionForDomain))
				for(var key in optionAttrDict){
					addonOptionForDomain[key] = null;
				}
			}
			// 若是全域設定 null就載入defaultValue
			if(domain === "AddonOptionForAll"){
				for(var key in optionAttrDict){
					if(typeof(addonOptionForDomain[key]) !== optionAttrDict[key].type){
						addonOptionForDomain[key] = optionAttrDict.defaultValue;
					}
				}
			}
			// 載入設定選單
			loadAddonOptionForDomainToMenuFunc(addonOptionForDomain)

			var addonOption = {};
			addonOption[domain] = addonOptionForDomain;
			// 同步設定到background
			backgroundPortInChrome.postMessage({SyncAddonOption:addonOption});
			console.log("同步addon option 到Background:\n",listObjFunc(addonOption))
			
		}
	);
}

var showInfoProcessObj = undefined;
var showInfoFunc = function(infoStr){
	var showInfoElem = document.getElementById("ShowInfoElemId");
	// 若之前有 showInfoProcessObj 就停止它並合併訊息
	if(typeof(showInfoProcessObj) !== 'undefined'){
		clearTimeout(showInfoProcessObj);
		showInfoProcessObj = undefined;
		showInfoElem.innerText += infoStr;
	}
	else{
		showInfoElem.innerText = infoStr;
	}
	// 顯示showInfoElem
	showInfoElem.style.setProperty("visibility","visible");
	// 建立 showInfoProcessObj 四秒後隱藏訊息
	showInfoProcessObj = setTimeout(
		function(elem){
			// 隱藏訊息
			elem.style.setProperty("visibility","hidden");
			// 移除process
			showInfoProcessObj = undefined;
		},4000,showInfoElem
	);
}

var addShowInfoListenerInFirefox = function(){
	// 在Panel顯示訊息功能
	self.port.on(
		"ShowInfoInPanel",function(infoStr){
			
			showInfoFunc(infoStr)
		}
	);
}

var getAllAddonOptionForDomainFromMenu = function(){
	// 讀取目前選項設定 並回傳(沒有含domain)
	var newAddonOptionForDomain = {};

	var optionElems = document.getElementsByClassName("option");
	for(var index=0;index<optionElems.length;index++){
		var perOptionInfo = getPerOptionValue(optionElems[index])
		if(perOptionInfo.isActiveOption){
			// 紀錄值
			newAddonOptionForDomain[perOptionInfo.name] = perOptionInfo.value;
		}
		// 若是不屬於optionKeyDict 裡的 option name 跳過
		else continue
	}
	return(newAddonOptionForDomain)
}

var addOnHideListenerInFirefox = function(){
	// 當Panel隱藏時 儲存 addonOption 若有選項更改就重整頁面
	self.port.on(
		"onHide",function(message){
			// 取得domain
			var showDomainElem = document.getElementById("showDomainElemId");
			var theDomain = showDomainElem.innerText;
			// 儲存 AddonOption
			var newAddonOptionForDomain = getAllAddonOptionForDomainFromMenu();

			// 確認addonOption是否有改變 若有改變 就重新整理頁面
			// 僅傳回有改變的選項
			var newDiffAddonOptionForDomain = checkDiffWithAddonOptionForDomainInitObjFunc(newAddonOptionForDomain);


			var newDiffAddonOption = {};
			newDiffAddonOption[theDomain] = newDiffAddonOptionForDomain;
			// 儲存
			self.port.emit(
				"SaveAddonOption",
				JSON.stringify(newDiffAddonOption)
			);
			// 若有選項修改 重整頁面
			if(Object.keys(newDiffAddonOptionForDomain).length>0){
				self.port.emit("ReloadTabIfInDomain",theDomain);
			}
		}
	);
}


var setWindowSizeInChrome = function(){
	/*
	var heightStr = String(window.innerHeight)+"px";
	var widthStr = String(window.innerWidth)+"px";
	*/
	var heightStr = "600px";
	var widthStr = "800px";

	document.documentElement.style.setProperty("height",heightStr);
	document.documentElement.style.setProperty("width",widthStr);
	
	
	document.body.style.setProperty("height","100%");
	// document.body.style.setProperty("width",widthStr);

}

// Button Panel 對 Background.js 溝通管道
var backgroundPortInChrome = undefined;

window.addEventListener(
	"load",function(){
		try{
			creatOptionInterface();
			console.log("Button Panel.html載入完成");
			// 設定 點擊 ModifyMinFontSizeButton 功能(也同時也點擊上層的option elem)
			addModifyMinFontSizeButtonClickEventFunc();
			// 設定 點擊ShowMinFontSizeElem 同時也點擊上層的option elem
			clickOptionChildAlsoActiveOptionFunc();
			// 設定點擊與輸入至 ReStyleElem 的動作
			addReStyleElemEventFunc();
			// 設定點擊option elem的動作
			addOptionElemClickEventFunc();

			// 設定到 OptionForAllDomain 的連結
			addOptionForAllDomainLinkFunc();

			// 設定隱藏panel的按鈕功能
			addHidePanelElemClickEventFunc();
			if(browser === 'Firefox'){
				
				// 設定當domain訊息從addon傳到button panel時的動作
				addDomainListenerInFirefox();
				// 設定當 addon option 從 addon 傳到 button panel 的動作
				addLoadAddonOptionListenerInFirefox();
				// 設定 Hide Panel 訊息 從 addon 傳到 button panel 的動作(儲存選項)
				addOnHideListenerInFirefox();
				// 設定 要顯示的訊息 從addon傳到button panel 後的動作
				addShowInfoListenerInFirefox();

			}
			else if(browser === 'Chrome'){

				backgroundPortInChrome = chrome.runtime.connect(
					{name: "Button Panel"}
				);
				// 設定button panel size
				setWindowSizeInChrome();
				// 要求domain 並載入 addon option
				sendDomainRequestInChrome();
			}
		}
		catch(errorObj){
			if(browser === 'Firefox'){
				self.port.emit("ButtonPanelError",listErrorInfoFunc(errorObj));
			}
			else if(browser === 'Chrome'){
				console.log(listErrorInfoFunc(errorObj));
			}
		}
	}
);

console.log("Button Panel.js 初始設置完成");