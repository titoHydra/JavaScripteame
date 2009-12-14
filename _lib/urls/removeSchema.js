	//removes the schema of an URL
	this.removeSchema = function(aURL)
	{
		if(!aURL)
			return '';
		var schema =  aURL.replace(/^([^\:]*):.*$/, "$1");
		var rX= new RegExp('^'+schema+'\:\/+','i');
		return aURL.replace(rX, '');
	}