	//gets the schema of a URL
	this.getSchema = function(aURL)
	{
		if(!aURL)
			return '';
		return aURL.replace(/^([^\:]+):.*$/, "$1").toLowerCase();
	}