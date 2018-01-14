var getCurrentPageFramesInfo = function(tab){
	return(
		new Promise(
			function(resolve,reject){
				if(browserType.match(/Firefox/i)){
					browser.webNavigation.getAllFrames({tabId:tab.id}).then(
						function(framesInfo){resolve(framesInfo)},
						function(error){reject("${error}")}
					)
				}
				else if(browserType.match(/Chrome/i)){
					browser.webNavigation.getAllFrames(
						{tabId:tab.id},function(framesInfo){
							resolve(framesInfo)
						}
					)
				}
				else{
					reject("未知的瀏覽器:"+browserType)
				}
			}
		)
	)
}