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
