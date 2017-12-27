var fontSizePropertyInfos = {
	"font-size":{
		min:optionInfo.minFontSize.value,
		breakWhenNoValue:false,
		requireProperys:[],
	},
	"line-height":{
		min:optionInfo.minFontSize.value+12,
		breakWhenNoValue:false,
		requireProperys:[],
	},
	"min-height":{
		min:optionInfo.minFontSize.value+12,
		breakWhenNoValue:false,
		requireProperys:["font-size","line-height"],
	}
}
var fontSizePropertys = ["font-size","line-height","min-height"]

var changeMinFontSize = function(obj,getStyleObj,setStyleObj,selectorText){
	// obj有可能是element 或 cssRule
	var hasPropertyFlagObj = {}
	for(let property of fontSizePropertys){
		
		var propertyValueStr = getStyleObj.getPropertyValue(property)
		var propertyValueMatchObj = propertyValueStr.match(/^(\d+(?:\.\d+)?)([a-z]+?)$/i)
		if(propertyValueMatchObj){
			var propertyValueNum = Number(propertyValueMatchObj[1])
			var propertyValueUnit = propertyValueMatchObj[2]
			if(typeof(unitToPx[propertyValueUnit]) !== "function"){
				console.log("未知length 單位:",propertyValueUnit)
				// if(fontSizePropertyInfos[property].breakWhenNoValue){return(null)}
				// else{continue}
				continue
			}
			var propertyValuePxNum = unitToPx[propertyValueUnit](propertyValueNum)
		}
		else if(unitToPx.hasOwnProperty(propertyValueStr)){
			var propertyValuePxNum = unitToPx[propertyValueStr](12)
		}
		else{
			// if(fontSizePropertyInfos[property].breakWhenNoValue){return(null)}
			// else{continue}
			continue
		}

		hasPropertyFlagObj[property] = true

		var requireProperys = fontSizePropertyInfos[property].requireProperys
		if(requireProperys.length>0){
			var checkFlag = requireProperys.filter(
				(requirePropery)=>{
					return(
						hasPropertyFlagObj.hasOwnProperty(requirePropery) && hasPropertyFlagObj[requirePropery] === true)
				}
			).includes(true)
			if(!checkFlag){continue}
		}

		if(propertyValuePxNum<fontSizePropertyInfos[property].min){
			var newPropertyValuePxStr = String(fontSizePropertyInfos[property].min)+"px"
			setStyleObj.setProperty(
				property,newPropertyValuePxStr/*,"important"*/)
			// console.log(
			// 	selectorText,property,":",
			// 	propertyValueStr,"==>",newPropertyPxStr)
		}
	}
}

var unitToPx = {
	px:function(num){return(num)},
	pt:function(num){return(num*4/3)},
	mm:function(num){return(num*96/25.4)},
	cm:function(num){return(num*96/2.54)},
	pc:function(num){return(num*16)},
	in:function(num){return(num*96)},
	// em:function(num){
	// 	return(num*12)	//為此elem的大小比例，但懶得寫
	// },
	rem:function(num){
		return(num*defaultFontSizeNum)
	},
	vw:function(num){return(num*window.innerWidth/100)},
	vh:function(num){return(num*window.innerHeight/100)},
	vmin:function(num){
		return(num*Math.min(window.innerWidth,window.innerHeight)/100)
	},
	vmax:function(num){
		return(num*Math.max(window.innerWidth,window.innerHeight)/100)
	},
	"xx-small":function(num){return(num-6)},
	"x-small":function(num){return(num-4)},
	"small":function(num){return(num-2)},
	"medium":function(num){return(num)},
	"large":function(num){return(num+2)},
	"x-large":function(num){return(num*1.5)},
	"xx-large":function(num){return(num*2)},
	// larger:function(num){return(num*2)},
	// smaller:function(num){return(num*2)},
}