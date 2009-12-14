 	//copy a file to a directory
	this.fileCopyToFolder = function(sourceFile, destinationDir)
	{
		var aDir = Components.classes["@mozilla.org/file/local;1"]
						.createInstance(Components.interfaces.nsILocalFile);
			aDir.initWithPath(destinationDir);
			
		var aFile = Components.classes["@mozilla.org/file/local;1"]
						.createInstance(Components.interfaces.nsILocalFile);
			aFile.initWithPath(sourceFile);

		aFile.copyTo(aDir, null);
	}