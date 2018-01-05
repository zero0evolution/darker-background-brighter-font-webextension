// 背景圖片亮度變暗功能
var bgImgUrlBrightnessTrans = function(getStyleObj,setStyleObj,bgImgStr,brightness){
	
	var blackBgOpacity = 1-brightness
	var bgRgbaStr = "rgba(0, 0, 0, "+String(blackBgOpacity)+")"
	var addBgStr = "linear-gradient("+bgRgbaStr+", "+bgRgbaStr+")"

	if(bgImgStr.indexOf(addBgStr)<0){
		bgImgStr = addBgStr+", "+bgImgStr

		for(let eachProperty in newBackgroundPropertyToValue){
			var eachPropertyVal = getStyleObj.getPropertyValue(eachProperty)
			// 載入初始值
			if(!eachPropertyVal){
				eachPropertyVal = "initial"
			}

			var newEachPropertyVal = newBackgroundPropertyToValue[eachProperty]+","+eachPropertyVal
			setStyleObj.setProperty(eachProperty,newEachPropertyVal)
			// console.log(eachProperty,newEachPropertyVal)
		}
	}
	return(bgImgStr)
}

var backgroundPropertys = ["background-image","background-position","background-size","background-repeat","background-attachment","background-origin","background-clip","background-color"]

var getAllBackgroundPropertyStr = function(getStyleObj){
	var propertyVals = []
	for(let eachProperty of backgroundPropertys){
		eachPropertyVal = getStyleObj.getPropertyValue(eachProperty)
		if(eachPropertyVal){propertyVals.push(eachPropertyVal)}
	}
	return(propertyVals.join(" "))
}

var initBackgroundPropertyToValue = {
	"background-repeat":"no-repeat",
	"background-attachment":"scroll",
	"background-position": "0% 0%",
	"background-size": "auto auto",
	"background-origin": "padding-box",
	"background-clip": "border-box",
}

var newBackgroundPropertyToValue = {
	"background-repeat":"no-repeat",
	"background-attachment":"fixed",
	"background-position": "0% 0%",
	"background-size": "100% 100%",
	"background-origin": "padding-box",
	"background-clip": "padding-box",
}


/*var bgImgUrlBrightnessTrans = function(
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


/*var imgUrlToData = function(imgUrl){
	return(new Promise(
		function(resolve,reject){
			var tailMatchObj = imgUrl.match(/[^\/]+?$/)
			if(tailMatchObj){
				var fileNameMatchObj = tailMatchObj[0].match(/.*?(?=\?|$)/)
				if(fileNameMatchObj){
					var subFileNameMatchObj = fileNameMatchObj[0].match(/\.(\w{1,5})$/)
					if(subFileNameMatchObj){
						var imgType = subFileNameMatchObj[1]

						var requestObj = new XMLHttpRequest();
						requestObj.open("GET", imgUrl, true)
						requestObj.responseType = "arraybuffer"

						requestObj.onreadystatechange = function() {
							if(this.readyState===this.DONE && this.status===200) {
								var byteArray = new Uint8Array(this.response)
								var binaryStrArray = new Array(byteArray.length)
								for(let i in byteArray){
									binaryStrArray[i] = String.fromCharCode(byteArray[i])
								}
								var data = binaryStrArray.join('')
								var base64 = btoa(data)

								resolve("data:image/"+imgType+";base64,"+base64)
							}
							else{
								reject(Error('Image did not load in; error code:' + this.statusText))
							}
						}
						requestObj.onerror = function(){
							reject(Error('network error. url:'+this.responseURL))
						}

						requestObj.send()
					}
					else{reject(Error("no image sub file name"))}
				}
				else{reject(Error("no image sub file name"))}
			}
			else{reject(Error("no image sub file name"))}
		}
	))	
}*/



// 若圖片位址非此網域無效 
/*var fixImgBrightness = function(imageSrc,targetBrightness) {
	
	var imgElem = document.createElement("img")
	imgElem.src = imageSrc
	imgElem.style.display = "none"
	document.body.appendChild(imgElem)

	// 得到圖片的最亮最暗值
	imgElem.onload = function(event) {
		var imgElem = event.target
		// create canvas
		var canvas = document.createElement("canvas")
		canvas.width = imgElem.clientWidth
		canvas.height = imgElem.clientHeight

		var ctx = canvas.getContext("2d")
		ctx.drawImage(imgElem,0,0)

		var imageData = ctx.getImageData(0,0,canvas.width,canvas.height)
		
		// var allPixelBrightnessSum = 0
		var maxBrightness = 0
		// var minBrightness = 255

		var i=0
		while(i<imageData.data.length){
			var rgb = imageData.data.slice(i,i+3)
			var pixelBrightness = (Math.max(...rgb)+Math.min(...rgb))/2
			// allPixelBrightnessSum += pixelBrightness
			maxBrightness = Math.max(maxBrightness,pixelBrightness)
			// minBrightness = Math.min(minBrightness,pixelBrightness)
			i+=4
		}

		// var avgBrightness = Math.round(
			// allPixelBrightnessSum / (canvas.width*canvas.height))
	
		
		if(maxBrightness<targetBrightness){
			
		}
		else if(maxBrightness>targetBrightness){
			
		}
	}
}*/
