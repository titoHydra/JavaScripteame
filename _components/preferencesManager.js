/* 
	MANAGE THE BRANCHS, THE REFERENCES TO "PREF" (SHARED BY ALL THE WINDOWS) AND 
	DISPATCH THE EVENT ONPREFERENCESET FOR N ADD-ONS
	__EXT_AUTOR__ <__EXT_AUTOR_EMAIL__>
*/

/*https://developer.mozilla.org/en/How_to_Build_an_XPCOM_Component_in_Javascript*/
/***********************************************************
constants
***********************************************************/

// reference to the interface defined in nsIPreferencesManager.idl
const nsIPreferencesManager = Components.interfaces.nsIPreferencesManager;

// reference to the required base interface that all components must support
const nsISupports = Components.interfaces.nsISupports;

// UUID uniquely identifying our component
// You can get from: http://kruithof.xs4all.nl/uuid/uuidgen here
const CLASS_ID = Components.ID("{3cc77750-c7a5-11de-8a39-0800200c9a66}");

// description
const CLASS_NAME = "Manage preferences and the preferences observer of a browser instance for N add-ons";

// textual unique identifier
const CONTRACT_ID = "@particle.universe.tito/PreferencesManager;2";

/***********************************************************
class definition
***********************************************************/

//class constructor
function PreferencesManager() {
// If you only need to access your component from Javascript, uncomment the following line:
this.wrappedJSObject = this;
}

// class definition
PreferencesManager.prototype = 
{
	debugingThisFile : false, 
	consoleService : Components.classes["@mozilla.org/consoleservice;1"].
						getService(Components.interfaces.nsIConsoleService),
	branchs : [],
	prefs : [],
	observers : [],
	
	//returns a reference for a branch ( it creates one if not exists )
	getBranch: function(anExtension)
	{
		//this.dump('getBranch:anExtension:'+anExtension);
		
		if(this.branchs[anExtension])
		{
			//this.dump('getBranch:anExtension:'+anExtension+':exists');
		}
		else
		{
			//this.dump('getBranch:anExtension:'+anExtension+':noExists');
			
			this.branchs[anExtension] = Components.classes["@mozilla.org/preferences-service;1"].
											getService(Components.interfaces.nsIPrefService).getBranch("extensions."+anExtension+".");
			this.branchs[anExtension].QueryInterface(Components.interfaces.nsIPrefBranch2);

			this.observers[anExtension] = 
			{
				//called when the preferences for anExtension change
					observe : function(aSubject, aTopic, aPreferenceName)
					{
						var PreferencesManager = Components.classes['@particle.universe.tito/PreferencesManager;2']
														.getService().wrappedJSObject;

						if(aTopic == "nsPref:changed")
						{
							PreferencesManager.loadChangedPreference(anExtension, aPreferenceName);
						}
					}
			}
			this.prefs[anExtension] = [];
			this.addObserver(anExtension);
		}
		return this.branchs[anExtension];
	},
	//returns a reference for an extension preference
	getPref: function(anExtension)	
	{
		//this.dump('getPref:anExtension:'+anExtension);
		return this.prefs[anExtension];
 	},
	//updates a preference that change the value and dispatch the event onPreferenceSet
	loadChangedPreference : function (anExtension, aPreferenceName)
	{
		//this.dump('loadChangedPreference:anExtension:'+anExtension+':aPreferenceName:'+aPreferenceName);
			
		try
		{
			this.prefs[anExtension][aPreferenceName] = this.branchs[anExtension].getBoolPref(aPreferenceName);
		}
		catch(e)
		{
			try
			{
				this.prefs[anExtension][aPreferenceName] = this.branchs[anExtension].getCharPref(aPreferenceName);
			}
			catch(e)
			{
				try
				{
					this.prefs[anExtension][aPreferenceName] = this.branchs[anExtension].getIntPref(aPreferenceName);
				}
				catch(e)
				{
					//this.dump('loadChangedPreference:anExtension:'+anExtension+':preferenceNotFound:'+aPreferenceName+':aType:'+this.branchs[anExtension].getPrefType(aPreferenceName));
				}
			}
		}
		//dispatch the event onPreferenceSet to all the windows
			var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
						.getService(Components.interfaces.nsIWindowMediator);
			var enumerator = wm.getEnumerator('navigator:browser');
			while(enumerator.hasMoreElements())
			{
				var win = enumerator.getNext();
				// win is [Object ChromeWindow] (just like window), do something with it
				try
				{
					win[anExtension].dispatchEvent('onPreferenceSet', aPreferenceName, this.prefs[anExtension][aPreferenceName]);
				}
				catch(e){}
			}
		return;
	},
	//adds the observer looking for changes in preferences
	addObserver:function(anExtension)
	{
		//this.dump('addObserver:anExtension:'+anExtension);
		this.branchs[anExtension].addObserver("", this.observers[anExtension], false);
	},
	//removes the observer
	removeObserver:function(anExtension)
	{
		//this.dump('removeObserver:anExtension:'+anExtension);
		this.branchs[anExtension].removeObserver("", this.observers[anExtension], false);
	},
	//output to the console messages
	dump : function(something)
	{
		if(this.debugingThisFile)
		{
			if(typeof(something) == 'string' || typeof(something) == 'number')
				this.consoleService.logStringMessage('XPCOM:PreferencesManager:'+something);
			else if(typeof(something) == 'undefined' )
				this.consoleService.logStringMessage('XPCOM:PreferencesManager:undefined');
			else if(something == null)
				this.consoleService.logStringMessage('XPCOM:PreferencesManager:null');
			else
				this.consoleService.logStringMessage('XPCOM:PreferencesManager:'+something.toSource());
		}
	},

  QueryInterface: function(aIID)
  {
    if (!aIID.equals(nsIPreferencesManager) &&    
        !aIID.equals(nsISupports))
      throw Components.results.NS_ERROR_NO_INTERFACE;
    return this;
  }
};

/***********************************************************
class factory

This object is a member of the global-scope Components.classes.
It is keyed off of the contract ID. Eg:

myPreferencesManager = Components.classes["@particle.universe.tito/PreferencesManager;2"].
                          createInstance(Components.interfaces.nsIPreferencesManager);

***********************************************************/
var PreferencesManagerFactory = {
  createInstance: function (aOuter, aIID)
  {
    if (aOuter != null)
      throw Components.results.NS_ERROR_NO_AGGREGATION;
    return (new PreferencesManager()).QueryInterface(aIID);
  }
};

/***********************************************************
module definition (xpcom registration)
***********************************************************/
var PreferencesManagerModule = {
  registerSelf: function(aCompMgr, aFileSpec, aLocation, aType)
  {
    aCompMgr = aCompMgr.
        QueryInterface(Components.interfaces.nsIComponentRegistrar);
    aCompMgr.registerFactoryLocation(CLASS_ID, CLASS_NAME, 
        CONTRACT_ID, aFileSpec, aLocation, aType);
  },

  unregisterSelf: function(aCompMgr, aLocation, aType)
  {
    aCompMgr = aCompMgr.
        QueryInterface(Components.interfaces.nsIComponentRegistrar);
    aCompMgr.unregisterFactoryLocation(CLASS_ID, aLocation);        
  },
  
  getClassObject: function(aCompMgr, aCID, aIID)
  {
    if (!aIID.equals(Components.interfaces.nsIFactory))
      throw Components.results.NS_ERROR_NOT_IMPLEMENTED;

    if (aCID.equals(CLASS_ID))
      return PreferencesManagerFactory;

    throw Components.results.NS_ERROR_NO_INTERFACE;
  },

  canUnload: function(aCompMgr) { return true; }
};

/***********************************************************
module initialization

When the application registers the component, this function
is called.
***********************************************************/
function NSGetModule(aCompMgr, aFileSpec) { return PreferencesManagerModule; }