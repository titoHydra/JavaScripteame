			var debugingThisFile = false;//sets debuging on/off for this JavaScript file
			
		//listeners
			this.addListener('browserLoad', function (){myExt.myExtInit()});
			this.addListener('tabContextMenuShowing', function(){myExt.updateMenu()});
		//shutdown
			this.addShutDown(function(){ myExt.removeMenu();});

		//init the extension
		this.myExtInit = function ()
		{
			this.dump('myExtInit', debugingThisFile);
			//adds the menu to the context menu
			this.addMenu();
			//init the listeners
			this.initListeners();
		};
		//adds the menu to the tab context menu
		this.addMenu = function()
		{
			this.dump('addMenu', debugingThisFile);
			this.tabContextMenu().appendChild(this.getElement('sort-tabs-by-url'));
		}
		//remove the menu from the tab context menu
		this.removeMenu = function()
		{
			this.dump('removeMenu', debugingThisFile);
			this.removeElement(this.getElement('sort-tabs-by-url'));
		}
		//disable the menu when there is just one tab
		this.updateMenu = function ()
		{
			this.dump('updateMenu', debugingThisFile);
			if(this.tabCount() > 1)
				this.getElement('sort-tabs-by-url').setAttribute('disabled', false);
			else
				this.getElement('sort-tabs-by-url').setAttribute('disabled', true);
		};
		//sort the tabs
		this.sort = function (type)
		{
			var numTabs, lastTab, arrayTabs, duplicates, uniqueTabs, allreadyMovedTabs=0, tmpURL, closeTabs;
			
			numTabs = this.tabCount();
		
			if(numTabs>1)
			{
					this.decodeURLCache = [];
				//want close blank tabs?
					if(this.preferenceGet('close.blank.tabs'))
					{
						closeTabs = Array();
						for(var a = 0; a < numTabs; a++)
						{
							tmpURL =  this.tabGetLocation(gBrowser.tabContainer.childNodes[a]);
							this.dump('tmpURL:'+tmpURL, debugingThisFile);
							if(tmpURL == 'about:blank')
							{
								closeTabs.push(gBrowser.tabContainer.childNodes[a]);
							}
						}
						for(var id in closeTabs)
						{
							this.tabClose(closeTabs[id]);
						}
		
						numTabs = this.tabCount();
					}
				//want close duplicates?
					if(this.preferenceGet('close.duplicates'))
					{
						closeTabs = Array();
						arrayTabs = Array();
						arrayTabs.push('-');
						for(var a = 0; a < numTabs; a++)
						{
							tmpURL =  this.cleanURL(this.tabGetLocation(gBrowser.tabContainer.childNodes[a]));
							this.dump('tmpURL:'+tmpURL, debugingThisFile);
							if(this.inArray(arrayTabs, tmpURL))
								closeTabs.push(gBrowser.tabContainer.childNodes[a]);
							else
								arrayTabs.push(tmpURL);
						}
						for(var id in closeTabs)
						{
							this.tabClose(closeTabs[id]);
						}
		
						numTabs = this.tabCount();
					}
				//last tab
					lastTab = numTabs -1;
				//allready moved = 0
					allreadyMovedTabs = 0;
				//set tabs
					arrayTabs = Array();
					for(var a = 0; a < numTabs; a++)
					{
						arrayTabs.push(this.cleanURL(this.tabGetLocation(gBrowser.tabContainer.childNodes[a])));
					}
				//check if is there duplicates
					if(this.preferenceGet('close.duplicates'))//if the user close duplicates then there is no duplicates
						duplicates = false;
					else
					{
						uniqueTabs = this.arrayUnique(arrayTabs);
						if(uniqueTabs.length == arrayTabs.length)
							duplicates = false;
						else
							duplicates = true;
					}
		
				//sort
					arrayTabs = arrayTabs.sort(this.natcompare);
					if(this.preferenceGet('sort.reverse'))
						arrayTabs = arrayTabs.reverse();
				//moving tabs
					for(var id in arrayTabs)
					{
						for(var a = 0; a < numTabs - allreadyMovedTabs; a++)
						{
							if(arrayTabs[id] == this.cleanURL(this.tabGetLocation(gBrowser.tabContainer.childNodes[a])))
							{
								this.tabMove(gBrowser.tabContainer.childNodes[a], lastTab);
								allreadyMovedTabs++;
								if(duplicates === false)
									break;
							}
						}
					}
					this.decodeURLCache= null;
					
					return null;
			}
		};
		//it decodes the URL to be sorted
		this.cleanURL = function (aURL)
		{
			if(!aURL)
				return '';
			if(!this.decodeURLCache[aURL])
				this.decodeURLCache[aURL]  = this.decodeUTF8Recursive(this.removeWWW(this.removeSchema(aURL))).toLowerCase();
			return this.decodeURLCache[aURL];
		};