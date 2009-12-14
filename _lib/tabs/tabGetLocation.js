	//gets the current URI from aTab-REVIEW
	this.tabGetLocation = function(aTab)
	{
		if(aTab.hasAttribute('permaTabUrl'))
			return String(aTab.getAttribute('permaTabUrl'));
		else
			return String(this.browserGetFromTab(aTab).currentURI.spec);
	}