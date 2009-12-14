	//copy to the clipboard aString
	this.copyToClipboard = function(aString)
	{
		var clipboard = Components.classes["@mozilla.org/widget/clipboardhelper;1"]
							.getService(Components.interfaces.nsIClipboardHelper);
		clipboard.copyString(aString);
	}
