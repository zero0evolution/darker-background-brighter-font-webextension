var getSelectorText = function(elem){
	let cssSelectors = []
	cssSelectors.push(elem.tagName)

	if(elem.id){
		cssSelectors.push("#"+elem.id)
	}
	for(let className of elem.classList){
		cssSelectors.push("."+className)
	}
	return(cssSelectors.join(""))
}

var getXpath = function(elem){
	let cssSelectors = []

	while(true){
		let eachSelectorText = getSelectorText(elem)
		cssSelectors.unshift(eachSelectorText)
		if(eachSelectorText.match(/^html/i)){
			return(cssSelectors.join(" > "))
		}
		elem = elem.parentElement
	}
}

var getStyleSheetNodeXpath = function(){
	for(let sheet of document.styleSheets){
		if(sheet.ownerNode instanceof Element){
			console.log(getXpath(sheet.ownerNode))
		}
		else{
			console.log("沒有node的sheet",sheet)
		}
	}
}