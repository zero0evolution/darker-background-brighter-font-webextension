'use strict';

window.onload = async function(){
	// navigator.userAgent
	// firefox android:"Mozilla/5.0 (Android 6.0.1; Mobile; rv:57.0) Gecko/57.0 Firefox/57.0"
	// firefox developer edition:"Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0"
	if(navigator.userAgent.match(/mobile/i)){
		loadCustomCss("OptionPage/optionPage-mobile.css",document.head)
	}
	else{
		loadCustomCss("OptionPage/optionPage-desktop.css",document.head)
	}

	// 若firefox 版本>=57 runTaskQuantityAt1Time預設數字為20
	var browserInfo = await getBrowserInfo()
	console.log(browserInfo)
	if(browserInfo.name.match(/^Firefox$/i)){
		var versionMatchObj = browserInfo.version.match(/^\d+(?:\.\d+)/)
		if(versionMatchObj){
			var version = Number(versionMatchObj[0])
			if(version >= 57){
				optionInfo.runTaskQuantityAt1Time.defaultNumValue = 20
			}
		}
	}

	// get domains
	var tab = await getCurrentPageTab()
	var framesInfo = await browser.webNavigation.getAllFrames({tabId:tab.id})
	var domains = new Set()
	for (let frameInfo of framesInfo){
		if(typeof(frameInfo.url) === "string"){
			// console.log(frameInfo.url)
			var domain = urlToDomain(frameInfo.url)
			domains.add(domain)
		}
	}
	domains.add("")

	if(domains.size>0){
		// 
		var selectTextElem = document.createElement("span")
		selectTextElem.innerText = browser.i18n.getMessage("selectDomainText")
		document.body.appendChild(selectTextElem)

		// domainSelectElem
		var domainSelectElem = document.createElement("select")
		domainSelectElem.id = "domainSelectElem"
		document.body.appendChild(domainSelectElem)

		document.body.appendChild(document.createElement("br"))
		
		// domainSelectElem change function
		var changeDomainFunc = async function(){
			// 得到option
			var domain = document.getElementById("domainSelectElem").value

			// 移除optionBlock
			for(let optionBlockElem of document.querySelectorAll(".optionBlock")){
				optionBlockElem.remove()
			}

			// 判斷是否為可使用網域
			var canAccessFlag = !checkUrlRestriction(domain)

			if(!canAccessFlag){
				// add cantAccessText
				var infoBlock = document.createElement("div")
				infoBlock.classList.add("optionBlock")
				infoBlock.innerText = browser.i18n.getMessage("cantAccessText")
				document.body.appendChild(infoBlock)
			}
			else{
				// optionInfo[optionKey].value 初使化為null
				for(let optionKey of optionKeys){
					optionInfo[optionKey].value = null
				}

				// 讀取option 紀錄
				var optionObj = await loadOptions(domain)
				// console.log("browser.storage.local.get optionObj:",optionObj)
				if(optionObj.hasOwnProperty(domain)){
					for(let optionKey of optionKeys){
						if(!optionObj[domain].hasOwnProperty(optionKey)){continue}
						optionInfo[optionKey].value = optionObj[domain][optionKey]
					}
				}
				// 若為全域設定頁(domain === "") 就不需要NullButton
				var hasNullButtonFlag = true
				if(domain === ""){hasNullButtonFlag = false}
				// 顯示選單
				for(let optionKey of optionKeys){
					var optionBlockElem = createOptionBlock(
						domain,optionKey,optionInfo[optionKey],hasNullButtonFlag)
					
					document.body.appendChild(optionBlockElem)
				}

				// add reload text
				document.body.appendChild(createReloadButton())
			}
		}

		domainSelectElem.onchange = changeDomainFunc

		// add all domains to selectDomainElem children(option elem)
		for(let domain of domains){
			var optionElem = document.createElement("option")
			if(domain === ""){
				optionElem.innerText = browser.i18n.getMessage("globalSettingText")
			}
			else{
				optionElem.innerText = domain
			}
			optionElem.value = domain
			domainSelectElem.appendChild(optionElem)
		}

		// 建立"前往全域設定頁"按鈕

		var goGlobalSettingButton = document.createElement("div")
		goGlobalSettingButton.id = "goGlobalSettingButton"
		goGlobalSettingButton.innerText = browser.i18n.getMessage("goGlobalSettingText")
		document.body.appendChild(goGlobalSettingButton)
		goGlobalSettingButton.onclick = function(event){
			// domainSelectElem.selectedIndex = domainSelectElem.children.length-1
			domainSelectElem.value = ""
			changeDomainFunc()
		}
		// 建立贊助按鈕
		var supportDeveloperButton = document.createElement("div")
		supportDeveloperButton.id = "supportDeveloperButton"
		supportDeveloperButton.innerText = browser.i18n.getMessage("supportDeveloperText")
		document.body.appendChild(supportDeveloperButton)
		supportDeveloperButton.onclick = function(event){
			window.open("https://www.paypal.me/zero0evolution/0USD")
			window.close()
		}

		// 選擇第一個選項並生成設定頁面
		if(domainSelectElem.firstChild.value === "about:addons"){
			domainSelectElem.value = ""
		}
		else{
			domainSelectElem.value = domainSelectElem.firstChild.value
		}
		changeDomainFunc()
	}
}