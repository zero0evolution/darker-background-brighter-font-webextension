var logAllStyleSheetHref = function(){
	for(let sheet of document.styleSheets){
		console.log(sheet.href)
	}
}

var removeStyleSheet = function(){
	var i = document.styleSheets.length
	while(--i){
		var sheet = document.styleSheets[i]
		if(sheet.ownerNode instanceof Element){
			sheet.ownerNode.remove()
		}
		if(i<=0){break}
	}
}