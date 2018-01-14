var saveOptions = function(optionObj){
	return(
		new Promise(
			function(resolve,reject){
				if(browserType.match(/Firefox/i)){
					browser.storage.local.set(optionObj).then(
						function(){resolve("儲存 optionObj 成功")},
						function(error){reject("儲存 optionObj 失敗:${error}")}
					)
				}
				else if(browserType.match(/Chrome/i)){
					browser.storage.local.set(
						optionObj,function(){resolve("儲存 optionObj 成功")}
					)
				}
				else{
					reject("未知的瀏覽器:"+browserType)
				}
			}
		)
	)
}