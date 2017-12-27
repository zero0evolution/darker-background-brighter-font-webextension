//顏色對應表 避免重新運算
var colorTransRecordObj = {
	darker:{},
	brighter:{},
	darkest:{},
	brightest:{},
}

var passColorStrList = "|none|inherit|initial|transparent|repeat|scroll|center|bottom|top|left|right|medium|solid|normal|ease|running|default|auto".split("|")

// 把不用改的字串寫進null
var writePassColorStrFunc = function(){
	for (let passColorStr of passColorStrList){
		for(let transMethod in colorTransRecordObj){
			colorTransRecordObj[transMethod][passColorStr] = null
		}
	}
}
writePassColorStrFunc()



for(let transMethod in colorTransRecordObj){
	colorTransRecordObj[transMethod][null] = null
}


colorTransRecordObj["darker"]["initial"] = "black"
colorTransRecordObj["darkest"]["initial"] = "black"

colorTransRecordObj["brighter"]["initial"] = "white"
colorTransRecordObj["brightest"]["initial"] = "white"