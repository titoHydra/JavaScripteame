	//decodes a string
	this.decodeUTF8 = function(aString)
	{
		if(aString.indexOf('%') == -1)
			return aString;
		try
		{
			return decodeURIComponent(aString);
		}
		catch(e)
		{
			try
			{
				return decodeURI(aString);
			}
			catch(e)
			{
				return aString;
			}
		}
	};
