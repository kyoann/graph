program = "cd" s label:label 
	/ "ls" s label:label {cmd_ls(label);}
	/ "edit" s label:label {cmd_edit(label,false);}
	/ "view" s label:label {cmd_edit(label,true);}
	/ "link" s label:label {cmd_link(label);}
	/ "to" s label:label  {cmd_link(label);}
	/ "navigate" (s label:label)? {cmd_navigate(label);}
	/ "create" s label:label {cmd_create(label);}
	/ "unlink" s label1:label s "to" s label2:label {cmd_unlink(label1,label2);}
	/ "add to favorites" s label:label {cmd_addToFavorites(label);}
	/ "search" label:label {cmd_search(label);}
	/ "export state" {cmd_exportState();}
	/ "import state" {cmd_importState();}
	


label = label:.+ {return label.join("");}

s "space" = [ \t\n]+