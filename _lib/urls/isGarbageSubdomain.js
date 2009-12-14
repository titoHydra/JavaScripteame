	//returns true if the aSubdomain is garbage
	this.isGarbageSubdomain = function(aSubdomain)
	{
		switch(aSubdomain)
		{
			case 'googleads.g.doubleclick.net':
			case 'pagead2.googlesyndication.com':
				return true;
			default:
				return false;
		}
	}