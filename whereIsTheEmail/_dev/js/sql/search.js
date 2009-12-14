		var debugingThisFile = false;//sets debuging on/off for this JavaScript file

		this.searchDomain = function()
		{
			var rowDomain = this.insertDomains(this.removeWWW(this.getSubdomainFromURL(this.documentFocusedGetLocation())));
				
			this.searchDomains.params('domains_id', rowDomain.domains_id);

			var row, aData = '', lastDomain, results = 0, max = 0;
			var search = rowDomain.domains_domain;
			while(row = this.db.fetchObjects(this.searchDomains))
			{
				max++;

					results++;
					if(lastDomain!=row.domains_domain)
					{
						lastDomain = row.domains_domain;
						aData += '</ul><h3>';
						aData += row.domains_domain;
						aData += '</h3><ul>';
					}
					aData += '<li><a href="';
					aData += row.urls_url;
					aData += '">[URL]</a> - ';
					aData += row.emails_date;
					aData += ' - <a href="mailto:';
					aData += this.htmlSpecialCharsEncode(row.emails_email);
					aData += '">';
					aData += this.htmlSpecialCharsEncode(this.decodeUTF8Recursive(row.emails_email));
					aData += '</a></li>';

			}
			if(results>0)
				this.tabOpenEncoded(this.fileCreateTemporal('domainSearch.html',  this.getString('search')+' : '+this.htmlSpecialCharsEncode(search), '<style>body{font-size:12px;font-family:arial;} body a{text-decoration:none;}</style><h2>'+this.getString('num.results').replace('$NUM', results).replace('$MAX', max)+'</h2>'+aData), true);
			else
				this.notifyTab(this.getString('did.not.match.any.email.or.url').replace('$SEARCH', search), 8000);
		}
		this.searchDatabase = function(formData)
		{
			var row, aData = '', lastDomain, results = 0, max = 0;
			var search = formData['form-search-email'];
			while(row = this.db.fetchObjects(this.searchEmails))
			{
				max++;
				if(this.searchEngineSearch(search, row.emails_email+' '+row.urls_url))
				{
					results++;
					if(lastDomain!=row.domains_domain)
					{
						lastDomain = row.domains_domain;
						aData += '</ul><h3>';
						aData += row.domains_domain;
						aData += '</h3><ul>';
					}
					aData += '<li><a href="';
					aData += row.urls_url;
					aData += '">[URL]</a> - ';
					aData += row.emails_date;
					aData += ' - <a href="mailto:';
					aData += this.htmlSpecialCharsEncode(row.emails_email);
					aData += '">';
					aData += this.htmlSpecialCharsEncode(this.decodeUTF8Recursive(row.emails_email));
					aData += '</a></li>';
				}
			}
			if(results>0)
			    this.tabOpenEncoded(this.fileCreateTemporal('emailSearch.html',  this.getString('search')+' : '+this.htmlSpecialCharsEncode(search), '<style>body{font-size:12px;font-family:arial;} body a{text-decoration:none;}</style><h2>'+this.getString('num.results').replace('$NUM', results).replace('$MAX', max)+'</h2>'+aData), true);
			else
			    this.notifyTab(this.getString('did.not.match.any.email.or.url').replace('$SEARCH', search), 8000);
		}
