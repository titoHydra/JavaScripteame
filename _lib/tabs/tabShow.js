	//Shows a tab hidden by this extension
	this.tabShow = function(aTab)
	{
		if(!aTab.hasAttribute('hidden') || aTab.getAttribute('hidden') == 'false')
		{
			return true;
		}
		if(aTab.hasAttribute('myExtHiddenTab'))
		{
			aTab.removeAttribute('myExtHiddenTab');
			aTab.setAttribute('hidden', false);
			return true;
		}
		return false;
	}
