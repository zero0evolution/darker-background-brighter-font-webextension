var urlRestrictionPatterns = [
	/^about\:/i,
	/^moz-extension\:\/\//i,
	/^chrome\:\/\/extensions/i,
]
if(browserType.match(/Firefox/i)){
	urlRestrictionPatterns.push(/^https?\:\/\/addons\.mozilla\.org/i)
}
else if(browserType.match(/Chrome/i)){
	urlRestrictionPatterns.push(/^https?\:\/\/chrome\.google\.com/i)
}
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