 	//copy a file to a desired location
	this.fileCopy = function(sourceFile, destinationFile)
	{
		//remove the target file if exists
		this.fileRemove(destinationFile, true);
		
		var aDestination = Components.classes["@mozilla.org/file/local;1"]
						.createInstance(Components.interfaces.nsILocalFile);
			aDestination.initWithPath(destinationFile);
			
		var aFile = Components.classes["@mozilla.org/file/local;1"]
						.createInstance(Components.interfaces.nsILocalFile);
			aFile.initWithPath(sourceFile);
		
		aFile.copyTo(aDestination.parent, aDestination.leafName);
	}