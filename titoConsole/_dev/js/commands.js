	var debugingThisFile = true;//sets debuging on/off for this JavaScript file
    
	this.command = function(event, aType)
	{
		var string_id = event.originalTarget.parentNode.parentNode.getAttribute('strings_id');
		
		switch(aType)
		{
			case 'string_remove':
			{
				if(this.confirm(this.getString('are.you.sure')))
				{
					this.db.backup();
					this.deleteLogsSQL.params('logs_id_string', string_id);
					this.deleteStringsSQL.params('strings_id', string_id);
					this.deleteBlockedMessageSQL.params('blocked_messages_id_string', string_id);
					this.deleteBlockedURLSQL.params('blocked_urls_id_string', string_id);
					
					this.db.delete(this.deleteLogsSQL);
					this.db.delete(this.deleteStringsSQL);
					this.db.delete(this.deleteBlockedMessageSQL);
					this.db.delete(this.deleteBlockedURLSQL);
					this.db.vacuum();
					
					this.notifyInstances('setStrings');
				}
				break;
			}
			case 'string_edit_string':
			{
				this.formEditString(string_id);
				
				this.notifyInstances('setStrings');
				
				break;
			}
			case 'string_edit_status_block_display':
			{
				
				this.updateStringStatusSQL.params('strings_id', string_id);	
				this.updateStringStatusSQL.params('strings_status', '0');	
				this.db.update(this.updateStringStatusSQL);
    
				this.notifyInstances('setStrings');
				
				break;
			}
			case 'string_edit_status_unblock_display':
			{
				this.updateStringStatusSQL.params('strings_id', string_id);	
				this.updateStringStatusSQL.params('strings_status', 1);	
				this.db.update(this.updateStringStatusSQL);
    
				this.notifyInstances('setStrings');
				
				break;
			}
			case 'string_edit_status_display_alone':
			{
				this.updateStringsStatusSQL.params('strings_status', '0');	
				this.db.update(this.updateStringsStatusSQL);
				
				this.updateStringStatusSQL.params('strings_id', string_id);	
				this.updateStringStatusSQL.params('strings_status', 1);	
				this.db.update(this.updateStringStatusSQL);
    
    
				this.notifyInstances('setStrings');
				
				break;
			}
			case 'log_empty':
			{
				if(this.confirm(this.getString('are.you.sure')))
				{
					this.deleteLogsSQL.params('logs_id_string', string_id);	
					this.db.delete(this.deleteLogsSQL);
					this.db.vacuum();
				}
				break;
			}
			case 'log_view_raw':
			{
			    
			    var rowStrings = this.select(this.selectStringsSQL);
    
    			    var row, aData = '', lastDomain, results = 0, max = 0;
			    var search = rowDomain.domains_domain;
			    while(rowStrings = this.db.fetchObjects(this.searchDomains))
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
					    aData += row.emails_email;
					    aData += '">';
					    aData += this.htmlSpecialCharsEncode(this.decodeUTF8Recursive(row.emails_email));
					    aData += '</a></li>';
			    }
			    if(results>0)
				    this.tabOpenEncoded(this.fileCreateTemporal('domainSearch.html',  this.getString('search')+' : '+this.htmlSpecialCharsEncode(search), '<style>body{font-size:12px;font-family:arial;} body a{text-decoration:none;}</style><h2>'+this.getString('num.results').replace('$NUM', results).replace('$MAX', max)+'</h2>'+aData), true);
			    else
				    this.notifyTab(this.getString('did.not.match.any.email.or.url').replace('$SEARCH', search), 8000);
			    }
			default :
			{
			    
			    /*
			    <menuitem class="menuitem-non-iconic" oncommand="myExt.command(event, 'log_view_raw');" label="View raw log"/>
					<menuitem class="menuitem-non-iconic" oncommand="myExt.command(event, 'log_view_distinct_errors');" label="View distinct errors"/>
					<menuitem class="menuitem-non-iconic" oncommand="myExt.command(event, 'log_view_error_by_type');" label="View errors by type"/>
					<menuitem class="menuitem-non-iconic" oncommand="myExt.command(event, 'log_view_errors_by_url');" label="View errors by URL"/>
					<menuitem class="menuitem-non-iconic" oncommand="myExt.command(event, 'log_view_error_by_error');" label="View errors by error"/>
					<menuitem class="menuitem-non-iconic" oncommand="myExt.command(event, 'log_empty');" label="&myExt.empty.log;"/>
			    */
				this.dump('command:not found:aType:'+aType,debugingThisFile);
				break;
			}
		}
	}
