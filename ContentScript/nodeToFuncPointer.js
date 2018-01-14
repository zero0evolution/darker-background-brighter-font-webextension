
var nodeToFuncPointer = function(node){
	if(node.nodeType === 1){
		if(node.dataset instanceof DOMStringMap){
			// changeStyleTimes
			if(node.dataset.hasOwnProperty("changeStyleTimes")){
				var count = Number(node.dataset.changeStyleTimes)+1
			}
			else{
				var count = 1
			}
			node.dataset.changeStyleTimes = String(count)

			// nodeToFunc
			let elemTagName = node.tagName.toLowerCase()
			
			try{
				// 載入tagName 對應的功能
				if(tagNameToFunc.hasOwnProperty(elemTagName)){
					var childFlag = tagNameToFunc[elemTagName](node)
					return(childFlag)
				}
				else{
					// 若是沒見過的tagName 寫入對應功能
					tagNameToFunc[elemTagName] = function(elem){
						// oldStyleTransFunc(elem)
						addToTask(elem)
						return(true)
					}
					var childFlag = tagNameToFunc[elemTagName](node)
					return(childFlag)
				}
			}
			catch(error){
				console.error("Error:",error)
			}
		}
	}
}


var nodeRecursion = function(node,func){
	var childFlag = func(node)
	if(childFlag){
		for(let childNode of node.childNodes){
			nodeRecursion(childNode,func)
		}
	}
}


var noFunc = function(elem){}

var imgElemFunc = function(elem){
	setTimeout(
		function(elem){
			// 將圖片加上白框(全黑的圖片才看得到)
			if(optionInfo.changeColorFlag.value){
				addWhiteBorder(getComputedStyle(elem),elem.style)
			}
				
			// 若需要改亮度、超過指定的大小 就更改亮度
			if(typeof(optionInfo.imgBrightness.value) === "number"){
				imgElemBrightnessTrans(
					getComputedStyle(elem),elem.style,
					optionInfo.imgBrightness.value)
			}
		},0,elem
	)
}

var styleElemFunc = function(elem){
	if(elem.id === customCssElemId){return(null)}
	// console.log(elem,elem.sheet)
	// firefox 可以直接使用elem.sheet
	if(elem.sheet instanceof StyleSheet){
		var success = styleSheetBrightnessTransFunc(elem.sheet)
	}
	else{
		// chrome 要等完成才可使用elem.sheet 否則elem.sheet為null 而不是 StyleSheet Obj
		elem.onload = function(event){
			var elem = event.target
			if(elem.sheet instanceof StyleSheet){
				var success = styleSheetBrightnessTransFunc(elem.sheet)
			}
		}
	}
}

// iframeElemFunc 凍結
var iframeElemFunc = function(elem){
	addToTask(elem)

	// 安全因素 更改iframe有困難
	/*if(!(elem.contentDocument instanceof HTMLDocument)){
		
		console.log("請求iframe:",elem.src)
		var requestObj = new XMLHttpRequest()
		requestObj._elem = elem
		requestObj.onreadystatechange = function() {
			if(this.readyState===this.DONE && this.status===200) {
				//頁面載入成功後
				this._elem.src = ""
				
				var tempElem = document.createElement("div")
				tempElem.innerHTML = this.responseText
				var iframeDocElem = tempElem.firstChild
				reStyleDocElem(iframeDocElem)

				this._elem.srcdoc = iframeDocElem.innerHTML
				console.log(this._elem.contentDocument)
			}
		}
		requestObj.open("GET",elem.src,true)
		requestObj.send()
	}*/
	return(true)
}


var tagNameToFunc = {
	//style,css link節點
	"style":styleElemFunc,
	"link":styleElemFunc,
	// image 節點
	"img":imgElemFunc,
	"canvas":imgElemFunc,
	"svg":imgElemFunc,
	// 若是script meta title 不動作
	"script":noFunc,
	"meta":noFunc,
	"title":noFunc,
	"noscript":noFunc,
	"br":noFunc,
	"head":function(elem){return(true)},
	"math":function(elem){},
	// 
	/*"iframe":iframeElemFunc,*/
	/*"optgroup":function(node){
		oldStyleTransFunc(node)
		addToTask(node)

		setTimeout(
			function(node){
				addToTask(node)
			},1000,node
		)
	}*/
}