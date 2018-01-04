var getBrowserInfo = function(){
	return(
		new Promise(
			function(resolve,reject){
				browser.runtime.getBrowserInfo().then(
					function(info){resolve(info)},
					function(error){reject("${error}")}
				)
			}
		)
	)
}
				