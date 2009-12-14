    	//gets/creates a database and put the connection in a shared object, also define all the custom functions needed to work with the database
	this.databaseGet = function(aDatabase)
	{
		var aDatabaseConn = aDatabase+'.sqlite.connection';

		if(this.sharedObjectExists(aDatabaseConn))
		{
			return this.sharedObjectGet(aDatabaseConn);
		}
		else
		{
				//gets the working directory
				var extensionDirectory = this.extensionDirectory();
				
					extensionDirectory.append(aDatabase+'.sqlite');

				var storageService = Components.classes["@mozilla.org/storage/service;1"]  
											.getService(Components.interfaces.mozIStorageService);  
				var aConnection = storageService.openDatabase(extensionDirectory);
			// our custom database handler
				var object = {};
				//object mapping
				object.name = aDatabase;
				object.file = extensionDirectory;
				object.path = extensionDirectory.path;
				object.aConnection = aConnection;
				object.storageService = storageService;
				//holds references to the queries with some custom propierties
				object.queriesReferences = [];
				//init the object
				object.init = function()
				{
					//vacuum query
						this._vacuum = this.query(<sql>VACUUM</sql>);
					//retreiving the tables names, this is useful to check when a database is imported if all the tables are there.
						this._tables = this.query(<sql>SELECT name FROM sqlite_master WHERE type = "table"</sql>);
				}
				object.vacuum = function()
				{
					this.execute(this._vacuum);
				}
				//opens the connection to the database
				object.open = function()
				{
					try
					{
						this.aConnection = this.storageService.openDatabase(this.file);
						this.init();
					}
					catch(e)
					{
						myExt.dump('Can\'t connect to the database \nSQLITE SAYS:\n\t'+this.aConnection.lastErrorString);
					}
				}
				//finalizes all the statements and close the connection to the database
				object.close = function()
				{
					try{
						for(var id in this.queriesReferences)
						{
							this.queriesReferences[id].query.finalize();
						}
						this.queriesReferences = [];
						this.tables = [];
						this.aConnection.close();
					}
					catch(e)
					{
						myExt.dump('Connection to the database can\'t be closed\nSQLITE SAYS:\n\t'+this.aConnection.lastErrorString);
					}
				}
				//exports a database to a user prompted directory
				object.export = function()
				{
					var aFolder = myExt.fileAskUserFileSave(this.name, 'sqlite');
					if(aFolder)
					{
						this.vacuum();
						myExt.fileCopy(this.path, aFolder.file.path);
					}
				}
				//import a database
				//this should be rewrited, I need to put some field in the datbase that tell me the database version
				//then I will able to manage database updates like importing a database 1.0 in a 4.0 extension
				//all the alter tables and changes, from version to version
				//QQQ to my self
				object.import = function()
				{
					var aFile = myExt.fileAskUserFileOpen(this.name, 'sqlite');
					if(aFile)
					{
						if(myExt.confirm(myExt.getString('are.you.sure')))
						{
							//getting tables names to compare with the new
								var current_tables = [];
								var row;
								while(row = this.fetchObjects(this._tables))
									current_tables[current_tables.length] = row.name;

							//close database
								this.close();
							//backup current first
								this.backup();
							//importing
								myExt.fileCopy(aFile.file.path, this.path);
							//open database
								this.open();
								
							//checking if the database contains all the tables
								var imported_tables = [];
								var row;
								while(row = this.fetchObjects(this._tables))
									imported_tables[imported_tables.length] = row.name;
								
								for(var id in current_tables)
								{
									if(!myExt.inArray(imported_tables, current_tables[id]))
									{
										myExt.dump('There was an attempt to import a database that is not appropriated for this add-on! Reverting the importing...');
										//reverting backup..
											//close database
												this.close();
											//importing
												myExt.fileCopy(this.last_backup_path, this.path);
											//open database
												this.open();
										break;
									}
								}
								
						}
					}
				}
				//backups the database
				object.backup = function()
				{
					this.last_backup_path = this.path+'.backup.'+(myExt.now().replace(/\:/g,'.'))+'.sqlite';
					myExt.fileCopy(this.path, this.last_backup_path);
				}
				//prepare a sql query, get the colum names, save te SQL, define our "params" functino and puts in the object queriesReferences
				object.query = function(query)
				{
					var id = this.queriesReferences.length;
					this.queriesReferences[id] = {};
					this.queriesReferences[id].id = id;
					this.queriesReferences[id].aConnection = this.aConnection;
					
					try{
						this.queriesReferences[id].query = this.aConnection.createStatement(query[0])
					}
					catch(e)
					{/*probably bad wrote of a query*/
						myExt.error('createStatement FAILED:\nQUERY:\n\t'+query[0]+'\nSQLITE SAYS:\n\t'+this.aConnection.lastErrorString);
					};
					this.queriesReferences[id].sql = query[0];
					this.queriesReferences[id].columnNames = {};
					this.queriesReferences[id].paramsValues = {};

					//retreiveing columns names
					var columnNames = [];
					var length = this.queriesReferences[id].query.columnCount; 
					for (var a=0;a<length;a++)
						columnNames[columnNames.length] = this.queriesReferences[id].query.getColumnName(a);
					this.queriesReferences[id].columnNames = columnNames;

					//fill parameters
					this.queriesReferences[id].params = function(aParam, aValue)
					{
						aValue = !aValue ? '' : aValue.toString();
						try
						{
							this.query.params[aParam] = aValue;
							this.paramsValues[aParam] = aValue;
						}
						catch(e)
						{
							//this failed because the query is filled again with parameters but was not "reset"  
							//(this happend when you get just one row with fetchObject)
							this.query.reset();
							try{
								this.query.params[aParam] = aValue;
							}
							catch(e)
							{
								myExt.dump('FILL PARAMS FAILED:\n\tCan\'t fill params:aParam:'+aParam+':aValue:'+aValue+'\nQUERY:\n\t'+this.sql+'\nQUERY VALUES:\n\t'+this.paramsValues.toSource()+'\nSQLITE SAYS:\n\t'+this.aConnection.lastErrorString);
							}
							
							this.paramsValues = {};
							this.paramsValues[aParam] = aValue;
						}
					}
					return this.queriesReferences[id];
				};
				//'create' statements should use this function
				object.create = function(query){try{this.aConnection.executeSimpleSQL(query[0])}catch(e){/*probably bad wrote of a query*/myExt.error('executeSimpleSQL FAILED:\nQUERY:\n\t'+query[0]+'\nSQLITE SAYS:\n\t'+this.aConnection.lastErrorString);}};
				//function mapping
				object.update = function(q, canFail){this.executeStep(q, canFail);	}
				//function mapping
				object.updateAsync = function(q, canFail){this.executeAsync(q, canFail);	}
				//function mapping
				object.insert = function(q, canFail){this.executeStep(q, canFail);}
				//function mapping
				object.insertAsync = function(q, canFail){this.executeAsync(q, canFail);}
				//function mapping
				object.execute = function(q, canFail){this.executeStep(q, canFail);}
				//function mapping
				object.delete = function(q, canFail){this.execute(q, canFail);}
				
				//executes a query Async, canFail is for queries that is spected to fail, like inserting two indentical values in a unique column
				object.executeAsync = function(q, canFail)
				{
					var query = this.queriesReferences[q.id].query;
					if(!canFail)
					{
						try
						{
							query.executeAsync();
						}
						catch(e)
						{
							//if can't fails and fails: output to the console that this query failed
							myExt.dump('QUERY Failed:\n\t'+this.queriesReferences[q.id].sql+'\nQUERY VALUES:\n\t'+this.queriesReferences[q.id].paramsValues.toSource()+'\nSQLITE SAYS:\n\t'+this.aConnection.lastErrorString);
						}
					}
					else
					{
						//this query can fail, fail silenty
						try{query.executeAsync();}catch(e){/*this query can fail (like inserting two indentical values in a unique column), fail silenty*/ }
					}
					//there is no need to reset the query
				}
				//inserts a row and resets the query, canFail is for queries that is spected to fail, like inserting two indentical values in a unique column
				object.executeStep = function(q, canFail)
				{
					var query = this.queriesReferences[q.id].query;
					if(!canFail)
					{
						try
						{
							query.executeStep();
						}
						catch(e)
						{
							//if fails: output to the console that this query failed
							myExt.dump('QUERY Failed:\n\t'+this.queriesReferences[q.id].sql+'\nQUERY VALUES:\n\t'+this.queriesReferences[q.id].paramsValues.toSource()+'\nSQLITE SAYS:\n\t'+this.aConnection.lastErrorString);
						}
					}
					else
					{
						try{query.executeStep();}catch(e){/*this query can fail (like inserting two indentical values in a unique column), fail silenty*/}
					}
					this.queriesReferences[q.id].paramsValues = {};
					query.reset();
				}
				//return row of a query and reset the statement
				object.fetchObject = function(q)
				{
					return this.fetchObjects(q, true);
				}
				//return rows of a query -while(row = fetch()) do something with row
				object.fetchObjects = function(q, resetQuery)
				{
					//gettin query reference
						var query = this.queriesReferences[q.id].query;
						var columnNames = this.queriesReferences[q.id].columnNames;
					//getting result values
						query.executeStep();					
					//build the row, reset the consult if needed and return it
						var row = {};
						for(var id in columnNames)
						{
							try
							{
								row[columnNames[id]] = query.row[columnNames[id]];
							}
							catch(e)
							{
								//there is no more results
								this.queriesReferences[q.id].paramsValues = {};
								query.reset();
								return false;
							}
						}
						if(!resetQuery){}
						else
						{
							this.queriesReferences[q.id].paramsValues = {};
							query.reset();
						}
							
					//return the row
						return row;
				};
				object.init();
				return this.sharedObjectGet(aDatabaseConn, object);
		}
	}