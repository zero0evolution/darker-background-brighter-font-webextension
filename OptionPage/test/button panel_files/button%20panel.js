'use strict';

var optionKeys = ["changeColorFlag","imgBrightness","bgImgBrightness","minFontSize","runTaskQuantityAt1Time"]

var optionInfo = {
	changeColorFlag:{
		type:"boolean",
		value:null,
	},
	imgBrightness:{
		type:"number",
		maxValue:1,
		minValue:0,
		step:0.05,
		value:null,
		defaultNumValue:1,
	},
	bgImgBrightness:{
		type:"number",
		maxValue:1,
		minValue:0,
		step:0.05,
		value:null,
		defaultNumValue:1,
	},
	minFontSize:{
		type:"number",
		maxValue:48,
		minValue:12,
		step:1,
		value:null,
		defaultNumValue:12,
	},
	runTaskQuantityAt1Time:{
		type:"number",
		maxValue:100,
		minValue:1,
		step:1,
		value:null,
		defaultNumValue:1,
	},
}

// 若firefox 版本>=57 runTaskQuantityAt1Time預設數字為20
browser.runtime.getBrowserInfo().then(
	function(info){
		// console.log(info)
		var numMatchObj = info.version.match(/^\d+/)
		if(numMatchObj){
			var version = String(numMatchObj[0])
			if(version >= 57){
				optionInfo.runTaskQuantityAt1Time.defaultNumValue = 20
			}
		}
	}
)


// 判斷是否為可使用網域
var canAccessFlag = false
var tab
var url
var domain

window.onload = async function(){
	document.body.style.width = "750px"
	document.body.style.height = "auto"

	// get page domain
	await browser.tabs.query({currentWindow: true, active: true}).then(
		function(tabs){
			tab = tabs[0]
			url = tab.url

			if(typeof(url) === "string"){
				// 解析 domain
				domain = urlToDomain(url)

				var cantAccessDomainObj = {
					"https://addons.mozilla.org":true,
				}
				// 非about:開頭 非在cantAccessDomainObj名單內
				canAccessFlag = ( !domain.match(/^about\:/) ) && ( !cantAccessDomainObj[domain] )

				var infoBlock = createInfoBlock(domain,canAccessFlag)
				document.body.appendChild(infoBlock)
			}
			else{
				createInfoBlock(String(url),false)
			}
		},
		function(error){
			createInfoBlock(error.name,false)
			console.error(error)
		}
	)

	if(canAccessFlag){
		// 讀取option 紀錄
		var optionObj = await loadOptions(domain)
		console.log(
			"browser.storage.local.get optionObj:",optionObj)

		if(optionObj.hasOwnProperty(domain)){
			for(let optionKey of optionKeys){
				if(!optionObj[domain].hasOwnProperty(optionKey)){continue}
				optionInfo[optionKey].value = optionObj[domain][optionKey]
			}
		}
		
		// 顯示選單
		for(let optionKey of optionKeys){
			var optionBlockElem = createOptionBlock(
				domain,optionKey,optionInfo[optionKey],true)
			
			document.body.appendChild(optionBlockElem)
		}
	}
	document.body.appendChild(createGoGlobalSettingButton())
}