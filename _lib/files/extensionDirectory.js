 	//returns the directory for this extension - this may became customizable to work with differents profiles
	this.extensionDirectory = function()
	{
		var extensionDirectory = Components.classes["@mozilla.org/file/directory_service;1"]  
					.getService(Components.interfaces.nsIProperties)  
					.get("ProfD", Components.interfaces.nsIFile);  
		
		//security - works always in a folder with the name of this extension
		extensionDirectory.append('myExt');
		
		if( !extensionDirectory.exists() || !extensionDirectory.isDirectory() )   // if it doesn't exist, create
		{
			extensionDirectory.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0755);
		}
		return extensionDirectory;
	}
