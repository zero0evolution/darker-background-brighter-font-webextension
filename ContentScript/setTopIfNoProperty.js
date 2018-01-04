var defaultFontSizeNum = 16

var defaultColorStr = "rgb(255,255,255)"

// 無顏色的背景就為白色
var defaultBgColorStr = "rgb(0,0,0)"

var setTopIfNoProperty = function(docElem){
	// 回傳是否有更改
	var docElemStyleObj = getComputedStyle(docElem)
	
	// font-size
	if(typeof(optionInfo.minFontSize.value) === "number"){
		var fontSizeStr = docElemStyleObj.getPropertyValue("font-size")
		var fontSizeMatchObj = fontSizeStr.match(/(\d+)px/i)
		if(fontSizeMatchObj){
			// 得到 defaultFontSizeNum
			defaultFontSizeNum = Number(fontSizeMatchObj[1])
			// 若比optionInfo.minFontSize.value小 設定為其值
			
			if(defaultFontSizeNum<optionInfo.minFontSize.value){
				defaultFontSizeNum = optionInfo.minFontSize.value
				docElem.style.setProperty("font-size",
					String(optionInfo.minFontSize.value)+"px")
			}
		}
	}

	// color
	if(optionInfo.changeColorFlag.value){
		var colorStr = docElemStyleObj.getPropertyValue("color")
		var colorMatchObj = colorStr.match(/^rgba?\((.*)\)$/i)
		if(!colorMatchObj){
			docElem.style.setProperty("color",defaultColorStr)
		}
		else{
			// 轉數字
			var rgbNums = colorMatchObj[1].split(",")
			for(let i in rgbNums){rgbNums[i] = Number(rgbNums[i])}
			if(rgbNums.length === 3){rgbNums.push(1)}
			var opacityVal = rgbNums[3]
			for(let i of [0,1,2]){rgbNums[i] = rgbNums[i]*opacityVal}
			rgbNums.pop()
			var newRgbNums = rgbNumsBrightnessTrans["brighter"](rgbNums)
			if(!checkObjEqual(newRgbNums,rgbNums)){
				defaultColorStr = "rgb("+newRgbNums.join(",")+")"
				docElem.style.setProperty("color",defaultColorStr)
			}
		}
	}
		


	// background-color
	if(optionInfo.changeColorFlag.value){
		var bgColorStr = docElemStyleObj.getPropertyValue("background-color")
		var bgColorMatchObj = bgColorStr.match(/^rgba?\((.*)\)$/i)
		if(!bgColorMatchObj){
			docElem.style.setProperty("background-color",defaultBgColorStr)
		}
		else{
			// 轉數字
			var rgbNums = bgColorMatchObj[1].split(",")
			for(let i in rgbNums){rgbNums[i] = Number(rgbNums[i])}
			if(rgbNums.length === 3){rgbNums.push(1)}
			var opacityVal = rgbNums[3]
			for(let i of [0,1,2]){
				rgbNums[i] = rgbNums[i]*opacityVal+255*(1-opacityVal)
			}
			rgbNums.pop()
			var newRgbNums = rgbNumsBrightnessTrans["darker"](rgbNums)
			if(!checkObjEqual(newRgbNums,rgbNums)){
				defaultBgColorStr = "rgb("+newRgbNums.join(",")+")"
				docElem.style.setProperty("background-color",defaultBgColorStr)
			}
		}
	}
}