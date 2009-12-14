	//returns true if the URL is local (maybe)
	this.isLocalURL = function(aURL)
	{
		var schema = this.getSchema(aURL);
		var domain = this.getSubdomainFromURL(aURL);
		if(schema == 'file' || domain.indexOf('.') == -1 || (this.isIPAddress(domain) && this.isIPAddressPrivate(domain)))
			return true;
		else
			return false;
	}