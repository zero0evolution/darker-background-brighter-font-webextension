
var creatStyleSheetMutationObserver = function(doc){
	console.log("建立styleSheetMutationObserver")
	//建立新的觀察物件
	var styleSheetMutationObserver = new MutationObserver(
		function (mutationObjs){
			console.log("偵測到改變:")
			for(let eachMutationObj of mutationObjs){
				//attributes,characterData,childList
				console.log("type:",eachMutationObj.type)
				//改變的節點
				console.log("target:",eachMutationObj.target)
				//回傳改變屬性的local name,若沒有屬性改變回傳null
				console.log("attributeName:",eachMutationObj.attributeName)
				//回傳改變屬性的namespace,若沒有屬性改變回傳null
				console.log("attributeNamespace:",eachMutationObj.attributeNamespace)

			}
		}
	)

	styleSheetMutationObserver.observe(
		doc,{
			attributes:true,
			attributeFilter:["style"],
		}
	)
}