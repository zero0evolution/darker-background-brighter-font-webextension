// const notTextContentPattern = /^[\n\t\s\r]*?$/
var tagNameToHasText = {
	input:true,
	textarea:true,
	select:true,
}
var checkElemHasTextNode = function(elem){
	//需要輸入文字的elem算是有text
	var tagName = elem.tagName.toLowerCase()
	if(tagNameToHasText.hasOwnProperty(tagName)){
		return(tagNameToHasText[tagName])
	}
	//找childNode為文字節點
	for(let childNode of elem.childNodes){
		if(childNode.nodeType === 3){
			return(true)
		}
	}
	return(false)
}