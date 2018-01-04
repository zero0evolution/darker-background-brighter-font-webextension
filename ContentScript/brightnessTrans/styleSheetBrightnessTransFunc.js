

var styleSheetBrightnessTransFunc = function(sheet){

	try{
		if(sheet.href){
			console.log("找到style sheet:",sheet.href)
		}
		if(sheet.cssRules instanceof CSSRuleList){
			for(let cssRule of sheet.cssRules){
				cssRuleRecursion(cssRule)
			}
			return(true)
		}
		else{
			console.warn("styleSheetBrightnessTransFunc:sheet.cssRules is not CSSRuleList:",sheet)
		}
	}
	catch(error){
		//若是SecurityError 表示是載入網域外的css檔 禁止讀取內容
		//InvalidAccessError: "A parameter or an operation is not supported by the underlying object" code: 15 nsresult: 0x8053000f
		if(error.name === "SecurityError" || error.name === "InvalidAccessError"){
			// console.log("無法讀取Css連結:\n"+sheet.href)
			if((!sheet.disabled) && sheet.href){
				try{
					requestStyleSheetLink(sheet)
				}
				catch(error){
					console.warn(error)
				}
			}
		}
		//其他問題
		else{
			console.error(error)
		}
	}
	return(false)
}

var cssRuleRecursion = function(cssRule){
	if(cssRule.style instanceof CSSStyleDeclaration){
		reStyleFunc(cssRule)
	}

	if(cssRule.cssRules instanceof CSSRuleList){
		for(let subCssRule of cssRule.cssRules){
			cssRuleRecursion(subCssRule)
		}
	}
}

var requestStyleSheetLink = function(sheet){
	//宣告要求
	var requestObj = new XMLHttpRequest()
	console.log("請求跨領域CSS檔案:",sheet.href)
	
	requestObj.onreadystatechange = function() {
		if(this.readyState===this.DONE && this.status===200) {
			//頁面載入成功後
			var newNode = document.createElement("style")
			newNode.rel = "stylesheet"
			newNode.type="text/css"
			var cssText = this.responseText.replace(/\n/mg," ")

			// 修改路徑(相對路徑會遵照 sheet href,需改成絕對路徑)
			// ex:https://cdn.sstatic.net/Sites/stackoverflow/img/sprites.svg?v=1b3cdae197be
			var newCssText = cssText.replace(
				/url\((.*?)\)/img,
				function(matchStr,p1){
					p1 = p1.replace(/((^\s+)|(\s+$))/img,"")

					var innerUrlMatchObj = p1.match(/^(\"|\')([^\"^\']*?)(\"|\')$/)
					if(innerUrlMatchObj){
						p1 = innerUrlMatchObj[1]+
							getAbsUrl(innerUrlMatchObj[2],sheet.href)+
							innerUrlMatchObj[3]
					}
					else{
						p1 = getAbsUrl(p1,sheet.href)
					}
					return("url("+p1+")")
				}
			)

			newNode.innerText = newCssText
			newNode.className = sheet.ownerNode.className
			newNode.id = sheet.ownerNode.id
			document.head.appendChild(newNode)

			// newNode.sheet.disabled = sheet.disabled
			
			sheet.disabled = true
			// styleSheetBrightnessTransFunc(newNode.sheet)
		}
	}

	requestObj.open("GET",sheet.href,true)
	requestObj.send()
}



///////////////////////////////////////////////////////////////////////
var getAbsUrl = function(url,referenceUrl){
	// 絕對路徑
	if(url.match(/^[a-z]+\:/i)) {
		return(url)
	}
	if(url.match(/^\/\//i)) {
		var prevMatchObj = referenceUrl.match(/^(.*)\/\//)
		if(prevMatchObj){
			var absUrl = prevMatchObj[1]+url
			// console.log(url,"轉換成絕對路徑",absUrl)
			return(absUrl)
		}
	}
	if(url.match(/^\//i)) {
		var prevMatchObj = referenceUrl.match(/^(.*?\/\/.*?)\//)
		if(prevMatchObj){
			var absUrl = prevMatchObj[1]+url
			// console.log(url,"轉換成絕對路徑",absUrl)
			return(absUrl)
		}
	}
	var absUrl = referenceUrl.match(/^(.*\/)/)[1]+url
	// console.log(url,"轉換成絕對路徑",absUrl)
	return(absUrl)
}