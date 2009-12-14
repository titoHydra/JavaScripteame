		var debugingThisFile = false;//sets debuging on/off for this JavaScript file
	
/*STRINGS*/
		this.setStrings = function()
		{
			this.strings = [];
			var row;
			while(row = this.db.fetchObjects(this.selectStringsSQL))
			{
				this.strings[this.strings.length] = row;
			}
		}
		this.insertString = function(aString)
		{
			this.dump('insertString', debugingThisFile);

			//insert unique domain values
				this.insertStringSQL.params('strings_string', aString);
				this.db.insert(this.insertStringSQL, true);
				
			return this.getRowString(aString);
		}
		this.getRowString = function(aString)
		{
			this.dump('getRowString', debugingThisFile);
			
				this.selectStringSQL.params('strings_string', aString);
				return this.db.fetchObject(this.selectStringSQL);
		}
		this.getRowStringID = function(anID)
		{
			this.dump('getRowStringID', debugingThisFile);
			
				this.selectStringIDSQL.params('strings_id', anID);
				return this.db.fetchObject(this.selectStringIDSQL);
		}
		this.updateString = function(aString, anID)
		{
			this.dump('updateString', debugingThisFile);

			//insert unique domain values
				this.updateStringSQL.params('strings_string', aString);
				this.updateStringSQL.params('strings_id', anID);
				this.db.update(this.updateStringSQL);
				
			return this.getRowString(aString);
		}
/*MESSAGES*/
		this.insertMessage = function(aString)
		{
			this.dump('insertMessage', debugingThisFile);

				this.insertMessageSQL.params('messages_message', aString);
				this.db.insert(this.insertMessageSQL, true);
				
			return this.getRowMessage(aString);
		}
		this.getRowMessage = function(aString)
		{
			this.dump('getRowMessage', debugingThisFile);
			
				this.selectMessageSQL.params('messages_message', aString);
				return this.db.fetchObject(this.selectMessageSQL);
		}
/*SOURCE_NAMES*/
		this.insertSourceName = function(aString)
		{
			this.dump('insertSourceName', debugingThisFile);

				this.insertSourceNameSQL.params('source_names_name', aString);
				this.db.insert(this.insertSourceNameSQL, true);
				
			return this.getRowSourceName(aString);
		}
		this.getRowSourceName = function(aString)
		{
			this.dump('getRowSourceName', debugingThisFile);
			
				this.selectSourceNameSQL.params('source_names_name', aString);
				return this.db.fetchObject(this.selectSourceNameSQL);
		}
/*SOURCE_LINES*/
		this.insertSourceLine = function(aString)
		{
			this.dump('insertSourceLine', debugingThisFile);

				this.insertSourceLineSQL.params('source_lines_line', aString);
				this.db.insert(this.insertSourceLineSQL, true);
				
			return this.getRowSourceLine(aString);
		}
		this.getRowSourceLine = function(aString)
		{
			this.dump('getRowSourceLine', debugingThisFile);
			
				this.selectSourceLineSQL.params('source_lines_line', aString);
				return this.db.fetchObject(this.selectSourceLineSQL);
		}
/*CATEGORIES*/
		this.insertCategory = function(aString)
		{
			this.dump('insertCategory', debugingThisFile);

				this.insertCategorySQL.params('categories_category', aString);
				this.db.insert(this.insertCategorySQL, true);
				
			return this.getRowCategory(aString);
		}
		this.getRowCategory = function(aString)
		{
			this.dump('getRowCategory', debugingThisFile);
			
				this.selectCategorySQL.params('categories_category', aString);
				return this.db.fetchObject(this.selectCategorySQL);
		}

/*blocked messages*/
		this.insertBlockedMessage = function(aIDString, aIDMessage)
		{
			this.dump('insertBlockedMessage', debugingThisFile);

				this.insertBlockedMessageSQL.params('blocked_messages_id_message', aIDMessage);
				this.insertBlockedMessageSQL.params('blocked_messages_id_string', aIDString);
				this.db.insert(this.insertBlockedMessageSQL, true);
				
			return this.getBlockedMessage(aIDString, aIDMessage);
		}
		this.getBlockedMessage = function(aIDString, aIDMessage)
		{
			this.dump('getBlockedMessage', debugingThisFile);
			
				this.selectBlockedMessageSQL.params('blocked_messages_id_message', aIDMessage);
				this.selectBlockedMessageSQL.params('blocked_messages_id_string', aIDString);
				return this.db.fetchObject(this.selectBlockedMessageSQL);
		}


/*blocked URLS*/
		this.insertBlockedURL = function(aIDString, aIDURL, aLineNumber)
		{
			this.dump('insertBlockedURL', debugingThisFile);

				this.insertBlockedURLSQL.params('blocked_urls_id_url', aIDURL);
				this.insertBlockedURLSQL.params('blocked_urls_id_string', aIDString);
				this.insertBlockedURLSQL.params('blocked_urls_line', aLineNumber);
				this.db.insert(this.insertBlockedURLSQL, true);
				
			return this.getBlockedURL(aIDString, aIDURL, aLineNumber);
		}
		this.getBlockedURL = function(aIDString, aIDURL, aLineNumber)
		{
			this.dump('getBlockedURL', debugingThisFile);
			
				this.selectBlockedURLSQL.params('blocked_urls_id_url', aIDURL);
				this.selectBlockedURLSQL.params('blocked_urls_id_string', aIDString);
				this.selectBlockedURLSQL.params('blocked_urls_line', aLineNumber);
				return this.db.fetchObject(this.selectBlockedURLSQL);
		}

