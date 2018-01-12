var createReloadButton = function(){
	var reloadBlock = document.createElement("div")
	reloadBlock.classList.add("optionBlock")

	var textElem = document.createElement("span")
	textElem.innerText = browser.i18n.getMessage("reloadText")
	reloadBlock.appendChild(textElem)

	var reloadButton = document.createElement("Button")
	reloadButton.onclick = function(event){
		browser.tabs.reload({bypassCache: true})
		window.close()
	}
	var reloadImgElem = document.createElement("img")
	reloadImgElem.style.height = "1em"
	reloadImgElem.style.width = "1em"
	reloadImgElem.src = browser.extension.getURL("../icons/reloadIcon.png")
	reloadButton.appendChild(reloadImgElem)
	reloadBlock.appendChild(reloadButton)

	return(reloadBlock)
}