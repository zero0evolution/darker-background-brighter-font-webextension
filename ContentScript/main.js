
var reStyleDocElem = async function(docElem){

	var domain = urlToDomain(document.URL)
	console.log("domain:",domain)
	var domains = ["",domain]
	
	// 讀取option
	var optionObj = await loadOptions(domains)
	// console.log("browser.storage.local.get optionObj:",optionObj)
	for(let eachDomain of domains){
		if(!optionObj.hasOwnProperty(eachDomain)){continue}
		for(let key of optionKeys){
			if(!optionObj[eachDomain].hasOwnProperty(key)){continue}
			if(optionObj[eachDomain][key] === null){continue}
			optionInfo[key].value = optionObj[eachDomain][key]
			console.log("load option:",key,optionInfo[key].value)
		}
	}

		
	if(optionInfo.changeColorFlag.value || typeof(optionInfo.minFontSize.value) === "number"){
		setTopIfNoProperty(docElem)
		
		// custom css
		/*var headElem = docElem.querySelector("head")
		if(optionInfo.changeColorFlag.value){
			loadCustomCss("content script/customCss_color.css",headElem)
		}
		if(typeof(optionInfo.minFontSize.value) === "number"){
			loadCustomCss("content script/customCss_fontSize.css",headElem)
		}*/
		// 先建立NewNodeObserver
		creatNewNodeObserver(docElem)
		// 輸入所有的elem
		nodeRecursion(docElem,nodeToFuncPointer)
	}
}


var reStyleDoc = function(doc){
	if(doc.readyState !== "loading"){
		reStyleDocElem(doc.documentElement)
	}
	else{
		doc.addEventListener(
			"DOMContentLoaded",function(event){
				reStyleDocElem(event.target.documentElement)
			}
		)
	}
}
reStyleDoc(document)