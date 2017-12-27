/*var imgToData = function(imgUrl){
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
								var uInt8Array = new Uint8Array(this.response)
								var i = uInt8Array.length
								var binaryString = new Array(i)
								while (i--){
									binaryString[i] = String.fromCharCode(uInt8Array[i])
								}
								var data = binaryString.join('')

								var base64 = window.btoa(data)

								resolve("data:image/"+imgType+";base64,"+base64)
							}
							else{
								reject(Error('Image didn\'t load successfully; error code:' + this.statusText))
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

