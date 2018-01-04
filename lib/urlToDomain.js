var urlToDomain = function(url){
	var domain = url
	// 解析 domain
	var domainMatchObj = url.match(/^(.*?[^\/])\/(?=[^\/]|$)/)
	if(domainMatchObj){domain = domainMatchObj[1]}

	return(domain)
}