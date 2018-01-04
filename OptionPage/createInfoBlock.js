var createInfoBlock = function(domain,canAccessDomainFlag){
	// create info block
	var infoBlock = document.createElement("div")
	infoBlock.classList.add("optionBlock")

	if(canAccessDomainFlag){
		infoBlock.innerText = browser.i18n.getMessage("showDomainText")+"\n"+domain
	}
	else{
		infoBlock.innerText = browser.i18n.getMessage("cantAccessText")+"\n"+domain
	}
	return(infoBlock)
}