	//returns the selection that the focused window is returning or the selection of the top document if the window is not focused
	this.getBrowserSelection = function()
	{
		var aSelection = '';
				
		var focusedWindow = document.commandDispatcher.focusedWindow;
		aSelection = focusedWindow.getSelection();
		if(aSelection != '' && aSelection != null)
			return aSelection;
		
		aSelection = window.content.getSelection();

		return aSelection;
	};
