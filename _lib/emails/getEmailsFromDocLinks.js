	//returns all the email links from a doc
	this.getEmailsFromDocLinks = function(aDoc)
	{
		var emails = [];
		var length =  aDoc.getElementsByTagName("a").length;
		for(var a = 0; a < length; a++)
		{
			var item = aDoc.getElementsByTagName("a").item(a);
			if(item.hasAttribute('href') && item.href.indexOf('mailto') === 0 && item.href.indexOf('mailto:?') == -1)
				emails[emails.length] = item.href.replace('mailto:', '').toLowerCase().replace(/\?.*$/, ''); 
		}
		return emails;
	}
