	//returns true if tree style tab is installed
	this.isThereTreeStyleTab = function()
	{
		if ('TreeStyleTabService' in window)
			return true;
		else
			return false;
	}