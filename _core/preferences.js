/* 
	PREFERENCES - LOAD, FILL, SET AND OBSERVE PREFERENCES
	__EXT_AUTOR__ <__EXT_AUTOR_EMAIL__>
*/
	(function()
	{
		/*myExt global variables*/
			//preferences names
			this.preferences = {};

			this.preferences.bools = [];
			this.preferences.radios = [];

			this.preferences.ints = [];

			this.preferences.colors = [];
			this.preferences.strings = [];
			this.preferences.stringsMultiline = [];
			this.preferences.stringsMultilineSort = [];

		/*this function local variables*/
			var debugingThisFile = false;//sets debuging on/off for this JavaScript file

  /*shared*/var branch;//a reference to preferencesManagerComponent.wrappedJSObject.branchs['myExt']
  /*shared*/var pref;//a reference to preferencesManagerComponent.wrappedJSObject.prefs['myExt']

		/*the preference manager*/
			var preferencesManagerComponent = Components.classes['@particle.universe.tito/PreferencesManager;2']
                                    			.getService().wrappedJSObject;

			this.addListener('browserInstantiated', function (){myExt.preferencesInit()});//this is the very first listener called by the extension
			this.addListener('browserLoad', function (){myExt.preferencesBrowserLoad()});//this is the second listener called by the extension

		//called just when a new instance of firefox is created (no window, many windows can be from one instance) 
			this.preferencesInit = function()
			{
				this.dump('preferencesInit', debugingThisFile);
				
				//calls the references to branchs and prefs
				branch = preferencesManagerComponent.getBranch('myExt');
				pref = preferencesManagerComponent.getPref('myExt');
				//fills the pref reference
				this.preferencesLoad();
			}
		//called when a new window is created
			this.preferencesBrowserLoad = function()
			{
				this.dump('preferencesBrowserLoad', debugingThisFile);
				//calls the references to branchs and prefs
				branch = preferencesManagerComponent.getBranch('myExt');
				pref = preferencesManagerComponent.getPref('myExt');
				//if this window/dialog is the window preferences fill the form
				if(this.getElement('preferences-window'))
					this.preferencesFill();
			}
		//sets the referenced array with all the preferences
			this.preferencesLoad = function ()
			{
				this.dump('preferencesLoad', debugingThisFile);

				for(var id in this.preferences.bools)
					pref[this.preferences.bools[id]] = branch.getBoolPref(this.preferences.bools[id]);

				for(var id in this.preferences.radios)
					pref[this.preferences.radios[id]] = branch.getBoolPref(this.preferences.radios[id]);

				for(var id in this.preferences.ints)
					pref[this.preferences.ints[id]] = branch.getIntPref(this.preferences.ints[id]);

				for(var id in this.preferences.colors)
					pref[this.preferences.colors[id]] = this.decodeUTF8(branch.getCharPref(this.preferences.colors[id]));

				for(var id in this.preferences.strings)
					pref[this.preferences.strings[id]] = this.decodeUTF8(branch.getCharPref(this.preferences.strings[id]));

				for(var id in this.preferences.stringsMultiline)
					pref[this.preferences.stringsMultiline[id]] = this.decodeUTF8(branch.getCharPref(this.preferences.stringsMultiline[id]));

				for(var id in this.preferences.stringsMultilineSort)
					pref[this.preferences.stringsMultilineSort[id]] = this.decodeUTF8(branch.getCharPref(this.preferences.stringsMultilineSort[id]));
			};
		//fills the preferences dialog/window
			this.preferencesFill = function ()
			{
				this.dump('preferencesFill', debugingThisFile);

				for(var id in this.preferences.bools)
				{
					if(this.getBrowserElement(this.preferences.bools[id]))//if the preference is editable
						this.getBrowserElement(this.preferences.bools[id]).setAttribute("checked",  pref[this.preferences.bools[id]]);
				}
	
				for(var id in this.preferences.radios)
				{
					if(this.getBrowserElement(this.preferences.radios[id]))//if the preference is editable
					{
						var value = pref[this.preferences.radios[id]];
						this.getBrowserElement(this.preferences.radios[id]).setAttribute("selected", value);
						this.getBrowserElement(this.preferences.radios[id]).value = value;
					}
				}
	
				for(var id in this.preferences.ints)
				{
					if(this.getBrowserElement(this.preferences.ints[id]))//if the preference is editable
						this.getBrowserElement(this.preferences.ints[id]).value = pref[this.preferences.ints[id]];
				}
	
				for(var id in this.preferences.colors)
				{
					if(this.getBrowserElement(this.preferences.colors[id]))//if the preference is editable
						this.getBrowserElement(this.preferences.colors[id]).color = this.trim(pref[this.preferences.colors[id]]);
				}
	
				for(var id in this.preferences.strings)
				{
					if(this.getBrowserElement(this.preferences.strings[id]))//if the preference is editable
						this.getBrowserElement(this.preferences.strings[id]).value = this.trim(pref[this.preferences.strings[id]]);
				}
	
				for(var id in this.preferences.stringsMultiline)
				{
					if(this.getBrowserElement(this.preferences.stringsMultiline[id]))//if the preference is editable
						this.getBrowserElement(this.preferences.stringsMultiline[id]).value = this.trim(pref[this.preferences.stringsMultiline[id]])+this.__NEW_LINE__;
				}
	
				for(var id in this.preferences.stringsMultilineSort)
				{
					if(this.getBrowserElement(this.preferences.stringsMultilineSort[id]))//if the preference is editable
						this.getBrowserElement(this.preferences.stringsMultilineSort[id]).value = this.trim(pref[this.preferences.stringsMultilineSort[id]])+this.__NEW_LINE__;
				}
			
				this.dispatchEvent('onPreferencesFilled');
			};
		//saves and apply the preferences
			this.preferencesSave = function ()
			{
				this.dump('preferencesSave', debugingThisFile);

				preferencesManagerComponent.removeObserver('myExt');
				
				var value;
				
				for(var id in this.preferences.bools)
				{
					if(this.getBrowserElement(this.preferences.bools[id]))//if the preference is editable
					{
						value = (this.getBrowserElement(this.preferences.bools[id]).getAttribute("checked") == "true");
						branch.setBoolPref(this.preferences.bools[id],  value);
						pref[this.preferences.bools[id]] = value;
					}
				}
					
				for(var id in this.preferences.radios)
				{
					if(this.getBrowserElement(this.preferences.radios[id]))//if the preference is editable
					{
						value = (this.getBrowserElement(this.preferences.radios[id]).getAttribute("selected") == "true");
						branch.setBoolPref(this.preferences.radios[id], value);
						pref[this.preferences.radios[id]] = value;
					}
				}
					
				for(var id in this.preferences.ints)
				{
					if(this.getBrowserElement(this.preferences.ints[id]))//if the preference is editable
					{
						value = this.getBrowserElement(this.preferences.ints[id]).value;
						branch.setIntPref(this.preferences.ints[id], value);
						pref[this.preferences.ints[id]] = value;
					}
				}
					
				for(var id in this.preferences.colors)
				{
					if(this.getBrowserElement(this.preferences.colors[id]))//if the preference is editable
					{
						value = this.trim(this.getBrowserElement(this.preferences.colors[id]).color);
						branch.setCharPref(this.preferences.colors[id], this.encodeUTF8(value));
						pref[this.preferences.colors[id]] = value;
					}
				}
					
				for(var id in this.preferences.strings)
				{
					if(this.getBrowserElement(this.preferences.strings[id]))//if the preference is editable
					{
						value = this.trim(this.getBrowserElement(this.preferences.strings[id]).value);
						branch.setCharPref(this.preferences.strings[id], this.encodeUTF8(value));
						pref[this.preferences.strings[id]] = value;
					}
				}
					
				for(var id in this.preferences.stringsMultiline)
				{
					if(this.getBrowserElement(this.preferences.stringsMultiline[id]))//if the preference is editable
					{
						value = this.trim(this.getBrowserElement(this.preferences.stringsMultiline[id]).value);
						branch.setCharPref(this.preferences.stringsMultiline[id], this.encodeUTF8(value));
						pref[this.preferences.stringsMultiline[id]] = value;
					}
				}
					
				for(var id in this.preferences.stringsMultilineSort)
				{
					if(this.getBrowserElement(this.preferences.stringsMultilineSort[id]))//if the preference is editable
					{
						value = this.trim(this.trim(this.getBrowserElement(this.preferences.stringsMultilineSort[id]).value).split(this.__NEW_LINE__).sort().join(this.__NEW_LINE__));
						branch.setCharPref(this.preferences.stringsMultilineSort[id], this.encodeUTF8(value));
						pref[this.preferences.stringsMultilineSort[id]] = value;
					}
				}

				this.dispatchEvent('onPreferencesSaved');

				preferencesManagerComponent.addObserver('myExt');
			};
		//apply the preferences
			this.preferencesApply = function ()
			{
				this.dump('preferencesApply', debugingThisFile);

				for(var id in this.preferences.bools)
				{
					if(this.getBrowserElement(this.preferences.bools[id]))//if the preference is editable
						pref[this.preferences.bools[id]] = (this.getBrowserElement(this.preferences.bools[id]).getAttribute("checked") == "true");
				}
					
				for(var id in this.preferences.radios)
				{
					if(this.getBrowserElement(this.preferences.radios[id]))//if the preference is editable
						pref[this.preferences.radios[id]] = (this.getBrowserElement(this.preferences.radios[id]).getAttribute("selected") == "true");
				}
					
				for(var id in this.preferences.ints)
				{
					if(this.getBrowserElement(this.preferences.ints[id]))//if the preference is editable
						pref[this.preferences.ints[id]] = this.getBrowserElement(this.preferences.ints[id]).value;
				}
					
				for(var id in this.preferences.colors)
				{
					if(this.getBrowserElement(this.preferences.colors[id]))//if the preference is editable
						pref[this.preferences.colors[id]] = this.trim(this.getBrowserElement(this.preferences.colors[id]).color);
				}
					
				for(var id in this.preferences.strings)
				{
					if(this.getBrowserElement(this.preferences.strings[id]))//if the preference is editable
						pref[this.preferences.strings[id]] = this.trim(this.getBrowserElement(this.preferences.strings[id]).value);
				}
					
				for(var id in this.preferences.stringsMultiline)
				{
					if(this.getBrowserElement(this.preferences.stringsMultiline[id]))//if the preference is editable
						pref[this.preferences.stringsMultiline[id]] = this.trim(this.getBrowserElement(this.preferences.stringsMultiline[id]).value);
				}
					
				for(var id in this.preferences.stringsMultilineSort)
				{
					if(this.getBrowserElement(this.preferences.stringsMultilineSort[id]))//if the preference is editable
						pref[this.preferences.stringsMultilineSort[id]] = this.trim(this.trim(this.getBrowserElement(this.preferences.stringsMultilineSort[id]).value).split(this.__NEW_LINE__).sort().join(this.__NEW_LINE__));
				}
					
				this.dispatchEvent('onPreferencesApplied');
			};
		//saves a preference, if dontRemoveObserver is set to true will cause to dispatch the event onpreferencesset to all the windows
			this.preferenceSet = function (aName, aValue, dontRemoveObserver)
			{
				this.dump('preferenceSet:aName:'+aName+':aValue:'+aValue, debugingThisFile);
				if(!dontRemoveObserver)
					preferencesManagerComponent.removeObserver('myExt');

				if(this.inArray(this.preferences.bools, aName))
				{
					branch.setBoolPref(aName, aValue);
					pref[aName] = aValue;
				}
				else if(this.inArray(this.preferences.radios, aName))
				{
					branch.setBoolPref(aName, aValue);
					pref[aName] = aValue;
				}
				else if(this.inArray(this.preferences.ints, aName))
				{
					branch.setIntPref(aName, aValue);
					pref[aName] = aValue;
				}
				else if(this.inArray(this.preferences.colors, aName))
				{
					branch.setCharPref(aName, this.encodeUTF8(this.trim(aValue)));
					pref[aName] = aValue;
				}
				else if(this.inArray(this.preferences.strings, aName))
				{
					branch.setCharPref(aName, this.encodeUTF8(this.trim(aValue)));
					pref[aName] = aValue;
				}
				else if(this.inArray(this.preferences.stringsMultiline, aName))
				{
					branch.setCharPref(aName, this.encodeUTF8(this.trim(aValue)));
					pref[aName] = aValue;
				}
				else if(this.inArray(this.preferences.stringsMultilineSort, aName))
				{
					branch.setCharPref(aName, this.encodeUTF8(this.trim(this.trim(aValue).split(this.__NEW_LINE__).sort().join(this.__NEW_LINE__))));
					pref[aName] = aValue;
				}
				else
				{
					this.dump('preferenceSet:preferenceNotFound:aName:'+aName, debugingThisFile);
				}
				if(!dontRemoveObserver)
					preferencesManagerComponent.addObserver('myExt');
			};
		//returns the value of the referenced preference
			this.preferenceGet = function(aName)
			{
				this.dump('preferenceGet:aName:'+aName+':pref[aName]:'+pref[aName], debugingThisFile);
				return pref[aName];
			};
		//changes the value of a preference and dispatch the event onpreferenceset to all the windows
			this.preferenceChange = function(aName, aValue)
			{
				this.dump('preferenceChanged:aName:'+aName+':pref[aName]:'+pref[aName], debugingThisFile);
				this.preferenceSet(aName, aValue, true)
			};

		return null;
		
	}).apply(myExt);