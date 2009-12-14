/* 
	JSSTRINGS - LOADS LOCALIZED STRINGS USED BY JAVASCRIPT (BUNDLE)
	__EXT_AUTOR__ <__EXT_AUTOR_EMAIL__>
*/

	(function()
	{
		/*this function local variables*/
			var debugingThisFile = false;//sets debuging on/off for this JavaScript file
			var bundle; //reference to the myExt-localization
  /*shared*/var strings = [];//holds all the strings by the extension
			
		//it loads the bundle when the browser fully loaded
			this.addListener('browserLoad', function (){myExt.initJSStrings()});

		// init the bundle, called when the browser has been loaded 
			this.initJSStrings = function()
			{
				this.dump('initJSStrings', debugingThisFile);
				bundle = this.getElement('localization');
				strings = this.sharedObjectGet('jsStrings', strings);
			};
		//checks if 'aStringID' exists in memory if not exists is loaded, saved and returned
			this.getString = function(aStringID)
			{
				aStringID =  'myExt.'+aStringID;
				this.dump('getString:aStringID:'+aStringID, debugingThisFile);
				if(!strings[aStringID])
				{
					try
					{
						strings[aStringID] = bundle.getString(aStringID);
					}
					catch(e)
					{
						//the default string is the ID it self, just to not break the test of the extension 
						strings[aStringID] = aStringID;
					}
					this.dump('getString:noExists:aStringID:'+aStringID+':strings[aStringID]:'+strings[aStringID], debugingThisFile);
				}
				else
				{
					this.dump('getString:exists:aStringID:'+aStringID+':strings[aStringID]:'+strings[aStringID], debugingThisFile);
				}
				return strings[aStringID];
			};
			
		return null;
			
	}).apply(myExt);