		var debugingThisFile = true;//sets debuging on/off for this JavaScript file

	//listeners
		this.addListener('browserInstantiated', function (){myExt.myExtBrowserInstantiated()});
		this.addListener('browserLoad', function (){myExt.myExtInit()});
		this.fullyLoaded = false;
		this.db = this.databaseGet('consoleLog');

		this.myExtBrowserInstantiated = function()
		{
			this.dump('myExtBrowserInstantiated', debugingThisFile);
			
			//consoleListener is instantiated 
				//var consoleListenerComponent = Components.classes['@particle.universe.tito/ConsoleListener;2']
				//								.getService().wrappedJSObject;
				//	consoleListenerComponent.init();

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
			this.initListeners();
			this.setStrings();
			this.fullyLoaded = true;
		}
		
