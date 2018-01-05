import os,re,json

def compareCss(file1,file2):
	with open(file=file1,mode = "rt") as fileObj1:
		with open(file=file2,mode = "rt") as fileObj2:

			obj = {
				1:{
					"txt":fileObj1.read(),
					"cssRecordObj":{},
				},
				2:{
					"txt":fileObj2.read(),
					"cssRecordObj":{},
				},
			}

			for key in obj:
				for matchObj in re.finditer(pattern = r"([^\{^\}]*)\{([^\{^\}]*)\}",string = obj[key]["txt"]):
					selectorTexts = matchObj.group(1).split(",")
					cssRules = matchObj.group(2).split(";")

					################################################
					deleteSpaceAndEmpty(selectorTexts)
					deleteSpaceAndEmpty(cssRules)
					################################################

					cssRecordObj = obj[key]["cssRecordObj"]
					for selectorText in selectorTexts:
						for cssRule in cssRules:

							if(selectorText not in cssRecordObj):
								cssRecordObj[selectorText] = {}

							property,propertyVal = cssRule.split(":",maxsplit = 1)

							if(property not in cssRecordObj[selectorText]):
								cssRecordObj[selectorText][property] = [propertyVal]

							else:
								cssRecordObj[selectorText][property].append(propertyVal)


			cssRecordObjs = [obj[key]["cssRecordObj"] for key in obj]

			selectorTexts = set.union(
				set(cssRecordObjs[0].keys()),set(cssRecordObjs[1].keys()))

			maxCount = 30
			count = 0
			for selectorText in selectorTexts:
				try:
					propertys = set.union(
						set(cssRecordObjs[0][selectorText].keys()),
						set(cssRecordObjs[1][selectorText].keys()))
				except KeyError:
					for i in [0,1]:
						if(selectorText in cssRecordObjs[i]):
							print(selectorText,"{")
							for property in cssRecordObjs[i][selectorText]:
								print("\t",property,":",cssRecordObjs[i][selectorText][property],";")
							print("}")
					continue

				for property in propertys:
					propertyVal0 = cssRecordObjs[0][selectorText].get(property)
					propertyVal1 = cssRecordObjs[1][selectorText].get(property)

					if(propertyVal0 != propertyVal1):
						if(property in ["background","background-image","src"]):
							continue
						print(repr(selectorText),"{")
						print("\t",repr(property),":")
						print("\t",propertyVal0)
						print("\t",propertyVal1)
						print("}")
						# count+=1
						# if(count>=maxCount):
						# 	return(None)

def deleteSpaceAndEmpty(array):
	# delete space in head and tail and delete empty
	i = 0
	while(i<len(array)):
		array[i] = array[i].strip()
		array[i] = re.sub(string = array[i],pattern = r"\n",repl = "",flags = re.M)
		if(not array[i]):
			del(array[i])
			continue
		i+=1

	return(array)

compareCss("h24-20171129.css","new.css")