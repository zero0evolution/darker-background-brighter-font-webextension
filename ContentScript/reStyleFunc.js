
//更改obj style
var reStyleFunc = function(obj){
	// getStyleObj,setStyleObj,selectorText
	
	if(obj instanceof CSSRule){
		var selectorText = obj.selectorText
		var getStyleObj = obj.style
		var setStyleObj = obj.style
	}
	else if(obj instanceof Element){
		var selectorText = getSelectorText(obj)
		var getStyleObj = getComputedStyle(obj)
		// var getStyleObj = getComputedStyle(obj)
		var setStyleObj = obj.style
		
	}
	else{
		console.log("reStyleFunc 未知格式的 obj:",obj)
		return(null)
	}
	

	// 改變顏色功能
	if(optionInfo.changeColorFlag.value){
		for(let eachProperty of propertys){

			var propertyVal = getStyleObj.getPropertyValue(eachProperty)
			var transMethod = propertyInfo[eachProperty].transMethod
			// 先找有沒有一樣的轉換紀錄 若有就直接載入紀錄
			if(colorTransRecordObj[transMethod].hasOwnProperty(propertyVal)){
				
				var newPropertyVal = colorTransRecordObj[transMethod][propertyVal]
				if(newPropertyVal){
					setStyleObj.setProperty(eachProperty,newPropertyVal/*,"important"*/)
				}
				//紀錄為null就不需修改
			}
			else{
				//沒有紀錄就計算格式
				var newPropertyVal = propertyInfo[eachProperty].transFunc(
					obj,getStyleObj,setStyleObj,eachProperty,propertyVal)
				// newElemStyleStr為null的情況:
				// 1.未預期的格式
				// 2.格式錯誤
				// 3.不需要更改

				// 記錄objStyleStr對應newElemStyleStr
				colorTransRecordObj[transMethod][propertyVal] = newPropertyVal

				if(newPropertyVal){
					// 設定style
					setStyleObj.setProperty(eachProperty,newPropertyVal/*,"important"*/)
					// 記錄newElemStyleStr對應null
					colorTransRecordObj[transMethod][newPropertyVal] = null
				}
				// log
				// 	console.log(selectorText,eachProperty,":")
				// 	console.log(propertyVal)
				// 	console.log("====",transMethod,"==>")
				// 	console.log(newPropertyVal,"\n")
			}
		}
	}
	

	// 改變文字大小
	if(typeof(optionInfo.minFontSize.value) === "number"){
		
		// if(obj instanceof Element){
		// 	if(!checkElemHasTextNode(obj)){return(null)}
		// }
		changeMinFontSize(obj,getStyleObj,setStyleObj,selectorText)
	}
}

