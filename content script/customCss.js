var customCssElemId = "customCss"
var loadCustomCss = function(cssFilePathName,pasteElem){
	var customCssElem = document.createElement("link")
	customCssElem.rel = "stylesheet"
	customCssElem.type="text/css"
	customCssElem.href = browser.extension.getURL(cssFilePathName)
	customCssElem.id = customCssElemId
	pasteElem.appendChild(customCssElem)
	return(customCssElem)
}