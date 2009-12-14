	//returns the current focused location-REVIEW
	this.documentFocusedGetLocation = function()
	{
		return String(window.top.getBrowser().browsers[window.top.getBrowser().mTabBox.selectedIndex].contentDocument.location);
		/*
			try
			{
				return String(window.content.document.location);
			}
			catch(e)
			{
				return '';
			}
		*/
	}