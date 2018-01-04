'use strict';

window.onload = async function(){
	// 調整視窗寬高
	document.body.style.width = "750px"
	//String(window.innerWidth-10)+"px"
	// document.body.style.height = "auto"

	// 若firefox 版本>=57 runTaskQuantityAt1Time預設數字為20
	var browserInfo = await getBrowserInfo()
	var versionMatchObj = browserInfo.version.match(/^\d+(?:\.\d+)/)
	if(versionMatchObj){
		var version = Number(versionMatchObj[0])
		if(version >= 57){
			optionInfo.runTaskQuantityAt1Time.defaultNumValue = 20
		}
	}

	for(let optionKey of optionKeys){
		// 初使化為null
		optionInfo[optionKey].value = null
	}
	
	// get page domain
	var tab = await getCurrentPageTab()
	var url = tab.url
	var domain = url

	// 判斷是否為可使用網域
	var canAccessFlag = false
	if(typeof(url) === "string"){
		// 解析 domain
		domain = urlToDomain(url)

		var cantAccessDomainObj = {
			"https://addons.mozilla.org":true,
		}
		// 非about:開頭 非在cantAccessDomainObj名單內
		canAccessFlag = ( !domain.match(/^about\:/) ) && ( !cantAccessDomainObj[domain] )

		var infoBlock = createInfoBlock(domain,canAccessFlag)
	}
	else{
		var infoBlock = createInfoBlock(String(url),false)
	}
	document.body.appendChild(infoBlock)


	if(canAccessFlag){
		// 讀取option 紀錄
		var optionObj = await loadOptions(domain)
		console.log("browser.storage.local.get optionObj:",optionObj)

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
		document.body.appendChild(createReloadButton())
	}
	document.body.appendChild(createGoGlobalSettingButton())
}