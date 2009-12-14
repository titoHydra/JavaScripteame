	//moves a tab
	this.tabMove = function(aTab, newPosition)
	{
		if('TMmoveTabTo' in gBrowser)//tab mix plus in tha house
		{
			// try to use browser move when tab mix plus fails, example on 3.0a7pre 
			try
			{
				gBrowser.TMmoveTabTo(aTab, newPosition);
			}
			catch(e)
			{
				gBrowser.moveTabTo(aTab, newPosition);
			}
		}
		else
			gBrowser.moveTabTo(aTab, newPosition);
	}