	//returns the URL of the first link selected
	this.getSelectedLinkURL = function(forced)
	{
		//inspired by extended copy menu, linky and some mutations
		var aSelection = this.getBrowserSelection();	
		
		if((aSelection == '' || aSelection == null) && forced){aSelection = this.getFramesSelectionRecursive();}

		try{var objRange = aSelection.getRangeAt(0);}catch(e){return '';}
		
		var objClone = objRange.cloneContents();
		
		var objDiv = this.documentGetFocused().createElement('div');
			objDiv.appendChild(objClone);
		var links = objDiv.getElementsByTagName('a');

		var length = links.length;
		for (var a=0;a<length;a++)
		{
			if(links[a].hasAttribute('href'))
			{
				return String(links[a].href);
			}
		}
		return '';
	};
