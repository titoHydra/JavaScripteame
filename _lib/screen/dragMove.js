		/*
			container.addEventListener("mousedown", function (event){ myExt.dragDown(container) }, false);  
			container.addEventListener("mouseup",  function (event){ myExt.dragUp(container) }, false);  
			container.addEventListener("mousemove",  function (event){ myExt.dragMove(event, container, container.firstChild) }, false); 
		*/


	//move an object in the window
	this.dragMove = function(event, anElement, anElement_size_reference)
	{
		event.preventDefault();
		event.stopPropagation();
		if(!anElement.hasAttribute('dragable'))
			return;
			
		var document_width = window.document.width;
		var document_height  = window.document.height;

		var mouse_x = event.pageX;
		var mouse_y = event.pageY;
		
		if(this.getBrowserElement('status-bar'))
			var status_bar_height = this.getBrowserElement('status-bar').boxObject.height;
		else
			var status_bar_height = 0;
		
		var object_width      = anElement_size_reference.width;
		var object_height     = anElement_size_reference.height;
		
		var object_half_width      = object_width/2;
		var object_half_height     = object_height/2;
	
		//resolve the position ob the object in the window
		/*
			if(mouse_x>=(document_width/2))
				var screen_zone_left_right = 'right';
			else
				var screen_zone_left_right = 'left';
	
			if(mouse_y>=(document_height/2))
				var screen_zone_above_below = 'below';
			else
				var screen_zone_above_below = 'above';
			*/
		//take the object by the middle
			var new_x = mouse_x-object_half_width;
			var new_y = mouse_y-object_half_height;
			
		//don't move the object to out of the sceen
				//right normalize
					if(new_x<0)
						new_x = 0;
				//left normalize
					else if(new_x>document_width-object_width)
						new_x = document_width-object_width;
				//status bar no over
					if(new_y>=document_height-object_height-status_bar_height)
						new_y = document_height-object_height-status_bar_height;
				//top normalize
					else if(new_y<0)
						new_y = 0;
					
					//anElement.style.setProperty("right", (new_x)+'px', "important");
					//anElement.style.setProperty("bottom", (new_y)+'px', "important");
					
			//anElement.autoPosition = false;
		//	anElement.allowEvents = true;
			//anElement.moveTo(Math.ceil(new_x), Math.ceil(new_y));	
			anElement.left =  Math.round(new_x);
			anElement.top = Math.round(new_y);
	}  