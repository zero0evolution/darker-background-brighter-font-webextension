import os
import re
import io
def combineJsFiles(targetFileName,files):

	targetPathFileName = "."+os.sep+targetFileName

	with io.StringIO() as stringObj:

		stringObj.write('''
"use strict"
// ==UserScript==
// @name         darker background brighter font
// @namespace    
// @version      4.0
// @description  
// @author       zero0evolution
// @include      /.*/
// ==/UserScript==
		''')

				# read all js files
		print("read js files:")

		# for eachJsFile in getAllJsFile():
		for eachJsFile in files:
			if(eachJsFile == targetPathFileName):
				continue

			print(repr(eachJsFile))
			with open(file = eachJsFile,encoding = "UTF-8",mode = "rt") as fileObj:
				for eachLine in fileObj:
					stringObj.writelines(eachLine)

			stringObj.writelines("\n")

		# write to target file
		print("write js file:",targetFileName)
		with open(file = targetFileName,encoding = "UTF-8",mode = "wt") as fileObj:
			fileObj.write(stringObj.getvalue())

def getAllJsFile(path = "."):

	for root, dirs, files in os.walk(path):
		if(root[-1] != os.sep):
			root+=os.sep

		for eachFile in files:
			jsSubFileNameMatchObj = re.search(string = eachFile,pattern = "\.js$",flags = re.I)
			if(jsSubFileNameMatchObj):
				yield(root+eachFile)


###########################################################################
# test

# for eachJsFilePath in getAllJsFile("."):
	# print(repr(eachJsFilePath))

files = [
	"optionInfo.js",
	"lib/urlToDomain.js",
	"lib/loadOptions.js",
	"lib/checkObjEqual.js",
	

	"content script/getBrowserVersion.js",
	"content script/propertyInfo.js",
	"content script/customCss.js",
	"content script/addWhiteBorder.js",
	"content script/changeMinFontSize.js",
	"content script/checkElemHasTextNode.js",
	"content script/getSelectorText.js",
	"content script/oldStyleTransFunc.js",
	"content script/nodeToFuncPointer.js",
	"content script/reStyleFunc.js",
	"content script/task.js",
	"content script/setTopIfNoProperty.js",

	"content script/brightnessTrans/bgImgStrBrightnessTrans.js",
	"content script/brightnessTrans/colorNameToRgb.js",
	"content script/brightnessTrans/colorStrBrightnessTrans.js",
	"content script/brightnessTrans/colorTransRecordObj.js",
	"content script/brightnessTrans/fullColorStrBrightnessTransFunc.js",
	"content script/brightnessTrans/imgElemBrightnessTrans.js",
	"content script/brightnessTrans/rgbNumsBrightnessTrans.js",
	"content script/brightnessTrans/styleSheetBrightnessTransFunc.js",

	"content script/creatNewNodeObserver.js",
	"content script/creatStyleSheetMutationObserver.js",


	"content script/init.js",
	"content script/main.js"
]
combineJsFiles("allCode.js",files)