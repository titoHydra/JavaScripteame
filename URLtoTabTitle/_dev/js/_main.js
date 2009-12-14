			var debugingThisFile = false;//sets debuging on/off for this JavaScript file
		//add the listeners
			this.addListener('browserLoad', function(){myExt.myExtInit()});
			//listeningn the actual tab
			this.addListener('onLocationChange', function (aDoc){myExt.setTitleDoc(aDoc)});
			//listeningn the documents loading in the background
			this.addListener('DOMContentLoadedNoFrames', function (aDoc){myExt.setTitleDoc(aDoc)});

		//shutdown
			this.addShutDown(function(){ myExt.removeMenu();});

		this.myExtInit = function()
		{
			this.dump('myExtInit', debugingThisFile);

			this.addMenu();
		}
		//adds the menuitem to the tab context menu
		this.addMenu = function ()
		{
			this.dump('addMenu', debugingThisFile);
			
			this.tabContextMenu().appendChild(this.getElement('url-to-tab-title'));
		};
		//remove the menuitem from the tab context menu
		this.removeMenu = function()
		{
			this.dump('removeMenu', debugingThisFile);
			this.removeElement(this.getElement('url-to-tab-title'));
		}
		this.switch = function(item)
		{
			if(item.getAttribute('checked') == 'true')
			{
				this.dump('switch:checked:true', debugingThisFile);
				this.initListeners();
				this.setTitlesTabs();
			}
			else
			{
				this.dump('switch:checked:false', debugingThisFile);
				this.removeListeners();
				this.setTitlesTabsUndo();
			}
		}
		this.setTitlesTabs = function ()
		{
			this.dump('setTitlesTabs', debugingThisFile);

			var tabCount = this.tabCount();
			for (var a=0;a<tabCount;a++)
			{
				var aTab = gBrowser.mTabContainer.childNodes[a];
				var aURL = this.decodeUTF8Recursive(this.removeWWW(this.removeSchema(this.tabGetLocation(aTab))));
					if(aURL != '' && aURL != 'about:blank')
						aTab.setAttribute('label', aURL);
			}
		};
		this.setTitlesTabsUndo = function()
		{
			this.dump('setTitlesTabsUndo', debugingThisFile);

			var tabCount = this.tabCount();
			for (var a=0;a<tabCount;a++)
			{
				var aTab = gBrowser.mTabContainer.childNodes[a];
				var aTitle = this.documentGetTitleFromTab(aTab);
					if(aTitle!='')
						aTab.setAttribute('label', aTitle);
			}
		};
		this.setTitleDoc = function (aDoc)
		{
			this.dump('setTitleDoc', debugingThisFile);
			
			var aTab = this.tabGetFromDocument(aDoc);
			var aURL = this.decodeUTF8Recursive(this.removeWWW(this.removeSchema(this.documentGetLocation(aDoc))));
				if(aURL != '' && aURL != 'about:blank')
					aTab.setAttribute('label', aURL );
		};
