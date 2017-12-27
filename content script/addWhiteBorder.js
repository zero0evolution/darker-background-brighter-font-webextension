var addWhiteBorder = function(getStyleObj,setStyleObj){
	// 若沒有加drop-shadow 就加上
	var filterProperty = getStyleObj.getPropertyValue("filter")
	var dropShadowStr = "drop-shadow(rgb(255, 255, 255) 0px 0px 1px)"
	if(filterProperty.indexOf(dropShadowStr) < 0){
		if(filterProperty.match(/^(?:none|)$/)){
			var newFilterProperty = [dropShadowStr,dropShadowStr].join(" ")
		}
		else{
			var newFilterProperty = filterProperty+" "+[dropShadowStr,dropShadowStr].join(" ")
		}
		setStyleObj.setProperty("filter",newFilterProperty)
	}
	return(newFilterProperty)
}