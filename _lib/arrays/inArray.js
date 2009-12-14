	//checks if a value exists in an array
	this.inArray = function (anArray, some)
	{
		for(var id in anArray)
		{
			if(anArray[id]==some)
				return true;
		}
		return false;
	};
