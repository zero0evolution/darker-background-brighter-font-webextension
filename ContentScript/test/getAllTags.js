var getAllTags = function(){
	var tags = {}
	for (elem of document.documentElement.querySelectorAll("*")){
		tags[elem.tagName.toLowerCase()] = true
	}
	return(Object.keys(tags))
}