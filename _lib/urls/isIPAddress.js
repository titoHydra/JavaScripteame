	//return true if the domain name is a ip address
	this.isIPAddress = function(aDomain)
	{
		if(/^([0-9]|\.)+$/.test(aDomain))
			return true;
		else
			return false;
	}
