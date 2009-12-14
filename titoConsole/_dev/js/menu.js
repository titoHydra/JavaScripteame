		var debugingThisFile = false;//sets debuging on/off for this JavaScript file

		this.menuUpdate = function(event, item)
		{
			//skip submenus
			if(item != event.originalTarget)
				return;
			
			if(this.preferenceGet('enabled'))
			{
				this.getElement('menu-console-alert-enable').setAttribute('hidden', true);
				this.getElement('menu-console-alert-disable').setAttribute('hidden', false);
			}
			else
			{
				this.getElement('menu-console-alert-enable').setAttribute('hidden', false);
				this.getElement('menu-console-alert-disable').setAttribute('hidden', true);
			}
			
			if(this.preferenceGet('enabled.display'))
			{
				this.getElement('menu-alert-box-open').setAttribute('hidden', true);
				this.getElement('menu-alert-box-close').setAttribute('hidden', false);	
			}
			else
			{
				this.getElement('menu-alert-box-open').setAttribute('hidden', false);
				this.getElement('menu-alert-box-close').setAttribute('hidden', true);	
			}
			this.removeChilds(this.getElement('menu'));
			
			var menu_template = this.getElement('menu-template');
			
			for(var id in this.strings)
			{
				var menu = menu_template.cloneNode(true);
					menu.setAttribute('label', this.strings[id].strings_string);
					menu.setAttribute('strings_id', this.strings[id].strings_id);
					menu.removeAttribute('hidden');
					menu.removeAttribute('locked');
					if(this.strings[id].strings_status == 1)
					{
						menu.firstChild.firstChild.setAttribute('hidden', false);
						menu.firstChild.firstChild.nextSibling.setAttribute('hidden', true);
					}
					else
					{
						menu.firstChild.firstChild.setAttribute('hidden', true);
						menu.firstChild.firstChild.nextSibling.setAttribute('hidden', false);
					}
					
				menu_template.parentNode.insertBefore(menu, menu_template);
			}
			var menuseparator = this.create('menuseparator');
				menu_template.parentNode.insertBefore(menuseparator, menu_template);
		}
