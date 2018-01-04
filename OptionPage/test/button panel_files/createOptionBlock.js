
var createOptionBlock = function(domain,optionKey,eachOptionInfo,hasNullButtonFlag){
	var optionBlockElem = document.createElement("div")
	optionBlockElem.classList.add("optionBlock")

	var tooltipElem = createTooltip(
		browser.i18n.getMessage(optionKey),
		browser.i18n.getMessage(optionKey+"_description")
	)
	optionBlockElem.appendChild(tooltipElem)

	var selectBlockElem = createSelectBlock(
		domain,optionKey,eachOptionInfo,hasNullButtonFlag)
	optionBlockElem.appendChild(selectBlockElem)
	

	return(optionBlockElem)
}

var createTooltip = function(optionName,optionDescription){
	var tooltipElem = document.createElement("div")
	tooltipElem.classList.add("tooltip")

	var optionNameElem = document.createElement("span")
	optionNameElem.classList.add("optionName")
	optionNameElem.innerText = optionName
	tooltipElem.appendChild(optionNameElem)

	var tooltipTextElem = document.createElement("div")
	tooltipTextElem.classList.add("tooltipText")
	tooltipTextElem.innerText = optionDescription
	tooltipElem.appendChild(tooltipTextElem)

	return(tooltipElem)
}

var createSelectBlock = function(domain,optionKey,eachOptionInfo,hasNullButtonFlag){
	var selectBlockElem = document.createElement("div")
	selectBlockElem.classList.add("selectBlock")
	var allValues = []
	if(eachOptionInfo.type === "boolean"){
		allValues = [true,false]
	}
	else if(eachOptionInfo.type === "number"){
		var sliderContainerElem = createSlider(eachOptionInfo)
		selectBlockElem.appendChild(sliderContainerElem)
		allValues = [false]
	}
	else{
		console.error("createSelectBlock:unknown eachOptionInfo.type:",eachOptionInfo.type)
	}
		
	if(hasNullButtonFlag){allValues.push(null)}

	for(let eachValue of allValues){
		var optionElem = document.createElement("button")
		optionElem.classList.add("option")
		if(eachOptionInfo.value === eachValue){
			optionElem.classList.add("active")
		}
		optionElem.dataset.value = eachValue
		optionElem.innerText = browser.i18n.getMessage(String(eachValue))
		selectBlockElem.appendChild(optionElem)
	}

	for(let optionElem of selectBlockElem.querySelectorAll(".option")){
		optionElem.dataset.optionKey = optionKey
		optionElem.dataset.domain = domain
		optionElem.onclick = async function(event){
			var optionElem = event.target

			for(let otherOptionElem of optionElem.parentElement.querySelectorAll(".option")){
				otherOptionElem.classList.remove("active")
			}
			optionElem.classList.add("active")

			// save option
			var	saveOptionObj = {}
			for(let activeOption of document.querySelectorAll(".option.active")){
				var value = JSON.parse(activeOption.dataset.value)
				var domain = activeOption.dataset.domain
				var optionKey = activeOption.dataset.optionKey
				if(!saveOptionObj.hasOwnProperty(domain)){
					saveOptionObj[domain] = {}
				}
				saveOptionObj[domain][optionKey] = value
			}
			console.log(
				"browser.storage.local.set optionObj:",saveOptionObj)
			await saveOptions(saveOptionObj)
		}
	}

	return(selectBlockElem)
}