			var debugingThisFile = false;//sets debuging on/off for this JavaScript file
		//listeners
			this.addListener('browserInstantiated', function (){myExt.myExtBrowserInstantiated()});
			this.addListener('browserLoad', function (){myExt.myExtInit()});
						
			this.addListener('DOMContentLoadedWithFrames', function (aDoc){myExt.collectEmails(aDoc)});
			this.addListener('onLocationChange', function (aDoc){myExt.updateButton(aDoc)});
			
			this.addListener('onExtensionUninstall', function (){myExt.onExtensionUninstall()});
			
			this.addListener('onPrivateBrowsingEnter', 
							 	function ()
								{
									myExt.preferenceChange('last.enabled', myExt.preferenceGet('enabled'));
									myExt.preferenceChange('enabled', false);
								}
							);
			this.addListener('onPrivateBrowsingExit', 
							 function ()
							 {
								 myExt.preferenceChange('enabled', myExt.preferenceGet('last.enabled'));
							 });

			this.addListener('onIdle', function (){myExt.db.vacuum();});

		//shutdown
			this.addShutDown(function(){ myExt.removeMenu();});

		/* global */
			this.alreadyParsedDocuments = this.sharedObjectGet('alreadyParsedDocuments');
			this.db = this.databaseGet('whereIsTheEmail');
		
		this.myExtBrowserInstantiated = function()
		{
			this.dump('myExtBrowserInstantiated', debugingThisFile);
			//create tables for database
			this.createTables();
			if(this.preferenceGet('last.db.backup') != this.date())
			{
				this.preferenceSet('last.db.backup', this.date());
				this.db.backup();
			}
		}
		
		this.myExtInit = function()
		{
			this.dump('myExtInit', debugingThisFile);
			
			this.initStatements();
			
			this.updateState();
			this.initListeners();			
		}
		//called when the extension is disabled or uninstalled
		this.onExtensionUninstall = function(aSubject)
		{
			if(this.confirm(this.getString('detected.extension.uninstall.disable.wants.delete.extension.data')))
			{
				this.db.close();
				this.extensionDirectoryClean();
			}
		}
		//called when the extension is disabled or enabled from the context menu or from about:config
		//also called when a new window is opened
		this.updateState = function()
		{
			this.dump('updateState', debugingThisFile);
			
			if(this.preferenceGet('enabled'))
			{
				this.getElement('button-context-extension-stop').setAttribute('hidden', false);
				this.getElement('button-context-extension-start').setAttribute('hidden', true);
				//updating button status
				this.collectEmails(this.documentGetFocused());
				this.updateButton(this.documentGetFocused());
			}
			else
			{
				//updating context menu options
				this.getElement('button-context-extension-stop').setAttribute('hidden', true);
				this.getElement('button-context-extension-start').setAttribute('hidden', false);
				//updating button status
				this.getElement('button').setAttribute('status', 'extension_disabled');
				this.getElement('button').setAttribute('tooltiptext', this.getElement('button').getAttribute('tooltiptext_disabled'));
			}
		}
		//removes the button from the urlbar
		this.removeMenu = function()
		{
			this.dump('removeMenu', debugingThisFile);
			this.removeElement(this.getElement('button'));
		}
		//updates the state of the button when the location change
		this.updateButton = function(aDoc)
		{
			this.dump('updateButton', debugingThisFile);
			
			//resets menuopup - need to build the menu again
			this.getElement('menu').removeAttribute('last');

			if(!aDoc)
				aDoc = this.documentGetFocused();
			var location =  this.documentGetLocation(aDoc);
			var subdomain = this.removeWWW(this.getSubdomainFromURL(location));
			
			var button = this.getElement('button');
			
			if( !this.isGarbage(location) )
			{
				var row = this.getRowDomain(subdomain);
				
				if(!this.preferenceGet('enabled'))
				{
					button.setAttribute('status', 'extension_disabled');
					button.setAttribute('tooltiptext', button.getAttribute('tooltiptext_disabled'));
				}
				else if(!row || (row.domains_email_count == 0 && row.domains_status == 1))
				{
					button.setAttribute('status', 'emails_not_found');
					button.setAttribute('tooltiptext', button.getAttribute('tooltiptext_not_found'));
				}
				else if(row.domains_status == 0)
				{
					button.setAttribute('status', 'domain_disabled');
					button.setAttribute('tooltiptext', button.getAttribute('tooltiptext_for_domain').replace('$DOMAIN', subdomain));
				}
				else
				{
					button.setAttribute('status', 'emails_found');
					button.setAttribute('tooltiptext', button.getAttribute('tooltiptext_found').replace('$NUM', row.domains_email_count));
				}
				button.setAttribute('hidden', false);
			}
			else
			{
				button.setAttribute('hidden', true);
			}
		}
		//builds the menu with the emails, cache the last build and rebuilds if needed ( example when one mail is added or when the domain change )
		this.showMenu = function()
		{
			if(!this.preferenceGet('enabled'))
				return;

			this.dump('showMenu', debugingThisFile);
			
			var menu = this.getElement('menu');
		
		//if there is a need for refresh the menu
			var last = menu.getAttribute('last');
			
			var domain = this.removeWWW(this.getSubdomainFromURL(this.documentFocusedGetLocation()));
			if(last == domain)
			{
				if(menu.getAttribute('hidden') == 'false')
					menu.openPopup(this.getElement('button') , 'after_end');
				return;
			}
			this.dump('showMenu:buildingMenu', debugingThisFile);
			var rowDomain = this.getRowDomain(domain);
			if(!rowDomain)
				return;
		//refreshing menu
			menu.setAttribute('last', domain);
			this.removeChilds(menu);
			var empty = true;
			var row;
			this.selectEmails.params('domains_id', rowDomain.domains_id);
			while(row = this.db.fetchObjects(this.selectEmails))
			{
				empty = false;
				var add = this.create('menuitem');
				add.setAttribute('label', this.decodeUTF8Recursive(row.emails_email));
				add.setAttribute('emails_email', row.emails_email);
				add.setAttribute('emails_url', row.urls_url);
				add.setAttribute('emails_id', row.emails_id);
				add.setAttribute('tooltiptext', this.decodeUTF8Recursive(row.urls_url));
				add.setAttribute('class', 'menuitem-non-iconic');
				menu.appendChild(add);
			}
			menu.setAttribute('hidden', empty);
			if(!empty)
				menu.openPopup(this.getElement('button'), 'after_end');
		}
		//put the domain names on the context menus
		this.contextUpdate = function()
		{
			this.dump('buttonContextUpdate', debugingThisFile);
			
			var button = this.getElement('button');
			var domain = this.removeWWW(this.getSubdomainFromURL(this.documentFocusedGetLocation()));
			
			var row = this.getRowDomain(domain);
			
			if(!row || row.domains_status == 1)
			{
				this.getElement('button-context-domain-stop').setAttribute('hidden', false);
				this.getElement('button-context-domain-start').setAttribute('hidden', true);
				
				this.getElement('button-context-domain-stop').setAttribute('label', this.getElement('button-context-domain-stop').getAttribute('original_label').replace('$DOMAIN', domain));
			}
			else
			{
				this.getElement('button-context-domain-stop').setAttribute('hidden', true);
				this.getElement('button-context-domain-start').setAttribute('hidden', false);
				
				this.getElement('button-context-domain-start').setAttribute('label', this.getElement('button-context-domain-start').getAttribute('original_label').replace('$DOMAIN', domain));
			}
			this.getElement('button-context-add-to-domain').setAttribute('label', this.getElement('button-context-add-to-domain').getAttribute('original_label').replace('$DOMAIN', domain));
			this.getElement('button-context-add-selected-to-domain').setAttribute('label', this.getElement('button-context-add-selected-to-domain').getAttribute('original_label').replace('$DOMAIN', domain));
			this.getElement('button-context-copy-selected').setAttribute('label', this.getElement('button-context-copy-selected').getAttribute('original_label').replace('$DOMAIN', domain));
			
			if(this.getSelectedText(true) != '')
			{
				this.getElement('button-context-add-selected-to-domain').setAttribute('disabled', false);
				this.getElement('button-context-copy-selected').setAttribute('disabled', false);
			}
			else
			{
				this.getElement('button-context-add-selected-to-domain').setAttribute('disabled', true);
				this.getElement('button-context-copy-selected').setAttribute('disabled', true);
			}
			
			this.getElement('menu-context-delete-from-domain').setAttribute('label', this.getElement('menu-context-delete-from-domain').getAttribute('original_label').replace('$DOMAIN', domain));
			this.getElement('menu-context-view-all-from-domain').setAttribute('label', this.getElement('menu-context-view-all-from-domain').getAttribute('original_label').replace('$DOMAIN', domain));
			
			//I don't know why but something is setting the heigth attribute of my context menu to 0;
			this.getElement('button-context-menu').removeAttribute('height');
			this.getElement('menu-context-menu').removeAttribute('height');
		}
		this.getEmailsFromMenu = function()
		{
			var menu = this.getElement('menu');
			var emails = [];
			for(var a=0;a<menu.childNodes.length;a++)
				emails[emails.length] = menu.childNodes[a].getAttribute('emails_email');
			return emails;
		}
		this.getEmailsFromMenuRemoveVars = function()
		{
			var menu = this.getElement('menu');
			var emails = [];
			for(var a=0;a<menu.childNodes.length;a++)
				emails[emails.length] = menu.childNodes[a].getAttribute('emails_email').replace(/^([^\?]+).*/, '$1');
			return emails;
		}
