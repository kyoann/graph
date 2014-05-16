program = "cd" s label:label 
	/ "ls" s label:label s? {cmd_ls(label);}
	/ "edit" s label
	/ "view" s label
	/ "link" s label s "to" s label 
	/ "navigate" s? {cmd_navigate();}

label = label:( [a-z]i / [0-9] )+ { return label;}
s "space" = [ \t\n]+
