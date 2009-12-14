 	//complete deletes the directory that contains user data of this extension
	this.extensionDirectoryClean = function()
	{
		this.fileRemove(this.extensionDirectory().path);
	}
