	//decodes all chars encoded in a string
	this.decodeUTF8Recursive = function(aString)//recursion was optimized
	{
		while(aString.indexOf('%') != -1)
		{
			try
			{
				aString = decodeURIComponent(aString);
			}
			catch(e)
			{
				try
				{
					aString = decodeURI(aString);
				}
				catch(e)
				{
					return aString;
				}
			}
		}
		return aString;
	};
