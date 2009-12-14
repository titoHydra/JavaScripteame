		//sets the preferences fot this extension

			this.preferences = {};
			
			this.preferences.bools = [
										'close.duplicates',
										'sort.reverse',
										'close.blank.tabs'
									];
			this.preferences.radios = [];
			
			this.preferences.ints = [];
			
			this.preferences.colors = [];
			this.preferences.strings = [];
			this.preferences.stringsMultiline = [];
			this.preferences.stringsMultilineSort = [];

		/*
			examples of listeners for preferenes
		
			//called when the "form" (window/dialog/xul) was filled with all the preferences
			this.addListener('onPreferencesFilled', function(){alert('the preferences form was filled!')});
			
			//called when the preferences were applied to the shared object "pref" and NOT to setBoolPref, setIntPref.. 
			//clean user input, do stuff, don't save the preference is not the intention ( apply is preview )
			this.addListener('onPreferencesApplied', function(){alert('preferences applied!')});
			
			//called when the preferences were saved to the shared object "pref" and to setBoolPref, setIntPref.. 
			//clean user input, do stuff, re-save modified preferences
			this.addListener('onPreferencesSaved', function(){alert('preferences saved!')});
			
			//called when the preferences observer notices a change in a preference, usually by about:config modification
			//or when the user modified a preferences by some menuitem or something
			this.addListener('onPreferenceSet', function(aName, aValue){alert('the preference "'+aName+'" has a new value "'+aValue+'"')});
		*/
		
