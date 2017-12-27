// var allSpendms = 0
var getSpendms = function(testFunc,...args){
	var beginTime = new Date()
	
	testFunc(...args)

	var endTime = new Date()
	var spendms = endTime-beginTime
	return(spendms)
}