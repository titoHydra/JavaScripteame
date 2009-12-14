	//gets the selected text of a document looking in focused elements (window, textinputs)
	//if forced === true
		//and if nothing is retreived will try to get some selection from frames and text inputs of the top document
		//force should be used when this function is called from an element that makes the window lose focus
	this.getSelectedText = function(forced)
	{
			var aTextSelection = '';
			
		//gets focused input selection
			aTextSelection = this.getFocusedElementSelection();
			if(aTextSelection != '')
				return aTextSelection;

		//gets focused document selection
			aTextSelection = this.trim(this.string(this.getBrowserSelection()));
			if(aTextSelection != '')
				return aTextSelection;
			
				
	//code behind this will run if the call to this function (getSelectedText) comes from an element that cause the lose of the focus in the window
			if(!forced)
				return aTextSelection;
		
		//gets selection from frames document
			aTextSelection = this.trim(this.string(this.getFramesSelectionRecursive()));
			if(aTextSelection != '')
				return aTextSelection;
			
		//gets selection in inputs of the top document
			var win = window.content;
			if(!win){}
			else
			{
				if(!win.document.forms){}
				else
				{
					for(var a = 0; a < win.document.forms.length; a++)
					{
						var win_form = win.document.forms[a];
						for(var b = 0; b < win_form.elements.length; b++)
						{
							var element = win_form.elements[b];
							if((element.tagName).toUpperCase() == 'INPUT' && element.type.match(/text/i) || element.tagName.match(/textarea/i))
							{
								try
								{
									aTextSelection =  this.trim(element.value.substring(element.selectionStart, element.selectionEnd));
								}
								catch(e){}
								if(aTextSelection != '')
									return aTextSelection;
							}
						}
					}
				}
			}

		//getting selection from form inputs from frames (NOT RECURSIVE)
			var win = window.content;
			if(!win){}
			else
			{
				if(win.frames.length  > 0)
				{
					//getting selection from frames form inputs
					for (var a = 0; a < win.frames.length; a++)
					{
						if(!win.frames[a].document)
							continue;
							
						var win_frame = win.frames[a];
						if(!win_frame.document.forms){}
						else
						{
							for(var b = 0; b < win_frame.document.forms.length; b++)
							{
								var doc_form = win_frame.document.forms[b];
								for(var c = 0; c < doc_form.elements.length; c++)
								{
									var element = doc_form.elements[c];
									if((element.tagName).toUpperCase() == 'INPUT' && element.type.match(/text/i) || element.tagName.match(/textarea/i))
									{
										try
										{
											aTextSelection =  this.trim(element.value.substring(element.selectionStart, element.selectionEnd));
										}
										catch(e){}
										if(aTextSelection != '')
											return aTextSelection;
									}
								}
							}
						}
					}
				}
			}
		return aTextSelection;
	};
