	//gets the subdomain from an URL
	this.getSubdomainFromURL = function(aURL)
	{
		if(!aURL)
			return '';
		//checks if contains the final /, if not it is added
		if(aURL.indexOf('://') != -1 && this.subStrCount(aURL, '/') == 2)
			aURL = aURL+'/';
		return this.removePort(aURL.replace(/^(.+?):\/+(.+?)\/.*$/, "$2")).toLowerCase();
	}
