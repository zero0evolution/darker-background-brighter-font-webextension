var fullColorStrBrightnessTransFunc = function(colorStr,transMethod){
	////////////////////////////////////////////
	//輸入種類 ColorName HEX RGBA HSLA none transparent inherit
	//若輸入是none transparent inherit 不修改

	//transMethod 必須為 Brightest Darkest Brighter Darker
	//透明度不會修改

	//輸入RGBA HEX ColorName
	//輸出RGBA

	//輸入HSLA
	//輸出HSLA
	
	////////////////////////////////////////////
	var changeFlag = false
	var newColorStr = colorStr.replace(
		new RegExp(
			[
				"(^|\\s|\\(|\\,)",
				"(?:",
					"rgba?\\((.+?)\\)",
					"|",
					"hsla?\\((.+?)\\)",
					"|",
					"\\#([0-9a-f]{3}[0-9a-f]{3}?)",
					"|",
					"([a-z]+)",
				")",
				"(?=$|\\s|\\)|\\,)",
			].join(""),"img"
		),function(matchStr,pp,p1,p2,p3,p4){
			// rgba
			var replaceStr = null
			if(p1){
				replaceStr = colorStrBrightnessTrans.rgba(p1,transMethod)
				if(!replaceStr){return(matchStr)}
				replaceStr = "rgba("+replaceStr+")"
			}
			// hsla
			else if(p2){
				replaceStr = colorStrBrightnessTrans.hsla(p2,transMethod)
				if(!replaceStr){return(matchStr)}
				replaceStr = "hsla("+replaceStr+")"
			}
			//HEX(3或6個16進制數字)
			else if(p3){
				replaceStr = colorStrBrightnessTrans.hex(p3,transMethod)
				if(!replaceStr){return(matchStr)}
				replaceStr = "#"+replaceStr
			}
			else if(p4){
				replaceStr = colorStrBrightnessTrans.colorName(p4,transMethod)
				if(!replaceStr){return(matchStr)}
			}
			changeFlag = true
			return(pp+replaceStr)
		}
	)

	if(!changeFlag){
		return(null)
	}
	return(newColorStr)
}
