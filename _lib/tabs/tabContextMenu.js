	//returns the tab context menu
	this.tabContextMenu = function()
	{
		if(!this.getBrowserElement('tabContextMenu'))
			return document.getAnonymousElementByAttribute(this.getBrowserElement("content") , "anonid", "tabContextMenu");
		else
			return this.getBrowserElement('tabContextMenu');
	}
