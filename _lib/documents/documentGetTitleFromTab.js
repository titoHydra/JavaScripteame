	//gets the title of the  aTab-REVIEW
	this.documentGetTitleFromTab = function(aTab)
	{
		return String(this.browserGetFromTab(aTab).contentDocument.title);
	}