function ui_createUI(uiId,label) {
	var UIDiv = document.createElement('div');
	UIDiv.id = uiId;
	UIDiv.className = 'UI';
	var labelDiv = document.createElement('div');
	labelDiv.className = 'UILabel';
	labelDiv.innerHTML = label;
	var contentDiv = document.createElement('div');
	contentDiv.className = 'UIContent';
	UIDiv.appendChild(labelDiv);
	UIDiv.appendChild(contentDiv);
	return UIDiv;
}
function ui_getContentDiv(uiDiv) {
	return uiDiv.querySelector('.UIContent');
}
