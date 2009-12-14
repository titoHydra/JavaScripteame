		var debugingThisFile = false;//sets debuging on/off for this JavaScript file

		this.insertDomains = function(aDomain)
		{
			this.dump('insertDomains', debugingThisFile);

			//insert unique domain values
				this.insertDomain.params('domains_domain', aDomain);
				this.db.insert(this.insertDomain, true);
				
			return this.getRowDomain(aDomain);
		}
		this.getRowDomain = function(aDomain)
		{
			this.dump('getRowDomain', debugingThisFile);
			
				this.selectDomain.params('domains_domain', aDomain);
				return this.db.fetchObject(this.selectDomain);
		}
		this.insertURLs = function(aURL)
		{
			this.dump('insertURLs', debugingThisFile);

				this.insertURL.params('urls_url', aURL);
				this.db.insert(this.insertURL, true);

			return this.getRowURL(aURL);
		}
		this.getRowURL = function(aURL)
		{
			this.dump('getRowURL', debugingThisFile);

				this.selectURL.params('urls_url', aURL);
				return this.db.fetchObject(this.selectURL);
		}
