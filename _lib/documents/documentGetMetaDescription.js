	//returns the  content of the metadescription of a document 
	this.documentGetMetaDescription = function(aDoc)
	{
		var tobj = aDoc.evaluate("//*/meta[@name='DESCRIPTION']|//*/meta[@name='description']", aDoc, null, XPathResult.ANY_TYPE, null);
		var metaTag = tobj.iterateNext();
		if(metaTag)
		{
			return metaTag.getAttribute('content');
		}
		else
		{
			return '';
		}
	}