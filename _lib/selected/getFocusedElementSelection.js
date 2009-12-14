	//returns the selected text of a focused element (if any)
	this.getFocusedElementSelection = function()
	{
		//http://forums.mozillazine.org/viewtopic.php?t=570720 and max1millon again! thanks
		
		var aTextSelection = '';
		
		if(!document.commandDispatcher || !document.commandDispatcher.focusedElement)
			return '';

		var tBox = document.commandDispatcher.focusedElement;
		if(!tBox.value || tBox.value == '')
			return '';
		try
		{
			aTextSelection = this.trim(tBox.value.substring(tBox.selectionStart, tBox.selectionEnd));
		}
		catch(e){}
		
		return aTextSelection;
	};
