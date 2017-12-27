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
	"propertyInfo.js",

	"customCss.js",

	"content script.js",
	"changeMinFontSize.js",
	"checkElemHasTextNode.js",
	"checkObjEqual.js",
	"getSelectorText.js",
	"getSpendTime.js",

	"oldStyleTransFunc.js",
	"nodeToFuncPointer.js",
	"reStyleFunc.js",
	"task.js",

	"imgToData.js",

	"brightnessTrans/bgImgStrBrightnessTrans.js",
	"brightnessTrans/colorNameToRgb.js",
	"brightnessTrans/colorStrBrightnessTrans.js",
	"brightnessTrans/colorTransRecordObj.js",
	"brightnessTrans/fullColorStrBrightnessTransFunc.js",
	"brightnessTrans/getImgBrightness.js",
	"brightnessTrans/imgElemBrightnessTrans.js",
	"brightnessTrans/rgbNumsBrightnessTrans.js",
	"brightnessTrans/styleSheetBrightnessTransFunc.js",
	
	"creatNewNodeObserver.js",
	"creatStyleSheetMutationObserver.js",

	"init.js",
	"main.js"
]
combineJsFiles("allCode.js",files)