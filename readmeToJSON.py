import re
import json
with open(file = "README.md",encoding = "UTF-8",mode = "rt") as fileObj:
	text = fileObj.read()
	text = re.sub(string = text,pattern = "\s\s$",repl = r"\\n",flags = re.M)
	text = re.sub(string = text,pattern = "\n\n",repl = r"\\n",flags = re.M)
	text = re.sub(string = text,pattern = "\n",repl = r"",flags = re.M)
	text = re.sub(string = text,pattern = '"',repl = r'\\"',flags = re.M)
	text = re.sub(string = text,pattern = '\t',repl = r'\\t',flags = re.M)
	# text = json.dumps(text,ensure_ascii=False)
	print(text)