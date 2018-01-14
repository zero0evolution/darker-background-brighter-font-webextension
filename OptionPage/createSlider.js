var createSlider = function(eachOptionInfo){

	if(typeof(eachOptionInfo.value) === "number"){
		var value = eachOptionInfo.value
	}
	else{
		var value = eachOptionInfo.defaultNumValue
	}

	var sliderContainerElem = document.createElement("span")
	sliderContainerElem.classList.add("sliderContainer")
	sliderContainerElem.classList.add("option")
	sliderContainerElem.dataset.value = value
	if(typeof(eachOptionInfo.value) === "number"){
		sliderContainerElem.classList.add("active")
	}

	
	var sliderElem = document.createElement("input")
	sliderElem.type = "range"
	sliderElem.min = eachOptionInfo.minValue
	sliderElem.max = eachOptionInfo.maxValue
	sliderElem.step = eachOptionInfo.step
	sliderElem.value = value
	sliderElem.classList.add("slider")
	sliderElem.oninput = function(event){
		event.target.nextElementSibling.innerText = event.target.value
		event.target.parentElement.dataset.value = event.target.value
		event.stopPropagation()
		event.target.parentElement.click()
	}
	sliderElem.onclick = function(event){
		event.stopPropagation()
		event.target.parentElement.click()
	}
	sliderContainerElem.appendChild(sliderElem)
	
	
	
	var showValueElem = document.createElement("span")
	showValueElem.innerText = value
	showValueElem.style.setProperty("pointer-events","none")
	showValueElem.style.setProperty("background-color","transparent")
	sliderContainerElem.appendChild(showValueElem)
	
	return(sliderContainerElem)
}