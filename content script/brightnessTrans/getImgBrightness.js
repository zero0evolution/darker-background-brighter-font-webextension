
// 若圖片位址非此網域無效 
/*var fixImgBrightness = function(imgElem,targetBrightness) {
	// targetBrightness 為0~255的值

	// var img = document.createElement("img")
	// img.src = imageSrc
	// img.style.display = "none"
	// document.body.appendChild(img)

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
