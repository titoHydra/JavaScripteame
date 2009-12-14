 	//returns the dirname of a file
	this.fileDirname = function(aFilePath)
	{
		var aDestination = Components.classes["@mozilla.org/file/local;1"]
						.createInstance(Components.interfaces.nsILocalFile);
			aDestination.initWithPath(aFilePath);

		return aDestination.parent.path;
	}