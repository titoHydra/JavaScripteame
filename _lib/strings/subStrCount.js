	//Count the number of substring occurrences
	this.subStrCount = function(aString, aStringToCount)
	{
		var a = 0;
		var pos = aString.indexOf(aStringToCount);
		while(pos != -1) 
		{
		   a++;
		   pos = aString.indexOf(aStringToCount, pos+1);
		}
		return a;
	};
