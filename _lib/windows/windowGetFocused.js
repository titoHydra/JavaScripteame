	//returns the focused window
	this.windowGetFocused = function()
	{
		//dispatch the event to the extension
			var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]  
						.getService(Components.interfaces.nsIWindowMediator);  
			return wm.getMostRecentWindow('navigator:browser');
	}