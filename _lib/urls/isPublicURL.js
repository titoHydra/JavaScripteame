	//returns true if the URL is public accesible (maybe)
	this.isPublicURL = function(aURL)
	{
		var schema = this.getSchema(aURL);
		if(schema != 'http' && schema != 'https' && schema != 'ftp' && schema != 'feed' && schema != 'gopher')
			return false;
		
		var domain = this.getSubdomainFromURL(aURL);
		
		if(domain.indexOf('.') == -1)
			return false;
		
		if(this.isIPAddress(domain) && this.isIPAddressPrivate(domain))
			return false
		
		return true;
	}