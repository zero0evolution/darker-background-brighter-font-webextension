// 背景圖片亮度變暗功能
var bgImgUrlBrightnessTrans = function(bgImgStr,brightness){
	
	var blackBgOpacity = 1-brightness
	var bgRgbaStr = "rgba(0, 0, 0, "+String(blackBgOpacity)+")"
	var addBgStr = "linear-gradient("+bgRgbaStr+", "+bgRgbaStr+")"

	if(bgImgStr.indexOf(addBgStr)<0){
		bgImgStr = addBgStr+", "+bgImgStr
	}
	return(bgImgStr)
}

/*async function bgImgUrlBrightnessTrans(
	setStyleObj,propertyVal,targetBrightness){

	var newPropertyVal = propertyVal.replace(
		/url\(([^\(^\)]+?)\)/img,async function(matchStr,p1){
			var matchUrlObj = p1.match(/(\"|\')(.*?)(\"|\')/)
			if(matchUrlObj){
				var imgUrl = matchUrlObj[1]
				var prefix = matchUrlObj[0]
				var suffix = matchUrlObj[2]
			}
			else{
				var imgUrl = p1
				var prefix = ""
				var suffix = ""
			}

			var imgData = await imgToData(imgUrl)
			return(prefix+imgData+suffix)
		}
	)
}*/