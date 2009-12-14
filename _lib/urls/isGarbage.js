	//returns true if the aURLorDomain is garbage
	this.isGarbage = function(aURLorDomain)
	{
		if(aURLorDomain.indexOf(':') != -1 || aURLorDomain.indexOf('/') != -1)
			return this.isGarbageURL(aURLorDomain);
		else if(this.isGarbageSubdomain(aURLorDomain) || this.isGarbageDomain(aURLorDomain))
			return true;
		else
			return false;
	}