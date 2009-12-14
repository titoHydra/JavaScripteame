	//returns the TOP location for a document
	this.documentGetTopLocation = function(aDoc)
	{
		return String(aDoc.defaultView.top.document.location);
	}