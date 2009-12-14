	//Decodes HTML special chars
	this.htmlSpecialCharsDecode = function(aString)
	{
		return aString.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
	}
