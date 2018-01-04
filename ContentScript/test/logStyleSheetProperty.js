var getCssVarProperty = function(cssRule,propertyValue){
	var varCssMatchObj = propertyValue.match(
		/^var\(([a-z0-9\-]+)(?:\,\s(.*?))?\)$/i)
	if(varCssMatchObj){
		var subPropertyValue = cssRule.style.getPropertyValue(varCssMatchObj[1])
		console.log(varCssMatchObj[1],subPropertyValue)
		if(varCssMatchObj[2]){
			getCssVarProperty(cssRule,varCssMatchObj[2])
		}
	}
	else{
		console.log(propertyValue)
	}
}

var logStyleSheetProperty = function(property){
	var tempCssRuleRecursion = function(cssRule){
		if(cssRule.style instanceof CSSStyleDeclaration){
			propertyValue = cssRule.style.getPropertyValue(property)
			if(propertyValue){
				console.log(cssRule.selectorText,":")
				getCssVarProperty(cssRule,propertyValue)
			}
		}
		if(cssRule.cssRules instanceof CSSRuleList){
			for(let subCssRule of cssRule.cssRules){
				tempCssRuleRecursion(subCssRule)
			}
		}
	}
	for(let sheet of document.styleSheets){
		for(let cssRule of sheet.cssRules){
			tempCssRuleRecursion(cssRule)
		}
	}
}