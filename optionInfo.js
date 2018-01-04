'use strict';

var optionKeys = ["changeColorFlag","imgBrightness","bgImgBrightness","minFontSize","runTaskQuantityAt1Time",]

var optionInfo = {
	changeColorFlag:{
		types:["boolean"],
		value:true,
	},
	imgBrightness:{
		types:["number","boolean"],
		maxValue:1,
		minValue:0,
		step:0.05,
		value:0.7,
		defaultNumValue:1,
	},
	bgImgBrightness:{
		types:["number","boolean"],
		maxValue:1,
		minValue:0,
		step:0.05,
		value:0.5,
		defaultNumValue:1,
	},
	minFontSize:{
		types:["number","boolean"],
		maxValue:48,
		minValue:12,
		step:1,
		value:false,
		defaultNumValue:12,
	},
	runTaskQuantityAt1Time:{
		types:["number"],
		maxValue:100,
		minValue:1,
		step:1,
		value:1,
		defaultNumValue:1,
	},
}