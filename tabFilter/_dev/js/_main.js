			var debugingThisFile = false;//sets debuging on/off for this JavaScript file
		//listeners
			this.addListener('browserLoad', function(){myExt.myExtInit()});
			this.addListener('tabContextMenuShowing', function(){myExt.updateMenu()});
		//shutdown
			this.addShutDown(function(){ myExt.removeMenu();});
			this.addShutDown(function(){ myExt.removeFilterBox();});

		//init the extension
		this.myExtInit = function ()
		{
			this.dump('myExtInit', debugingThisFile);
			//adds the menu to the context menu
			this.addMenu();
			//adds the filterbox behind the tabbar
			this.addFilterBox();
			//init the listeners
			this.initListeners();
		};
		//adds the menuitem to the tab context menu
		this.addMenu = function ()
		{
			this.dump('addMenu', debugingThisFile);
			this.tabContextMenu().appendChild(this.getElement('filter-tabs-filter'));
			this.tabContextMenu().appendChild(this.getElement('filter-tabs-filter-undo'));
		};
		//adds the filterbox behind the tabbar
		this.addFilterBox = function ()
		{
			this.dump('addFilterBox', debugingThisFile);
			this.appendToTabbar(this.getElement('container'));
		};
		//remove the menuitem from the tab context menu
		this.removeMenu = function()
		{
			this.dump('removeMenu', debugingThisFile);
			this.removeElement(this.getElement('filter-tabs-filter'));
			this.removeElement(this.getElement('filter-tabs-filter-undo'));
		}
		//remove the filter box
		this.removeFilterBox = function()
		{
			this.dump('removeFilterBox', debugingThisFile);
			this.removeElement(this.getElement('container'));
		}
		//disable the menu when there is just one tab
		this.updateMenu = function ()
		{
			this.dump('updateMenu', debugingThisFile);
			if(this.tabCount() == 1)
				this.getElement('filter-tabs-filter').setAttribute('disabled', true);
			else
				this.getElement('filter-tabs-filter').setAttribute('disabled', false);
		};
		this.toggleBox = function()
		{
			if(this.getElement('container').getAttribute('hidden') == 'false')
			{
				this.closeFilterBox();
				if(this.getElement('toolbarbutton'))
					this.getElement('toolbarbutton').setAttribute('checked', false);
			}
			else
			{
				this.openFilterBox();
				if(this.getElement('toolbarbutton'))
					this.getElement('toolbarbutton').setAttribute('checked', true);
			}
		}
		this.openFilterBox = function()
		{
			this.dump('openFilterBox', debugingThisFile);
			this.getElement('container').setAttribute('hidden', false);
			this.getElement('filter-textbox').focus();
		};
		this.closeFilterBox = function()
		{
			this.dump('closeFilterBox', debugingThisFile);
			
			//myExt.filterUndo();
			//setTimeout(function (){myExt.filterUndo();}, 600); //the attributes of the textbox (type="search" timeout="500") cause to filterUndo reverted
			
			this.getElement('container').setAttribute('hidden', true);
		}
		//filter the tabs
		this.filter = function (focusTextbox)
		{
			this.dump('filter', debugingThisFile);
			
			var aTextbox = this.getElement('filter-textbox');
			var searchString = aTextbox.value;
			
			var searchTitle  = (this.getElement('search-type-title').getAttribute("selected") == "true");
			var searchURL    = (this.getElement('search-type-url').getAttribute("selected") == "true");
			var searchBoth   = (this.getElement('search-type-both').getAttribute("selected") == "true");

			if(!searchString || searchString == '')
			{
				this.filterUndo(true);
				aTextbox.removeAttribute('status');
				return;
			}
			else
				searchString = String(searchString);
				
			this.dump('searchString:'+searchString, debugingThisFile);
			
		//start search
			var tabCount = this.tabCount();
			var selectedTab = false;//flag to know if a tab was found
			var shouldShowUndoButton = false;//holds if something need to be reverted, example one tab hidden
			var focusedTab = this.tabGetFocused();//holds the focused tab
			var firstTabFound;//holds the first tab that matched our search
			var found = false;//holds if at least one result was found
			
			for (var a=0;a<tabCount;a++)
			{
				var aTab = gBrowser.mTabContainer.childNodes[a];

				if(
					(searchTitle && this.searchEngineSearch(searchString, this.decodeUTF8Recursive(String(aTab.label))) ) ||
					(searchURL && this.searchEngineSearch(searchString, this.decodeUTF8Recursive(this.tabGetLocation(aTab))) ) ||
					(searchBoth &&
						(
							this.searchEngineSearch(searchString, this.decodeUTF8Recursive(this.tabGetLocation(aTab)))	||
							this.searchEngineSearch(searchString, this.decodeUTF8Recursive(String(aTab.label)))
						)
					)
				)
				{
					if(!selectedTab)
					{
						selectedTab=true;
						firstTabFound = aTab;
					}
					if(this.tabShow(aTab))
					{
						found = true;
					}
				}
				else
				{
					if(this.tabHide(aTab))
					{
						shouldShowUndoButton = true;
					}
					else
					{
						if(!selectedTab)
						{
							selectedTab=true;
							firstTabFound = aTab;
						}					
					}
				}
			}
			//change focus if needed
			if(this.tabIsHidden(focusedTab) && found)
				this.tabSelect(firstTabFound);

			//shows/hide undo menuitem
			if(shouldShowUndoButton)
				this.getElement('filter-tabs-filter-undo').setAttribute('hidden', false);
			else
				this.getElement('filter-tabs-filter-undo').setAttribute('hidden', true);

			//apply colors to filter textbox
			if(found)
				aTextbox.removeAttribute('status');
			else
				aTextbox.setAttribute('status', 'notfound');
				
			if(focusTextbox)
				aTextbox.focus();
		};
		//shows all the hidden tabs
		this.filterUndo = function(focusTextbox)
		{
			this.dump('filterUndo', debugingThisFile);
			
			var tabCount = this.tabCount();
			for (var a=0;a<tabCount;a++)
				this.tabShow(gBrowser.mTabContainer.childNodes[a]);
			this.getElement('filter-textbox').removeAttribute('status');
			this.getElement('filter-tabs-filter-undo').setAttribute('hidden', true);//hides undo menuitem
			if(focusTextbox)
				this.getElement('filter-textbox').focus();
		};
