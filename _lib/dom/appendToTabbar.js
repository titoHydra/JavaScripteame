	//appends an element to the tabbar
	this.appendToTabbar = function (anElement)
	{
		var container = this.getElement('appendToTabbar-container')
		if(container)
		{
			if(this.isThereTreeStyleTab())//append the container to the bottom
			{
				container.insertBefore(anElement, container.firstChild);
				this.shortChilds(container, 8, true);
			}
			else
			{
				container.appendChild(anElement);
				this.shortChilds(container, 8);
			}
		}
		else
		{
			container = this.create('hbox');
			
			var subcontainer = this.create('vbox');
			subcontainer.setAttribute('id', 'myExt-appendToTabbar-container');
			
			subcontainer.appendChild(anElement)
			
			if(this.isThereTreeStyleTab())//append the container to the bottom
			{
				var panelcontainer = this.getBrowserElement('status-bar');
				panelcontainer.parentNode.insertBefore(subcontainer, panelcontainer.parentNode.firstChild);
			}
			else
			{
				var panelcontainer = document.getAnonymousElementByAttribute(this.getBrowserElement('content'), "anonid", "panelcontainer");
				panelcontainer.parentNode.insertBefore(subcontainer, panelcontainer.parentNode.lastChild);
			}
		}
	}