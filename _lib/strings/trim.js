	//trims a string
	this.trim = function(aString)
	{
		if(!aString)
			return '';
		return aString.replace(/^\s+/, '').replace(/\s+$/, '');
	};
