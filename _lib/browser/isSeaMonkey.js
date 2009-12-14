	//returns true if the Application is SeaMonkey
	this.isSeaMonkey = function()
	{
		if(this.getApplicationName() == 'SeaMonkey')
			return true;
		else
			return false;
	}
