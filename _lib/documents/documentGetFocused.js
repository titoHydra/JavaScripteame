	//returns the current focused document-REVIEW
	this.documentGetFocused = function()
	{
		return window.top.getBrowser().browsers[window.top.getBrowser().mTabBox.selectedIndex].contentDocument;
	}