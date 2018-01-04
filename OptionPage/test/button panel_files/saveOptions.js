var saveOptions = function(optionObj){
	return(
		new Promise(
			function(resolve,reject){
				browser.storage.local.set(optionObj).then(
					function(){resolve("儲存 optionObj 成功")},
					function(error){reject("儲存 optionObj 失敗:${error}")}
				)
			}
		)
	)
}