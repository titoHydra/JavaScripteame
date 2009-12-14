	//returns the selection that the browser is returning looking in every frame until something found
	//this function should be used when is called from an element that makes the window lose focus
	this.getFramesSelectionRecursive = function(win)
	{
		var aSelection = '';
		if(!win)
			win = window.content;
		if(!win){}
		else
		{
			//checking window content
			aSelection = win.getSelection();

			if(aSelection != '' && aSelection != null)
				return aSelection;
				
			//cheking content of frames
			if(win.frames.length  > 0)
			{
				//getting selection from frames
				for (var a = 0; a < win.frames.length; a++)
				{
					if(!win.frames[a])
						continue;
					aSelection = win.frames[a].getSelection();
					
					if(aSelection != '' && aSelection != null)
						return aSelection;
					if(win.frames[a].frames.length  > 0)
					{
						aSelection = this.getFramesSelectionRecursive(win.frames[a]);
						if(aSelection != '' && aSelection != null)
							return aSelection;
					}
				}
			}
		}
		return aSelection;
	};
