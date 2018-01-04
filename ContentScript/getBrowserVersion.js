// 若firefox 版本>=57 runTaskQuantityAt1Time預設為20
var getBrowserVersion = function(){
	var matchVersionObj = navigator.userAgent.match(
		/(?:firefox)\/(\d+(?:\.\d+)?)/im)
	if(matchVersionObj){
		var version = Number(matchVersionObj[1])

		return(version)
		
	}
}