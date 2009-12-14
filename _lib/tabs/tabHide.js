	//Hides a tab and return true if the tab was hidden. It will return false if the tab is protected
	this.tabHide = function(aTab)
	{
		if(!aTab.hasAttribute('isPermaTab') && !aTab.hasAttribute('protected'))
		{
			aTab.setAttribute('hidden', true);
			aTab.setAttribute('myExtHiddenTab', true);
			return true;
		}
		return false;
	}
