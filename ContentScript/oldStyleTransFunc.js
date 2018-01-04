var oldStyleTransFunc = function(elem){
	for(let property in oldAttributeTransObj){
		oldAttributeTransObj[property](elem)
	}
}

var oldAttributeTransObj = {
	color:function(elem){
		var color = elem.color
		elem.removeAttribute("color")
		if(color && (!(elem.style.getPropertyValue("color"))) ){
			var newColor = color.replace(
				/^\#?([0-9a-f]{3}[0-9a-f]{3}?)$/i,function(matchStr,p1){
					if(p1){return("#"+p1)}
					return(matchStr)
				}
			)
			elem.style.setProperty("color",newColor)
		}
	},
	bgColor:function(elem){
		var bgColor = elem.bgColor
		elem.removeAttribute("bgColor")
		if(bgColor && (!(elem.style.getPropertyValue("background-color"))) ){
			
			var newBgColor = bgColor.replace(
				/^\#?([0-9a-f]{3}[0-9a-f]{3}?)$/i,function(matchStr,p1){
					if(p1){return("#"+p1)}
					return(matchStr)
				}
			)
			elem.style.setProperty("background-color",newBgColor)
		}
	},
	background:function(elem){
		var bgImg = elem.background
		elem.removeAttribute("background")
		if(bgImg && (!(elem.style.getPropertyValue("background-image"))) ){
			elem.style.setProperty("background-image",'url("'+bgImg+'")')
		}
	},
	size:function(elem){
		var size = elem.size
		elem.removeAttribute("size")
		if(size && (!elem.style.getPropertyValue("font-size"))){
			var sizeToFontSizeObj = {
				1:"x-small",
				2:"small",
				3:"medium",
				4:"large",
				5:"x-large",
				6:"xx-large",
				7:"xxx-large",
			}
			var sizeNum = parseInt(size)
			if(sizeToFontSizeObj.hasOwnProperty(sizeNum)){
				elem.style.setProperty("font-size",sizeToFontSizeObj[sizeNum])
			}
		}
	}
}
