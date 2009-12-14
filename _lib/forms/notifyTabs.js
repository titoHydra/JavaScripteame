	//creates and shows a notification in all the tabs behind the tabbar
	/*
		example:
			var buttons = [];
			
			var button = [];
				button[0] = 'Click to alert 1';
				button[1] = function(){alert('Cliked one!')}
				
			buttons[buttons.length] = button;
			
			var button = [];
				button[0] = 'Click to alert 2';
				button[1] = function(){alert('Cliked two!')}
				
			buttons[buttons.length] = button;
			this.notifyTabs('This is the mensajitoooooooooooooooo o o o o ooooooo ', '', buttons, 4000);

	*/
	this.notifyTabs = function(aString, aType, anArrayButtons, aTime)
	{
		if(!anArrayButtons || anArrayButtons == '')
			anArrayButtons = [];
		var id = 'myExt-notifyTabs-'+this.sha256(aString);
		/*
		var notification = this.getBrowserElement(id);
		if(notification)
		{
			notification.setAttribute('hidden', false);
			//hidding the notification
			if(aTime)
				setTimeout(function(){notification.setAttribute('hidden', true);}, aTime);
			return;
		}*/
		//the container
		var hbox = this.create('hbox');
			hbox.setAttribute('class', 'notification-inner outset');
			hbox.setAttribute('style', 'max-width:100% !important;width:100% !important;');
			hbox.setAttribute('id', id);
		//the icon and the name of the extension
		var toolbarbutton = this.create('toolbarbutton');
			toolbarbutton.setAttribute('image', '__ICON_URI16__');
			toolbarbutton.setAttribute('label', "__EXT_NOMBRE__ : ");
			toolbarbutton.setAttribute('style', 'border:1px solid transparent !important;margin:2px !important;padding:0px !important;-moz-appearance: none;margin-left:6px !important;');
			hbox.appendChild(toolbarbutton);

		//the icon of the message
		var toolbarbutton = this.create('toolbarbutton');
			if(aType == 'warning')//warning image
				toolbarbutton.setAttribute('image', 'chrome://myExt/content/lib/forms/notifyTabs/warning.png');
			else if(aType == 'error')//error image
				toolbarbutton.setAttribute('image', 'chrome://myExt/content/lib/forms/notifyTabs/error.png');
			else//info image
				toolbarbutton.setAttribute('image', 'chrome://myExt/content/lib/forms/notifyTabs/info.png');
			//toolbarbutton.setAttribute('label', aString);
			toolbarbutton.setAttribute('style', 'border:1px solid transparent !important;margin:0px !important;padding:0px !important;-moz-appearance: none;');
			
			hbox.appendChild(toolbarbutton);
			
		// the message to display
			if(aString instanceof XULElement)
			{
				var description = aString;
				var msgContainer = this.create('hbox');
					msgContainer.setAttribute("flex", '1');
					msgContainer.setAttribute("style", 'padding-top:3px;');
					msgContainer.appendChild(description)
			}
			else
			{
				var description = this.create('description');
					description.appendChild(this.createText(aString));
					description.setAttribute("wrap", 'true');
				var msgContainer = this.create('vbox');
					msgContainer.setAttribute("flex", '1');
					msgContainer.setAttribute("style", 'padding-top:3px;');
					msgContainer.appendChild(description)
			}
			hbox.appendChild(msgContainer);
		
		
		//the buttons
		var defaultButton = false;
		if(anArrayButtons)
		{
			for(var id in anArrayButtons)
			{
				var toolbarbutton = this.create('button');
					toolbarbutton.setAttribute('label', anArrayButtons[id][0]);
					if(!defaultButton)
					{
						defaultButton = true;
						toolbarbutton.setAttribute('default', 'true');
					//	var focus = toolbarbutton;
					}
					toolbarbutton.setAttribute('oncommand', '('+anArrayButtons[id][1].toString()+')();myExt.removeElement(this.parentNode)');
					toolbarbutton.setAttribute('style', 'font-size:11px;margin-bottom:0px !important;margin-top:0px !important;');
					hbox.appendChild(toolbarbutton);
			}
		}
		//the close button
		var toolbarbutton = this.create('toolbarbutton');
		if(this.isSeaMonkey())
		{
			toolbarbutton.setAttribute('image', 'chrome://myExt/content/lib/forms/notifyTabs/close-seamonkey.png');
			toolbarbutton.setAttribute('style', 'border:1px solid transparent !important;margin:0px !important;padding:0px !important;-moz-appearance: none;margin-right:1px !important');
		}
		else
		{
			toolbarbutton.setAttribute('image', 'chrome://myExt/content/lib/forms/notifyTabs/close-firefox.png');
			toolbarbutton.setAttribute('style', 'border:1px solid transparent !important;margin:0px !important;padding:0px !important;-moz-appearance: none;margin-right:6px !important');
		}
		toolbarbutton.setAttribute('oncommand', 'myExt.removeElement(this.parentNode)');
		hbox.appendChild(toolbarbutton);
		
		//apppending the element to the tabbar
		this.appendToTabbar(hbox);
		//focusing the first button
		//if(focus)
		//	focus.focus();
		//hidding the notification
		if(aTime)
			setTimeout(function(){hbox.setAttribute('hidden', true);}, aTime);
		
		return hbox;
	}