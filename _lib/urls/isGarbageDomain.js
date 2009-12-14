	//returns true if the aDomain is garbage
	this.isGarbageDomain = function(aDomain)
	{
		switch(aDomain)
		{
			case 'googlesyndication.com':
				return true;
			default:
				return false;
		}
	}