	//cast an object toString avoids null errors
	this.string = function(aString)
	{
		if(!aString)
			return '';
		else
			return aString.toString();
	};
