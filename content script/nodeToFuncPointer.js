
var nodeToFuncPointer = function(node){
	switch(node.nodeType){
		case 1:
			if(node.dataset.hasOwnProperty("reStyleCount")){
				var count = Number(node.dataset.reStyleCount)+1
			}
			else{
				var count = 1
			}
			node.dataset.reStyleCount = String(count)

			let elemTagName = node.tagName.toLowerCase()
			
			try{
				// 載入tagName 對應的功能
				tagNameToFunc[elemTagName](node)
			}
			catch(error){
				if(error.name === "TypeError" || error.name === "KeyError"){
					// 若是沒見過的tagName 寫入對應功能
					tagNameToFunc[elemTagName] = function(node){
						oldStyleTransFunc(node)
						addToTask(node)
					}
					tagNameToFunc[elemTagName](node)
				}
				else{
					console.error(error)
				}
			}
	}
}


var nodeRecursion = function(node,func){
	func(node)
	
	for(let childNode of node.childNodes){
		nodeRecursion(childNode,func)
	}
}


var noFunc = function(elem){}

var imgElemFunc = function(elem){
	// 將圖片加上白框(全黑的圖片才看得到)
	if(optionInfo.changeColorFlag.value){
		addWhiteBorder(getComputedStyle(elem),elem.style)
	}
		
	// 若需要改亮度、超過指定的大小 就更改亮度
	if(typeof(optionInfo.imgBrightness.value) === "number"){
		imgElemBrightnessTrans(elem,optionInfo.imgBrightness.value)
	}

}

var styleElemFunc = function(elem){
	if(elem.id === customCssElemId){return(null)}
	if(elem.sheet instanceof StyleSheet){
		var success = styleSheetBrightnessTransFunc(elem.sheet)
	}
}
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
	"head":noFunc,
	// 
	"iframe":iframeElemFunc,
	"optgroup":function(node){
		oldStyleTransFunc(node)
		addToTask(node)

		setTimeout(
			function(node){
				addToTask(node)
			},1000,node
		)
	}
}
/////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////
var getAllTags = function(){
	var tags = {}
	for (elem of document.documentElement.querySelectorAll("*")){
		tags[elem.tagName.toLowerCase()] = true
	}
	return(Object.keys(tags))
}


var logReStyleCount = function(){
	var countObj = {}
	for(let elem of document.querySelectorAll("*")){

		var reStyleCount = Number(elem.dataset.reStyleCount)
		if(!countObj.hasOwnProperty(reStyleCount)){
			countObj[reStyleCount] = 1
		}
		else{
			countObj[reStyleCount]+=1
		}
	}
	console.log(countObj)
}




var logStyleSheetProperty = function(property){
	var tempCssRuleRecursion = function(cssRule){
		if(cssRule.style instanceof CSSStyleDeclaration){
			propertyValue = cssRule.style.getPropertyValue(property)
			if(propertyValue){
				console.log(cssRule.selectorText,":",propertyValue)
			}
		}
		if(cssRule.cssRules instanceof CSSRuleList){
			for(let subCssRule of cssRule.cssRules){
				tempCssRuleRecursion(subCssRule)
			}
		}
	}
	for(let sheet of document.styleSheets){
		for(let cssRule of sheet.cssRules){
			tempCssRuleRecursion(cssRule)
		}
	}
}