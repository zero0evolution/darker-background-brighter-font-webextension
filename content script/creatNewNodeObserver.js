
var creatNewNodeObserver =  function(doc){

	console.log("建立newNodeObserver")
	// 監視是否有新的節點 加入reStyleTask
	var newNodeObserver = new MutationObserver(
		function (mutationRecords){
			for (let eachMutationObj of mutationRecords){
				// 所有新增的節點
				// console.log("新增節點數:",eachMutationObj.addedNodes.length)
				for(let eachAddNode of eachMutationObj.addedNodes){

					nodeRecursion(eachAddNode,nodeToFuncPointer)
					// if(eachAddNode instanceof Element){
					// 	console.log("新節點的子節點數:",eachAddNode.children.length)
					// }
				}
			}
		}
	)
	
	//設置DOM 變更時就動作
	newNodeObserver.observe(
		doc, //監視目標
		{
			childList:true,		//監視目標節點的子元素新增與移除
			subtree:true,			//監視對於所有目標節點子系
		}
	)
}
