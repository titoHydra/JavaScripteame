			var debugingThisFile = false;//sets debuging on/off for this JavaScript file
		//add the listeners
			this.addListener('browserLoad', function(){myExt.myExtInit()});
			//listeningn the actual tab
			this.addListener('onLocationChange', function (aDoc){myExt.showMetaTitleAndDescription(aDoc)});

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
			
			this.tabContextMenu().appendChild(this.getElement('menuitem'));
		};
		//remove the menuitem from the tab context menu
		this.removeMenu = function()
		{
			this.dump('removeMenu', debugingThisFile);
			this.removeElement(this.getElement('menuitem'));
		}
		this.switch = function(item)
		{
			if(item.getAttribute('checked') == 'true')
			{
				this.dump('switch:checked:true', debugingThisFile);
				this.initListeners();
				this.showMetaTitleAndDescription();
			}
			else
			{
				this.dump('switch:checked:false', debugingThisFile);
				this.removeListeners();
				this.hideMetaTitleAndDescription();
			}
		}
		this.showMetaTitleAndDescription = function (aDoc)
		{
			if(!aDoc)
				aDoc = this.documentGetFocused();
			var title = this.documentGetTitle(aDoc);
			var metaDescription = this.documentGetMetaDescription(aDoc);
			
			this.hideMetaTitleAndDescription();
			
			this.lastDescriptionBox = this.notifyTabs(this.getString('description')+' : '+metaDescription);
			this.lastTitleBox = this.notifyTabs(this.getString('title')+' : '+title);
		};
		this.hideMetaTitleAndDescription = function (aDoc)
		{
			this.removeElement(this.lastTitleBox);
			this.removeElement(this.lastDescriptionBox);
		}
