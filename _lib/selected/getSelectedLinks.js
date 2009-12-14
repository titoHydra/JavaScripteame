	//returns an array of links as objects
	this.getSelectedLinks = function(forced)
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
			links[links.length] = lk[a];
		}
			
		return links;
		/*
		//inspired by linky
		var lnks = document.commandDispatcher.focusedWindow.document.getElementsByTagNameNS("*", "a");
		var links = [];
		if(lnks && lnks.length)
		{
			var aSelection = this.getBrowseraSelection();
			if((aSelection == '' || aSelection == null) && forced){aSelection = this.getFramesaSelectionRecursive();}
			var length = lnks.length;
			for (var a=0;a<length;a++)
			{
				if(aSelection.containsNode(lnks[a], true))
					links[links.length] = lnks[a];
			}
		}*/
		return links;
	};