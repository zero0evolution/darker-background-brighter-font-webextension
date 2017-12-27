var optionInfo = {
	changeColorFlag:{
		type:"boolean",
		value:true,
	},
	imgBrightness:{
		type:"number",
		maxValue:1,
		minValue:0,
		value:0.7,
	},
	bgImgBrightness:{
		type:"number",
		maxValue:1,
		minValue:0,
		value:0.5,
	},
	minFontSize:{
		type:"number",
		maxValue:48,
		minValue:12,
		value:28,
	},
	runTaskQuantityAt1Time:{
		type:"number",
		maxValue:100,
		minValue:1,
		value:10,
	},
}

var optionReadyFlag = false
var loadOptions = function(){
	var options = {}
	// load init val
	for(let key in optionInfo){
		options[key] = optionInfo[key].value
	}

	var domains = ["",document.domain]

	var subLoadOptions = function(){
		// load
		var domain = domains.shift()
		browser.storage.local.get(domain).then(
			function(returnObj){
				if(returnObj.hasOwnProperty(domain)){
					var storageOptions = returnObj[domain]
					for(let key in options){
						if(!storageOptions.hasOwnProperty(key)){
							continue
						}
						if(storageOptions[key] === null){
							continue
						}
						options[key] = storageOptions[key]
					}
				}
					
				if(domains.length>0){
					subLoadOptions()
				}
				else{
					
					for(let key in optionInfo){
						optionInfo[key].value = options[key]
					}
					optionReadyFlag = true
				}
			},
			function(error){
				console.log("載入",domain,"options 失敗:",error);
			}
		)
	}
	subLoadOptions()
}
