var getFavIcon = function(){
	var favicon = undefined;
	var linkElemList = document.querySelectorAll("link")
	for (let linkElem of linkElemList){
		if((linkElem.getAttribute("rel") == "icon")||(linkElem.getAttribute("rel") == "shortcut icon")){
			favicon = linkElem.getAttribute("href")

		}
	}
	return(favicon)
}