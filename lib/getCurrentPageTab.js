var getCurrentPageTab = function(){
	return(
		new Promise(
			function(resolve,reject){
				browser.tabs.query({currentWindow: true, active: true}).then(
					function(tabs){resolve(tabs[0])},
					function(error){reject("${error}")}
				)
			}
		)
	)
}
				