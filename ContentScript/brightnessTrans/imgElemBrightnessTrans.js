// 圖片亮度變暗功能
// filter: brightness(0.5);
var imgElemBrightnessTrans = function(getStyleObj,setStyleObj,brightness){
	// var elemStyle = getComputedStyle(elem)
	
	var filterProperty = getStyleObj.getPropertyValue("filter")
	
	var styleChangeFlag = false
	// 將裡面的brightness值*brightness
	var newFilterProperty = filterProperty.replace(
		/brightness\((.*?)\)/i,function(matchStr,elemBrightness){
			
			styleChangeFlag = true
			return("brightness("+String(brightness)+")")
		}
	)

	if(!styleChangeFlag){
		if(filterProperty.match(/^(?:none|)$/)){
			var newFilterProperty = "brightness("+String(brightness)+")"
		}
		else{
			var newFilterProperty = filterProperty+" brightness("+String(brightness)+")"
		}
	}
	
	setStyleObj.setProperty("filter",newFilterProperty)
	return(newFilterProperty)
}