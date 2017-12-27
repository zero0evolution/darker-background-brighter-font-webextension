var checkObjEqual = function(a1,a2){
	// if(a1 instanceof Array && a2 instanceof Array){

	// }
	if(a1.length !== a2.length){return(false)}

	for(let i in a1){
		if(a1[i] instanceof Array && a2[i] instanceof Array){
			if(!checkObjEqual(a1[i],a2[i])){
				return(false)
			}
		}
		else if(a1[i] instanceof Object && a2[i] instanceof Object){
			if(!checkObjEqual(a1[i],a2[i])){
				return(false)
			}
		}
		else if(a1[i] !== a2[i]){
			return(false)
		}
	}
	return(true)
}