		var debugingThisFile = false;//sets debuging on/off for this JavaScript file

		this.command = function(event, aType)
		{
			switch(aType)
			{
				case 'database_empty':
				{
					if(this.confirm(this.getString('are.you.sure')))
					{
						this.db.backup();
						this.db.delete(this.deleteEmails);
						this.db.delete(this.deleteURLs);
						this.db.delete(this.deleteDomains);
						this.db.vacuum();
						this.alreadyParsedDocuments = {};
						this.notifyInstances('updateButton');
					}
					break;
				}
				case 'email_copy_all':
				{
					this.copyToClipboard(this.getEmailsFromMenu().join(this.__NEW_LINE__));
					break;
				}
				case 'email_compose_to':
				{
					if(event.originalTarget.getAttribute('emails_email') != '')
						this.openURI('mailto:'+event.originalTarget.getAttribute('emails_email'));
					else
						this.openURI('mailto:'+document.popupNode.getAttribute('emails_email'));
						
					break;
				}
				case 'email_compose_to_all':
				{
					this.openURI('mailto:'+this.getEmailsFromString(this.getEmailsFromMenuRemoveVars().join(',')).join(','));
					break;
				}
				case 'extension_stop':
				{
					this.preferenceChange('enabled', false);
					break;
				}
				case 'extension_start':
				{
					this.preferenceChange('enabled', true);
					break;
				}
				case 'domain_block':
				{
					var rowDomain = this.insertDomains(this.removeWWW(this.getSubdomainFromURL(this.documentFocusedGetLocation())));
					
					this.updateDomainStatus.params('domains_status', 0);//domain blocked
					this.updateDomainStatus.params('domains_id', rowDomain.domains_id);
					this.db.updateAsync(this.updateDomainStatus);
					this.notifyInstances('updateButton');
					break;
				}
				case 'domain_unblock':
				{
					var rowDomain = this.insertDomains(this.removeWWW(this.getSubdomainFromURL(this.documentFocusedGetLocation())));
					
					this.updateDomainStatus.params('domains_status', 1);//domain unblocked
					this.updateDomainStatus.params('domains_id', rowDomain.domains_id);
					this.db.updateAsync(this.updateDomainStatus);
					this.notifyInstances('updateButton');
					break;
				}
				case 'email_delete_from_domain':
				{
					if(this.confirm(this.getString('are.you.sure')))
					{
						var rowDomain = this.insertDomains(this.removeWWW(this.getSubdomainFromURL(this.documentFocusedGetLocation())));
						
						this.updateEmailsStatus.params('emails_id_domain', rowDomain.domains_id);
						this.db.updateAsync(this.updateEmailsStatus);
						//update email count
						this.updateEmailCount.params('domains_id', rowDomain.domains_id);
						this.db.updateAsync(this.updateEmailCount);
						this.notifyInstances('updateButton');
					}
					break;
				}
				case 'email_open_page':
				{
					this.tabOpenEncoded(document.popupNode.getAttribute('emails_url'),true);
					break;
				}
				case 'email_copy':
				{
					this.copyToClipboard(document.popupNode.getAttribute('emails_email'));
					break;
				}
				case 'email_delete':
				{
					if(this.confirm(this.getString('are.you.sure')))
					{
						var rowDomain = this.insertDomains(this.removeWWW(this.getSubdomainFromURL(this.documentFocusedGetLocation())));
						//deleting emails
						this.updateEmailStatus.params('emails_id', document.popupNode.getAttribute('emails_id'));
						this.db.updateAsync(this.updateEmailStatus);
						//updating count of emails
						this.updateEmailCount.params('domains_id', rowDomain.domains_id);
						this.db.updateAsync(this.updateEmailCount);
						this.notifyInstances('updateButton');
					}
					break;
				}
				case 'emails_add_selected':
				{
					var emails = this.getEmailsFromString(this.getSelectedText(true)+','+this.getSelectedLinksURLs(true).join(','));
					
					if(emails.length)
					{
						var location = this.documentFocusedGetLocation();
						var rowDomain = this.insertDomains(this.removeWWW(this.getSubdomainFromURL(location)));
						//resets menuopup - one email added for this domain = need to build the menu again
						this.getElement('menu').removeAttribute('last');
						
						var rowUrl = this.insertURLs(location);

						for(var id in emails)
						{
							//insert unique emails Async
							this.insertEmail.params('emails_id_domain', rowDomain.domains_id);
							this.insertEmail.params('emails_id_url', rowUrl.urls_id);
							this.insertEmail.params('emails_email', emails[id]);
							this.db.insertAsync(this.insertEmail, true);
						}
						this.updateEmailCount.params('domains_id', rowDomain.domains_id);
						this.db.updateAsync(this.updateEmailCount);
						this.notifyInstances('updateButton');
					}
					break;
				}
				case 'emails_copy_selected':
				{
					var emails = this.getEmailsFromString(this.getSelectedText(true)+','+this.getSelectedLinksURLs(true).join(','));

					if(emails.length)
					{
						this.copyToClipboard(emails.join(this.__NEW_LINE__));
					}
					break;
				}
				case 'email_add':
				{
					var location = this.documentFocusedGetLocation();
					var rowDomain = this.insertDomains(this.removeWWW(this.getSubdomainFromURL(location)));
					
					//building the form
						//xul content
							var aLabel =  this.createFormLabel(this.getString('add.new.email.example'));
							var aTextbox = this.createTextbox('form-add-email');
	
						//butons
						var buttons = [];
							
							var button = [];
								button[0] = this.getString('save');
								button[1] = function(formData){ myExt.saveEmailsFromForm(formData) };
								
							buttons[buttons.length] = button;
							
							var button = [];
								button[0] = this.getString('close');
						
							buttons[buttons.length] = button;
	
						this.form('email_add', this.getString('add.new.email.to.domain').replace('$DOMAIN', rowDomain.domains_domain), [aLabel,aTextbox], buttons, true);
						break;
				}
				case 'email_search' :
				{
					//building the form
						//xul content
							var aLabel =  this.createFormLabel(this.getString('search.email.example'));
							var aTextbox = this.createTextbox('form-search-email');
	
						//butons
						var buttons = [];
							
							var button = [];
								button[0] = this.getString('search');
								button[1] = function(formData){ myExt.searchDatabase(formData) };
								
							buttons[buttons.length] = button;
							
							var button = [];
								button[0] = this.getString('close');
						
							buttons[buttons.length] = button;
	
						this.form('email_search', this.getString('search.for.an.email.in.the.database'), [aLabel, aTextbox], buttons, true);
					break;
				}
				case 'email_view_all_from_domain':
				{
					this.searchDomain();
					break;
				}
				case 'database_export':
				{
					this.db.export(); 
					break;
				}
				case 'database_import':
				{
					this.db.import();
					this.alreadyParsedDocuments = {};
					this.notifyInstances('initStatements');
					this.notifyInstances('updateButton');
					break;
				}
			}
		}
