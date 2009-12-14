 	//asks for a location of a folder
	this.fileAskUserFolderSelect = function()
	{
		var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
		
		fp.init(window, null, fp.modeGetFolder);
		
		if(fp.show() != fp.returnCancel)
		{
			return fp;
		}
		else
		{
			return null;
		}
	}
