
var nodeTasks = []
// 隱藏node延後處理
var hideNodeTasks = []

var addToTask = function(node,insertPos = -1){
	var hasTaskFlag = (nodeTasks.length+hideNodeTasks.length)>0

	if(node.style.display === "none"){var tasks = hideNodeTasks}
	else{var tasks = nodeTasks}

	if( (insertPos < 0) || (insertPos > tasks.length) ){
		insertPos = tasks.length
	}
	tasks.splice(insertPos, 0, node)

	// 若沒有在運行任務 就開始任務
	if(!hasTaskFlag){
		setTimeout(processTask,0)
		setTimeout(creatShowTasksLenElem,0)
	}
}

var processTask = function(){
	var i = 0
	while(i<optionInfo.runTaskQuantityAt1Time.value){
		if(nodeTasks.length>0){
			reStyleFunc(nodeTasks.shift())
		}
		else if(hideNodeTasks.length>0){
			reStyleFunc(hideNodeTasks.shift())
		}
		else{
			break
		}
		i++
	}
	if((nodeTasks.length+hideNodeTasks.length)>0){
		setTimeout(processTask,0)
	}
}

var creatShowTasksLenElem = function(){
	var showTasksLenElem = document.createElement("div")
	showTasksLenElem.style.position = "fixed"
	showTasksLenElem.style.bottom = "0px"
	showTasksLenElem.style.right = "0px"
	showTasksLenElem.style.display = "block"

	showTasksLenElem.style.backgroundColor = "black"
	showTasksLenElem.style.color = "white"

	showTasksLenElem.style.boxShadow = "0px 0px 5px 0px white"
	// showTasksLenElem.style.setProperty("pointer-events","none")

	showTasksLenElem.onmouseenter = function(event){
		event.target.style.opacity = "0"
		event.target.style.setProperty("pointer-events","none")

		setTimeout(
			function(elem){
				elem.style.opacity = "1"
				elem.style.setProperty("pointer-events","auto")
			},2000,event.target
		)
	}
	/*showTasksLenElem.onmouseleave = function(event){
		event.target.style.opacity = "0.8"
	}*/
	document.body.appendChild(showTasksLenElem)

	var updateTasksLen = function(elem){
		if((nodeTasks.length+hideNodeTasks.length)>0){
			elem.innerText = 
				browser.i18n.getMessage("showTaskLenText")+
				String(nodeTasks.length)+","+String(hideNodeTasks.length)

			setTimeout(updateTasksLen,500,elem)
		}
		else{
			elem.remove()
		}
	}
	updateTasksLen(showTasksLenElem)
}

	