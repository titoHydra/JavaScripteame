	//removes a file from the file system
	this.fileRemove = function(aFileOrDirectory, isSecure)
	{
		var aFile = Components.classes["@mozilla.org/file/local;1"]
						.createInstance(Components.interfaces.nsILocalFile);
			aFile.initWithPath(aFileOrDirectory);
		//security check - be sure to delete a file from this extension
		if(aFile.exists() && (String(aFile.path).indexOf('myExt') != -1 || isSecure))
		{
			aFile.remove(true)
			//this.dump('Deleting:'+aFile.path);
		}
		else if(aFile.exists())
		{
			this.error("This add-on don't enjoys deleting files outside of your extension's profile directory. The file : "+aFile.path);
		}
	}