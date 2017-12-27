
var colorStrBrightnessTrans = {
	rgba:function(rgbaStr,transMethod){
		// rgbaStr:"r","g","b"(?:,"a")?

		// 看先前紀錄
		if(colorTransRecordObj[transMethod].hasOwnProperty(rgbaStr)){
			return(colorTransRecordObj[transMethod][rgbaStr])
		}

		var funcName = "colorStrBrightnessTrans.rgba"
		var rgbNums = rgbaStr.split(",")

		// 轉數字
		for(let i of [0,1,2]){
			rgbNums[i] = Number(rgbNums[i])

		}

		if(rgbNums.length === 3){rgbNums.push(1)}

		var newRgbaStr = null
		if(rgbNums.length === 4){
			//轉換
			let newRgbNums = rgbNumsBrightnessTrans[transMethod](rgbNums)
			if(!checkObjEqual(rgbNums,newRgbNums)){
				newRgbaStr = newRgbNums.join(", ")
			}
		}

		// 顯示
		// console.log(funcName,":\n",rgbaStr,"====",transMethod,"==>",newRgbaStr)

		// 儲存
		colorTransRecordObj[transMethod][rgbaStr] = newRgbaStr
		
		// 輸出
		return(colorTransRecordObj[transMethod][rgbaStr])
	},
	hex:function(hexStr,transMethod){
		// 載入紀錄
		if(colorTransRecordObj[transMethod].hasOwnProperty(hexStr)){
			return(colorTransRecordObj[transMethod][hexStr])
		}
		
		// 轉換成rgbaNums
		var rgbNums = [0,0,0]
		
		let eachHexLen = hexStr.length/3
		let multiply = (eachHexLen === 2)?1:17
		for(let i of [0,1,2]){
			let eachHexStr = hexStr.substr(i*eachHexLen,eachHexLen)
			rgbNums[i] = parseInt(eachHexStr,16)*multiply
		}

		//亮度轉換
		let newRgbNums = rgbNumsBrightnessTrans[transMethod](rgbNums)

		// 轉成Hex
		var newHexStr = null
		if(!checkObjEqual(rgbNums,newRgbNums)){
			newHexStr = ""
			for(let i of [0,1,2]){
				newHexStr += newRgbNums[i].toString(16)
			}
		}
		var funcName = "colorStrBrightnessTrans.hex"
		// 顯示
		// console.log(funcName,":\n",hexStr,"====",transMethod,"==>",newHexStr)

		// 紀錄
		colorTransRecordObj[transMethod][hexStr] = newHexStr
		
		// 輸出
		return(newHexStr)
	},
	hsla:function(hslaStr,transMethod){
		// 載入紀錄
		if(colorTransRecordObj[transMethod].hasOwnProperty(hslaStr)){
			return(colorTransRecordObj[transMethod][hslaStr])
		}

		//亮度轉換 (亮度範圍:0~100)
		const brightnessNumTrans = {
			brightest:function(brightnessNum){return(100)},
			darkest:function(brightnessNum){return(0)},
			brighter:function(brightnessNum){
				return((brightnessNum<50)?(100-brightnessNum):brightnessNum)
			},
			darker:function(brightnessNum){
				return((brightnessNum>50)?(100-brightnessNum):brightnessNum)
			},
		}

		var changeFlag = false
		// 找最後一個%值(亮度值)
		var newHslaStr = hslaStr.replace(
			/\d+(?=\%[^\%]*?$)/,function(brightnessStr){
				// 轉數字
				var brightness = Number(brightnessStr)

				// 修正範圍
				brightness = Math.max(0,brightness)
				brightness = Math.min(100,brightness)
				// 轉換亮度
				var newBrightness = brightnessNumTrans[transMethod](brightness)
				// 確認有無改變
				changeFlag = (brightness !== newBrightness)
				return(String(newBrightness))
			}
		)
		if(!changeFlag){
			newHslaStr = null
		}

		var funcName = "colorStrBrightnessTrans.hsla"

		colorTransRecordObj[transMethod][hslaStr] = newHslaStr
		// console.log(funcName,":\n",hslaStr,"====",transMethod,"==>",newHslaStr)
		return(newHslaStr)
	},
	colorName:function(colorStr,transMethod){
		// 載入紀錄
		if(colorTransRecordObj[transMethod].hasOwnProperty(colorStr)){
			return(colorTransRecordObj[transMethod][colorStr])
		}

		//若有儲存於colorName中 載入儲存中的紀錄並轉換
		var colorNameStrLowerCase = colorStr.toLowerCase()
		var funcName = "colorStrBrightnessTrans.colorName"
		// 載入顏色
		if(!colorNameToRgb.hasOwnProperty(colorNameStrLowerCase)){
			colorTransRecordObj[transMethod][colorStr] = null
			console.log(funcName,"colorStr沒有對應的顏色格式:",colorStr)
			return(null)
		}
		var rgbNums = colorNameToRgb[colorNameStrLowerCase]
		// 轉換亮度
		var newRgbNums = rgbNumsBrightnessTrans[transMethod](rgbNums)
		var newColorStr = null
		if(!checkObjEqual(rgbNums,newRgbNums)){
			newColorStr = "rgb("+newRgbNums.join(", ")+")"
		}
		colorTransRecordObj[transMethod][colorStr] = newColorStr
		
		// console.log(funcName,":\n",colorStr,"====",transMethod,"==>",newColorStr)
		return(newColorStr)
	}
}