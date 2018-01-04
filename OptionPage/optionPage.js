'use strict';

var domain = ""

window.onload = async function(){

	// 若firefox 版本>=57 runTaskQuantityAt1Time預設數字為20
	var browserInfo = await getBrowserInfo()
	var versionMatchObj = browserInfo.version.match(/^\d+(?:\.\d+)/)
	console.log("browserInfo:",browserInfo)
	if(versionMatchObj){
		var version = Number(versionMatchObj[0])
		if(version >= 57){
			optionInfo.runTaskQuantityAt1Time.value = 20
			optionInfo.runTaskQuantityAt1Time.defaultNumValue = 20
		}
	}

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
			domain,optionKey,optionInfo[optionKey],false)
		
		document.body.appendChild(optionBlockElem)
	}
}