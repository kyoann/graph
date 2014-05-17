program = "cd" s label:label 
	/ "ls" s label:label s? {cmd_ls(label);}
	/ "edit" s label:label {cmd_edit(label,false);}
	/ "view" s label:label {cmd_edit(label,true);}
	/ "link" s label s "to" s label 
	/ "navigate" s? {cmd_navigate();}
	/ "create" s? label:label {cmd_create(label);}

//label = label:( [a-z]i / [0-9] )+ { return label;}

label = label: .+ { return label.join("");}
s "space" = [ \t\n]+
