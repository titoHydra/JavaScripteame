		var debugingThisFile = false;//sets debuging on/off for this JavaScript file

		this.saveEmailsFromForm = function(formData)
		{
			var emails = this.getEmailsFromString(formData['form-add-email']);

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
		}
		//saves the emails to the database
		this.collectEmails= function(aDoc)
		{
			if(!this.preferenceGet('enabled'))
				return;

			this.dump('collectEmails', debugingThisFile);

			var location = this.documentGetTopLocation(aDoc);
			var location_hash = this.sha256(location);

			if(!this.alreadyParsedDocuments[location_hash])
			{
				this.alreadyParsedDocuments[location_hash] = true;

				var subdomain = this.removeWWW(this.getSubdomainFromURL(location));

				if( !this.isGarbage(location) )
				{
					var rowDomain = this.getRowDomain(subdomain);
					if(!rowDomain || rowDomain.domains_status == 1)
					{
						var emails = this.getEmailsFromDocLinks(aDoc);

						if(emails.length)
						{
							var rowDomain = this.insertDomains(subdomain);
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
						}
					}
				}
			}
		}
