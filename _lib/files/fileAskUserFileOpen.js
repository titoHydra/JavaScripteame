 	//asks the user to open a file
	this.fileAskUserFileOpen = function(aFileName, anExtension)
	{
		var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
		
		fp.init(window, null, fp.modeOpen);
		fp.defaultExtension = anExtension;
		fp.defaultString = aFileName;
		fp.appendFilter('*.'+anExtension, '*.'+anExtension);

		if(fp.show() != fp.returnCancel)
		{
			return fp;
		}
		else
		{
			return null;
		}
	}
