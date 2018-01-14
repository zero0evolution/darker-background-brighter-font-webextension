// 建立贊助按鈕
var createLinkButton = function(id,innerText,link,iconLink){

	var tooltipElem = document.createElement("span")

	tooltipElem.classList.add("tooltip")
	tooltipElem.style.margin = "0.5em 0em 0.5em 0.5em"

	tooltipElem.onclick = function(event){
		window.open(link)
		if(browserType !== "Firefox Mobile"){window.close()}
	}
	

	var imgElem = document.createElement("img")
	imgElem.src = iconLink
	imgElem.style.width = "1.5em"
	imgElem.style.height = "1.5em"
	imgElem.style.filter = "drop-shadow(rgb(255, 255, 255) 0px 0px 1px)"
	tooltipElem.appendChild(imgElem)

	var tooltipTextElem = document.createElement("div")
	tooltipTextElem.classList.add("tooltipText")
	tooltipTextElem.innerText = innerText
	tooltipTextElem.style.left = "0px"
	tooltipTextElem.style.right = "auto"

	tooltipTextElem.style.width = "auto"
	tooltipTextElem.style.height = "auto"
	tooltipTextElem.style.whiteSpace = "nowrap"
	tooltipElem.appendChild(tooltipTextElem)

	return(tooltipElem)
}

var linkElemProperties = [
	{
		id:"supportDeveloperButton",
		icon:"https://www.paypalobjects.com/webstatic/icon/pp32.png",
		link:"https://www.paypal.me/zero0evolution/0USD",
		text:browser.i18n.getMessage("supportDeveloperText"),
	},
	{
		id:"commentInMozillaButton",
		icon:"https://addons.cdn.mozilla.net/favicon.ico?v=1",
		link:"https://addons.mozilla.org/firefox/addon/darker-bg-brighter-font/reviews/",
		text:browser.i18n.getMessage("commentInMozilla"),
	},
	{
		id:"commentInGoogleButton",
		icon:"https://ssl.gstatic.com/chrome/webstore/images/icon_144px.png",
		link:"https://chrome.google.com/webstore/detail/darker-background-brighte/mdolidbiejfnaejdoagjacapnichoccj/reviews",
		text:browser.i18n.getMessage("commentInGoogle"),
	},
	{
		id:"reportBugInGithubButton",
		icon: "https://assets-cdn.github.com/favicon.ico",
		link:"https://github.com/zero0evolution/darker-background-brighter-font-webextension/issues",
		text:browser.i18n.getMessage("reportBugInGithub"),
	},
]

var linkButtons = []
for(let linkElemProperty of linkElemProperties){
	var linkButton = createLinkButton(
		linkElemProperty.id,
		linkElemProperty.text,
		linkElemProperty.link,
		linkElemProperty.icon,
	)
	linkButtons.push(linkButton)
}