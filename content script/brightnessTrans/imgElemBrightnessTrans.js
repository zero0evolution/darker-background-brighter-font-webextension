// 圖片亮度變暗功能
// filter: brightness(0.5);
var imgElemBrightnessTrans = function(elem,brightness){
	// var elemStyle = getComputedStyle(elem)
	
	var elemFilterStr = getComputedStyle(elem).getPropertyValue("filter")
	
	var styleChangeFlag = false
	// 將裡面的brightness值*brightness
	var newElemFilterStr = elemFilterStr.replace(
		/brightness\((.*?)\)/i,function(matchStr,elemBrightness){
			
			styleChangeFlag = true
			return("brightness("+String(brightness)+")")
		}
	)

	if(!styleChangeFlag){
		newElemFilterStr = elemFilterStr+" brightness("+String(brightness)+")"
	}
	
	elem.style.setProperty("filter",newElemFilterStr)
	return(newElemFilterStr)
}