	// close a tab and return true if the tab was closed. It will return false if the tab is protected by another extension
	this.tabClose = function(aTab)
	{
		if(!aTab.hasAttribute('isPermaTab') && !aTab.hasAttribute('protected'))
		{
			try
			{
				gBrowser.closeTab(aTab);
			}
			catch(e)
			{
				gBrowser.removeTab(aTab);
			}
			return true;
		}		
		return false;
	}
