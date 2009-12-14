	//returns true if the tab is hidden
	this.tabIsHidden = function(aTab)
	{
		if(aTab.hasAttribute('hidden') && aTab.getAttribute('hidden') == 'true')
			return true;
		else
			return false;
	}
