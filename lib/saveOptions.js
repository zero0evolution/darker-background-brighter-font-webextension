var saveOptions = function(optionObj){
	return(
		new Promise(
			function(resolve,reject){
				/*var domains = Object.keys(optionObj)
					
				if(domains.length>0){
					var domainsStr = domains.join(",")
					var optionStr = ""
					for(let domain of domains){
						optionStr+=(domain+":\n")
						for(let key in optionObj[domain]){
							optionStr+=("\t"+browser.i18n.getMessage(key)+": "+optionObj[domain][key]+"\n")
						}
					}
					var notificationId = "save option notification"
					browser.notifications.create(
						notificationId, {
							"type": "basic",
							"title": "save options:",
							"message": optionStr
						}
					)

					window.setTimeout(
						function(notificationId){
							browser.notifications.clear(notificationId)
						},5000,notificationId
					)
				}*/
				browser.storage.local.set(optionObj).then(
					function(){resolve("儲存 optionObj 成功")},
					function(error){reject("儲存 optionObj 失敗:${error}")}
				)
			}
		)
	)
}