'use strict';

document.addEventListener(
	"DOMContentLoaded",function() {
		
		// get page domain
		// pageDomain
		var querying = browser.tabs.query({currentWindow: true, active: true})
		querying.then(
			function(tabs){
				var tab = tabs[0]
				var urlFlag = boolean(tab.url)
				// info
				var infoBlock = document.createElement("div")
				infoBlock.classList.add("optionBlock")
				document.body.appendChild(infoBlock)

				if(urlFlag){
					var domain = tab.url
					var domainMatchObj = tab.url.match(/.*?[^\/]\/(?=[^\/])/)
					if(domainMatchObj){domain = domainMatchObj[0]}

					infoBlock.innerText = browser.i18n.getMessage(
						"showDomainText",domain)
				}
				else{
					infoBlock.innerText = browser.i18n.getMessage(
						"cantAccessText")
				}
				

			},
			function(error){
				console.warn(error)
			}
		)


		// show domain in option menu
		// var showDomainElems = document.documentElement.querySelectorAll("#ShowDomain")
		// for(let elem of showDomainElems){
		// 	elem.innerText = browser.i18n.getMessage("showDomainText",pageDomain)
		// }

		// show go global setting text
		// var goGlobalSettingElems = document.documentElement.querySelectorAll("#GoGlobalSetting")
		// for(let elem of goGlobalSettingElems){
		// 	elem.innerText = browser.i18n.getMessage("goGlobalSettingText")
		// }
	}
)