
var getBrowserVersion = function(){
	var matchVersionObj = navigator.userAgent.match(
		/(?:firefox|chrome)\/(\d+(?:\.\d+)?)/im)
	if(matchVersionObj){
		var version = Number(matchVersionObj[1])
		return(version)
	}
	return(1)
}
var browserVersion = getBrowserVersion()

var browserType = ""
if(typeof(browser) !== "undefined"){
	browserType = "Firefox"
	if(navigator.userAgent.match(/mobile/i)){
		browserType+=" Mobile"
	}
}
else{
	if(typeof(chrome) !== "undefined"){
		var browser = chrome
		browserType = "Chrome"
	}
}


if(!(browserType === "Firefox" && browserVersion<57)){
	optionInfo.runTaskQuantityAt1Time.value = 20
	optionInfo.runTaskQuantityAt1Time.defaultNumValue = 20
}
