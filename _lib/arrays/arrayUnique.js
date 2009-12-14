	//removes duplicate values from an array
	this.arrayUnique = function (anArray)
	{
		var tmp = [];
		for(var id in anArray)
		{
			if(!this.inArray(tmp, anArray[id]))
			{
				tmp[tmp.length] = anArray[id];
			}
		}
		return tmp;
	};
