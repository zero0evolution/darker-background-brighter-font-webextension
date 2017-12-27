var propertyInfo = {}
var propertys = [
	"background-color","background-image","color",
	"border-left-color","border-top-color",
	"border-right-color","border-bottom-color",
	"box-shadow",
]

var loadPropertyInfo = function(){
	var backgroundMethod = "darker"
	var fontMethod = "brighter"

	// color
	propertyInfo["color"] = {
		enableFlag:optionInfo.changeColorFlag.value,
		transMethod:fontMethod,
		transFunc:function(obj,getStyleObj,setStyleObj,propertyVal,property){

			var newPropertyVal = fullColorStrBrightnessTransFunc(
				propertyVal,propertyInfo[property].transMethod)

			return(newPropertyVal)
		}
	}
	propertyInfo["border-left-color"] = propertyInfo["color"]
	propertyInfo["border-top-color"] = propertyInfo["color"]
	propertyInfo["border-right-color"] = propertyInfo["color"]
	propertyInfo["border-bottom-color"] = propertyInfo["color"]
	propertyInfo["box-shadow"] = propertyInfo["color"]

	// background-color
	propertyInfo["background-color"] = {
		enableFlag:optionInfo.changeColorFlag.value,
		transMethod:backgroundMethod,
		transFunc:function(obj,getStyleObj,setStyleObj,propertyVal,property){

			var newPropertyVal = fullColorStrBrightnessTransFunc(
				propertyVal,propertyInfo[property].transMethod)

			return(newPropertyVal)
		}
	}

	// background-image
	propertyInfo["background-image"] = {
		enableFlag:optionInfo.changeColorFlag.value,
		transMethod:backgroundMethod,
		transFunc:function(obj,getStyleObj,setStyleObj,propertyVal,property){

			var transMethod = propertyInfo[property].transMethod
			// 更改純顏色部份
			var newPropertyVal = fullColorStrBrightnessTransFunc(
				propertyVal,transMethod)

			var changeFlag = Boolean(newPropertyVal)
			if(changeFlag){propertyVal = newPropertyVal}

			var hasBgImgFlag = false
			// 若背景圖亮度需要調整 送到 bgImgUrlBrightnessTrans
			if(typeof(optionInfo.bgImgBrightness.value) === "number"){
				if(propertyVal.match(/url\(.+?\)/i)){
					hasBgImgFlag = true
					changeFlag = true
					newPropertyVal = bgImgUrlBrightnessTrans(
						propertyVal,optionInfo.bgImgBrightness.value)
				}
			}
			if(hasBgImgFlag){
				// 加上邊框
				addWhiteBorder(getStyleObj,setStyleObj)
			}

			if(!changeFlag){return(null)}
			// console.log(selectorText,property,":")
			// console.log(propertyVal)
			// console.log("====",transMethod,"==>")
			// console.log(newPropertyVal,"\n")
			return(newPropertyVal)
		}
	}
}