	//remove the port number from a domain name
	this.removePort = function(aDomain)
	{
		if(!aDomain)
			return '';
		return aDomain.replace(/\:[0-9]*$/, '');//the * is for "local" domains like file:////c:/
	}