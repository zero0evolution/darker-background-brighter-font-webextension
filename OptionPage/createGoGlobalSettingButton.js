var createGoGlobalSettingButton = function(){
	var goGlobalSettingButton = document.createElement("span")
	goGlobalSettingButton.id = "goGlobalSettingButton"
	goGlobalSettingButton.innerText = browser.i18n.getMessage("goGlobalSettingText")
	return(goGlobalSettingButton)
}