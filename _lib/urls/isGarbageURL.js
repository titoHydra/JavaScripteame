	//returns true if the URL is garbage
	this.isGarbageURL = function(aURL)
	{
		if(this.isGarbageSubdomain(this.getSubdomainFromURL(aURL)) || this.isGarbageDomain(this.getDomainFromURL(aURL)))
			return true;
		else
			return false;
	}