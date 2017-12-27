// rgbNumsBrightnessTrans[transMethod](rgbNums)
//rgbNums r,g,b,a 必須都是數字 (rgb = 0~255)(a = 0~1)
//transMethod 必須為 Brightest (最亮) Darkest (最暗) Brighter (較亮) Darker (較暗)
const rgbNumsBrightnessTrans = {
	brightest:function(rgbNums){
		let newRgbNums = rgbNums.slice()
		// 取得最大值
		let addNum =255-Math.max(newRgbNums[0],newRgbNums[1],newRgbNums[2])
		//加到最大的數值
		for(let k of [0,1,2]){
			newRgbNums[k] += addNum
		}
		return(newRgbNums)
	},
	darkest:function(rgbNums){
		let newRgbNums = rgbNums.slice()
		//取得最小值
		let subtraNum = Math.min(newRgbNums[0],newRgbNums[1],newRgbNums[2])
		//減到最小的數值 
		for(let k of [0,1,2]){
			newRgbNums[k] -= subtraNum
		}
		return(newRgbNums)
	},
	brighter:function(rgbNums){
		let newRgbNums = rgbNums.slice()
		//計算亮度
		let maxNum = Math.max(newRgbNums[0],newRgbNums[1],newRgbNums[2])
		let minNum = Math.min(newRgbNums[0],newRgbNums[1],newRgbNums[2])
		let brightnessDouble = maxNum+minNum
		//若是較暗 就反轉亮度
		if(brightnessDouble<255){
			let addBrightness = 255-brightnessDouble
			for(let k of [0,1,2]){
				newRgbNums[k] += addBrightness
			}
		}
		return(newRgbNums)
	},
	darker:function(rgbNums){
		let newRgbNums = rgbNums.slice()
		//計算亮度
		let maxNum = Math.max(newRgbNums[0],newRgbNums[1],newRgbNums[2])
		let minNum = Math.min(newRgbNums[0],newRgbNums[1],newRgbNums[2])
		let brightnessDouble = maxNum+minNum
		//若是較暗 就反轉亮度
		if(brightnessDouble>255){
			let subtraBrightness = brightnessDouble-255
			for(let k of [0,1,2]){
				newRgbNums[k] -= subtraBrightness
			}
		}
		return(newRgbNums)
	},
}