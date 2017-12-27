
var nodeTasks = []

var addToTask = function(node,insertPos = -1){
	var hasTaskFlag = nodeTasks.length>0

	if( (insertPos < 0) || (insertPos > nodeTasks.length) ){
		insertPos = nodeTasks.length
	}
	nodeTasks.splice(insertPos, 0, node)
	
	// 若沒有在運行任務 就開始任務
	if(!hasTaskFlag){
		setTimeout(processTask,0)
		setTimeout(creatShowTasksLenElem,0)
	}
}

var processTask = function(){
	var runTaskQuantity = Math.min(
		optionInfo.runTaskQuantityAt1Time.value,
		nodeTasks.length
	)

	var i = 0
	while(i<runTaskQuantity){
		var node = nodeTasks.shift()
		reStyleFunc(node)
		i++
	}
	if(nodeTasks.length>0){setTimeout(processTask,0)}
	// else{setTimeout(processTask,500)}
}

var creatShowTasksLenElem = function(){
	var showTasksLenElem = document.createElement("div")
	showTasksLenElem.style.position = "fixed"
	showTasksLenElem.style.bottom = "0px"
	showTasksLenElem.style.right = "0px"
	showTasksLenElem.style.display = "block"

	showTasksLenElem.style.backgroundColor = "black"
	showTasksLenElem.style.color = "white"

	showTasksLenElem.style.boxShadow = "0px 0px 10px 0px white"
	document.body.appendChild(showTasksLenElem)

	showTasksLenElem.onmouseenter = function(event){
		event.target.style.opacity = "0.2"
	}
	showTasksLenElem.onmouseleave = function(event){
		event.target.style.opacity = "1"
	}

	var updateTasksLen = function(elem){
		if(nodeTasks.length>0){
			elem.innerText = 'Number of "need to change elements":'+
				String(nodeTasks.length)

			setTimeout(updateTasksLen,500,elem)
		}
		else{
			elem.remove()
		}
	}
	updateTasksLen(showTasksLenElem)
}

	