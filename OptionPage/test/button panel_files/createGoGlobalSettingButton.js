var createGoGlobalSettingButton = function(){
	var goGlobalSettingButton = document.createElement("button")
	goGlobalSettingButton.id = "goGlobalSettingButton"
	goGlobalSettingButton.innerText = browser.i18n.getMessage("goGlobalSettingText")
	goGlobalSettingButton.onclick = function(){
		browser.runtime.openOptionsPage()
		window.close()
	}
	
	return(goGlobalSettingButton)
}