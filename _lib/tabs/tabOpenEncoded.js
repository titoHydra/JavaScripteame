	//open a new tab with an URL that is already encoded example:http://www.dmoz.org/World/Espa%C3%B1ol/
	this.tabOpenEncoded = function(aURL, selected)
	{
		if(this.isThereTreeStyleTab())// open tabs as children of the current tab
		{
			try{TreeStyleTabService.readyToOpenChildTab(gBrowser.selectedTab, true);}catch(e){}
		}
		var aTab = gBrowser.addTab(aURL);
		if(!selected){}
		else
			this.tabSelect(aTab);
		if(this.isThereTreeStyleTab())
		{
			try{TreeStyleTabService.stopToOpenChildTab(gBrowser.selectedTab);}catch(e){}
		}
	}