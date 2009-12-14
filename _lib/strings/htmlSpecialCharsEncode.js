	//Encodes HTML special chars
	this.htmlSpecialCharsEncode = function(aString)
	{
		return aString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}
