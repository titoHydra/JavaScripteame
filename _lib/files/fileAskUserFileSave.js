 	//asks the user to save a file
	this.fileAskUserFileSave = function(aFileName, anExtension)
	{
		var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
		
		fp.init(window, null, fp.modeSave);
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
