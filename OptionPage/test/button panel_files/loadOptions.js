var loadOptions = function(domains){
	return(
		new Promise(
			function(resolve,reject){
				browser.storage.local.get(domains).then(
					function(returnObj){resolve(returnObj)},
					function(error){
						reject("載入 "+domains+" options 失敗:"+`${error}`)
					}
				)
			}
		)
	)
}
