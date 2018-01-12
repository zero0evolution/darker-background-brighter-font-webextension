var urlRestrictionPatterns = [
	/^https?\:\/\/addons\.mozilla\.org/i,
	/^about\:/i,
	/^moz-extension\:\/\//i,
]
var checkUrlRestriction = function(url){
	if(typeof(url) === "string"){
		for(let eachPattern of urlRestrictionPatterns){
			if(url.match(eachPattern)){
				return(true)
			}
		}
		return(false)
	}
	return(true)
}