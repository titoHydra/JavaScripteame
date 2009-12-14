	//returns the application name
	this.getApplicationName = function ()
	{
		var appInfo=Components.classes["@mozilla.org/xre/app-info;1"].
						getService(Components.interfaces.nsIXULAppInfo);
		return  appInfo.name
	}
