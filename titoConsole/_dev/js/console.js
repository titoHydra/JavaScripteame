		var debugingThisFile = false;//sets debuging on/off for this JavaScript file

		this.alert = function(error)
		{
			//is the extension disabled?
				if(!this.preferenceGet('enabled'))
					return;
					
			//find this error in the string list
				var strings_id = false;
				var strings_status = 0;
				
				for(var id in this.strings)
				{
					if(this.searchEngineSearch(this.strings[id].strings_string, (this.trim(error.errorMessage) || this.trim(error.message))))
					{	
						strings_id 		= this.strings[id].strings_id;
						strings_status  = this.strings[id].strings_status;
						//if strings_status == 0 will hide the display message
						//this will premit found (maybe) another strings that really want show the message
						if(strings_status==1)
							break;
					}
				}
				if(!strings_id)
					return;
				
				var rowMessage 		= this.insertMessage(error.errorMessage || error.message);
				var rowSourceName 	= this.insertSourceName( error.sourceName || '');
				var rowSourceLine 	= this.insertSourceLine( error.sourceLine || '');
				var rowCategory 	= this.insertCategory(error.category || '');
				
				
			//logging the error to the database
				this.insertLogSQL.params('logs_id_string', strings_id);
				this.insertLogSQL.params('logs_id_message', rowMessage.messages_id);
				this.insertLogSQL.params('logs_id_source_name', rowSourceName.source_names_id);
				this.insertLogSQL.params('logs_id_source_line', rowSourceLine.source_lines_id);
				this.insertLogSQL.params('logs_line_number', error.lineNumber || 0);
				this.insertLogSQL.params('logs_column_number', error.columnNumber || 0);
				this.insertLogSQL.params('logs_flags', error.flags || '');
				this.insertLogSQL.params('logs_id_category', rowCategory.categories_id);
				this.insertLogSQL.params('logs_error_flag', error.errorFlag || '');
				this.insertLogSQL.params('logs_warning_flag', error.warningFlag || '');
				this.insertLogSQL.params('logs_exception_flag', error.exceptionFlag || '');
				this.insertLogSQL.params('logs_strict_flag', error.strictFlag || '');
				
				this.db.insertAsync(this.insertLogSQL, false);
				
			//is the display of all errors disabled?? or the display for this string disabled
			
				if(!this.preferenceGet('enabled.display') || strings_status == 0)
					return;		
				
			//check if the message is bloqued
				var rowBlockedMessage = this.getBlockedMessage(strings_id,rowMessage.messages_id);
				if(!rowBlockedMessage){}
				else
					return;
			//check if the URL#09 is bloqued
				var rowBlockedURL = this.getBlockedURL(strings_id,rowSourceName.source_names_id,(error.lineNumber || 0));
				if(!rowBlockedURL){}
				else
					return;

		/*building the tabbar row*/
			var hbox = this.create('hbox');
				hbox.setAttribute("flex", '1');
			// the error message
				var description = this.create('description');
					description.appendChild(this.createText(this.decodeUTF8Recursive(error.errorMessage || error.message)));
					description.setAttribute("wrap", 'true');
	
				var vbox = this.create('vbox');
					vbox.setAttribute("flex", '1');
					vbox.setAttribute("align", 'left');
					vbox.appendChild(description);
			
				var hbox2 = this.create('hbox');
					hbox2.setAttribute("flex", '1');
					hbox2.appendChild(vbox);
					
					hbox.appendChild(hbox2);
				
			//if is not a message (dump) the sourcename and the line number
				if(error.errorMessage)
				{
					var description = this.create('description');
						description.setAttribute('value', 		this.removeWWW(this.removeSchema(this.decodeUTF8Recursive(error.sourceName ? (error.sourceName).replace('chrome://', 'ch:')+(error.lineNumber ? '#'+error.lineNumber : '') : ''))));
						description.setAttribute('tooltiptext', this.decodeUTF8Recursive(error.sourceName ? error.sourceName+(error.lineNumber ? '#'+error.lineNumber : '') : ''));
						description.setAttribute('href', error.sourceName ? error.sourceName : '');
						description.setAttribute('class', 'text-link');
						description.setAttribute('style', 'text-decoration:none');
						description.setAttribute('onclick', 'openDialog("chrome://global/content/viewSource.xul", "_blank", "all,dialog=no", this.getAttribute("href"), null, null, this.getAttribute("line"));');
						description.setAttribute('line', error.lineNumber || 0);
						description.setAttribute('width', '300');
						description.setAttribute('crop', 'center');
						
					var vbox = this.create('hbox');
						vbox.appendChild(description);
					hbox.appendChild(vbox);
					
					//the image
					if(String(error).indexOf('Warning') != -1)
						var type = 'warning';
					else if(String(error).indexOf('Error') != -1)
						var type = 'error';
				}
				else
				{
					var type = 'info';
				}
			
			var buttons = [];
			
			var button = [];
				button[0] = this.getString('block.message');
				button[1] = 'function(){if(myExt.confirm(myExt.getString(\'are.you.sure\'))){myExt.insertBlockedMessage('+strings_id+','+rowMessage.messages_id+');}}';
				
			buttons[buttons.length] = button;
			
			var button = [];
				button[0] = this.getString('block.URL09');
				button[1] = 'function(){if(myExt.confirm(myExt.getString(\'are.you.sure\'))){myExt.insertBlockedURL('+strings_id+','+rowSourceName.source_names_id+','+(error.lineNumber || 0)+');}}';
				
			buttons[buttons.length] = button;
			
			this.notifyTabs(hbox, type, buttons);//4000
		}