	//returns an array of the URLs of the selected links
	this.getSelectedLinksURLs = function(forced)
	{
		//inspired by extended copy menu, linky and some mutations
		var aSelection = this.getBrowserSelection();	
		var links = [];
		if((aSelection == '' || aSelection == null) && forced){aSelection = this.getFramesSelectionRecursive();}
			
		try{var objRange = aSelection.getRangeAt(0);}catch(e){return links;}
		
		var objClone = objRange.cloneContents();
		
		var objDiv = this.documentGetFocused().createElement('div');
			objDiv.appendChild(objClone);
		var lk = objDiv.getElementsByTagName('a');

		var length = lk.length;
		for (var a=0;a<length;a++)
		{
			if(lk[a].hasAttribute('href'))
			{
				links[links.length] = String(lk[a].href);
			}
		}
		return links;
	};
