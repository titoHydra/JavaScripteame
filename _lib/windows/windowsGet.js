	//returns an array of navigator:browser
	this.windowsGet = function()
	{
		var windows = [];
		var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
					.getService(Components.interfaces.nsIWindowMediator);
		var enumerator = wm.getEnumerator('navigator:browser');
		while(enumerator.hasMoreElements())
		{
			var win = enumerator.getNext();
			// win is [Object ChromeWindow] (just like window), do something with it
			windows[windows.length] = win;
		}
		return windows;
	}