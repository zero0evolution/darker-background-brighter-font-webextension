
// return obj:
// firefox developer edition
// Object { name: "Firefox", vendor: "Mozilla", version: "58.0", buildID: "20180108140638" }
// firefox android
// Object { name: "Fennec", vendor: "Mozilla", version: "57.0", buildID: "" }
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
				