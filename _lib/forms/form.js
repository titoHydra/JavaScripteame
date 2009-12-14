	//creates and shows in the middle of the screen a custom pannel (form) with N xul elements and buttons
	this.form = function(anID, aTitle, anArrayXUL, anArrayButtons, rebuild, noautohide)
	{
		var idPanel = this.sha256(anID);
		var panel = this.getBrowserElement('myExt-panel-'+idPanel);
		//if the panel exists just show the panel
		if(panel)
		{
			//if the panel show be re buileded
			if(rebuild)
			{
				this.removeElement(panel);
			}
			else
			{
				this.promptCenter(panel);
				return;
			}
		}
		//panel
		var panel = this.create('vbox');
			panel.setAttribute('height', 100);
			panel.setAttribute('width', 400);
			panel.setAttribute('style', 'padding:8px;');
		//title
			var hbox = this.create('hbox');
				hbox.setAttribute('style', 'border-bottom:1px black groove;margin-bottom:7px;');
			var toolbarbutton = this.create('toolbarbutton');
				toolbarbutton.setAttribute('image', '__ICON_URI16__');
				toolbarbutton.setAttribute('label', aTitle);
				toolbarbutton.setAttribute('style', 'padding:0px;border:0px;margin:0px;font-size:16px;');
				var spacer = this.create('spacer');
					spacer.setAttribute('flex', 1);
				hbox.appendChild(toolbarbutton);
				hbox.appendChild(spacer);

			panel.appendChild(hbox);

		//XULs
			if(anArrayXUL)
			{
				for(var id in anArrayXUL)
				{
					anArrayXUL[id].setAttribute('style', 'margin-bottom:8px;'+anArrayXUL[id].getAttribute('style'));
					panel.appendChild(anArrayXUL[id]);
				}
			}
		
		//buttons container
			var hbox = this.create('hbox');
				hbox.setAttribute('style', 'margin-top:10px;margin-bottom:3px;');
			var spacer = this.create('spacer');
				spacer.setAttribute('flex', 1);
			hbox.appendChild(spacer);
			//buttons
				var defaultButton = false;
				if(anArrayButtons)
				{
					for(var id in anArrayButtons)
					{
						var button = this.create('button');
							button.setAttribute('label', anArrayButtons[id][0]);
							if(!anArrayButtons[id][1])
								button.setAttribute('oncommand', 'this.parentNode.parentNode.parentNode.hidePopup();');
							else
								button.setAttribute('oncommand', 'this.parentNode.parentNode.parentNode.hidePopup();('+anArrayButtons[id][1].toString()+')(myExt.formValues(this.parentNode.parentNode.parentNode));');
						if(!defaultButton)
						{
							defaultButton = true;
							button.setAttribute('default', 'true');
						}
						hbox.appendChild(button);

					}
				}
			panel.appendChild(hbox);

		//real panel
		var container = this.create('panel');
			container.setAttribute('id', 'myExt-panel-'+idPanel);
			
			//to noautohide at least one button should be present
			if(noautohide && anArrayButtons)
				container.setAttribute('noautohide', true);
			container.setAttribute('noautofocus', true);
			//focus the first textbox
			container.setAttribute('onpopupshown', 'try{this.getElementsByTagName("textbox")[0].focus();}catch(e){}this.addEventListener("keypress", function(event){if(event.keyCode == event.DOM_VK_RETURN){this.getElementsByTagName("button")[0].click()}}, false);');
			container.setAttribute('onpopuphiding', 'this.removeEventListener("keypress", function(event){if(event.keyCode == event.DOM_VK_RETURN){this.getElementsByTagName("button")[0].click()}}, false);');
			
			container.appendChild(panel);
			this.getBrowserElement('main-window').appendChild(container);
		//open panel
		var aDoc = window.document;		
		container.openPopup(null, '', 
							((this.screenGetDocumentW(aDoc)-container.firstChild.width)/2)-3, //3 = padding prompt panel~
							//((this.screenGetDocumentW(aDoc)-container.popupBoxObject.width)/2)-3, //3 = padding prompt panel~
							((this.screenGetDocumentH(aDoc))/4)+20, false, false);
	 }