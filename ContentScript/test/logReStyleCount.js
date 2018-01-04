var logReStyleCount = function(){
	var countObj = {}
	for(let elem of document.querySelectorAll("*")){

		var reStyleCount = Number(elem.dataset.reStyleCount)
		if(!countObj.hasOwnProperty(reStyleCount)){
			countObj[reStyleCount] = 1
		}
		else{
			countObj[reStyleCount]+=1
		}
	}
	console.log(countObj)
}
