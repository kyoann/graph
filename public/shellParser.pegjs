program = "cd" s label:label 
	/ "ls" s label:label s? {cmd_ls(label);}
	/ "edit" s label:label {cmd_edit(label,false);}
	/ "view" s label:label {cmd_edit(label,true);}
	/ "link" s label1:label s "to" s label2:label {cmd_link(label1,label2);}
	/ "navigate" s? {cmd_navigate();}
	/ "create" s? label:label {cmd_create(label);}

label = label:( [a-z]i / [0-9] )+ { return label.join("");}

//label = label: .+ { return label.join("");}
s "space" = [ \t\n]+