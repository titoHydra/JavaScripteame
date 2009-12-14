/* 
	LISTEN THE CONSOLE MESSAGES AND NOTIFIES TO THE EXTENSION
	__EXT_AUTOR__ <__EXT_AUTOR_EMAIL__>
*/

/*https://developer.mozilla.org/en/How_to_Build_an_XPCOM_Component_in_Javascript*/
/***********************************************************
constants
***********************************************************/

// reference to the interface defined in nsIConsoleListener.idl
const nsIConsoleListener = Components.interfaces.nsIConsoleListener;

// reference to the required base interface that all components must support
const nsISupports = Components.interfaces.nsISupports;

// UUID uniquely identifying our component
// You can get from: http://kruithof.xs4all.nl/uuid/uuidgen here
const CLASS_ID = Components.ID("{dafe2bf0-d392-11de-8a39-0800200c9a66}");

// description
const CLASS_NAME = "Listen the console";

// textual unique identifier
const CONTRACT_ID = "@particle.universe.tito/ConsoleListener;1";

/***********************************************************
class definition
***********************************************************/

//class constructor
function ConsoleListener()
{
	this.wrappedJSObject = this;
	this.init();
}

// class definition
ConsoleListener.prototype = 
{
	listenerAdded : false,
	errors : [],
	
	init: function()
	{
		if(!this.listenerAdded)
		{
			this.listenerAdded = true;
			var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService();
				consoleService.QueryInterface(Components.interfaces.nsIConsoleService);

			consoleService.registerListener(this);
		}
	},
	observe: function(error)
	{
		try{error = error.QueryInterface(Components.interfaces.nsIScriptError);}catch(e){}

		try
		{
		//dispatch the event to the extension on the focused window
			var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]  
						.getService(Components.interfaces.nsIWindowMediator);  
			var win = wm.getMostRecentWindow('navigator:browser');  
			if(win && ('titoConsole' in win) && win['titoConsole'].fullyLoaded)
			{
				try
				{
					if(this.errors)
					{
						for(var id in this.errors)
						{
							win['titoConsole'].alert(this.errors[id]);
						}
						this.errors = [];
					}
					win['titoConsole'].alert(error);
					return;
				}
				catch(e){}
			}
			else
			{
				this.errors[this.errors.length] = error;
			}
		}
		catch(e)
		{
			this.errors[this.errors.length] = error;
		}
	},
	removeListener: function()
	{
		if(this.listenerAdded)
		{
			this.listenerAdded = false;
			
			var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService();
				consoleService.QueryInterface(Components.interfaces.nsIConsoleService);

			consoleService.unregisterListener(this);
		}
	},

  QueryInterface: function(aIID)
  {
    if (!aIID.equals(nsIConsoleListener) &&    
        !aIID.equals(nsISupports))
      throw Components.results.NS_ERROR_NO_INTERFACE;
    return this;
  }
};

/***********************************************************
class factory

This object is a member of the global-scope Components.classes.
It is keyed off of the contract ID. Eg:

myConsoleListener = Components.classes["@dietrich.ganx4.com/ConsoleListener;1"].
                          createInstance(Components.interfaces.nsIConsoleListener);

***********************************************************/
var ConsoleListenerFactory = {
  createInstance: function (aOuter, aIID)
  {
    if (aOuter != null)
      throw Components.results.NS_ERROR_NO_AGGREGATION;
    return (new ConsoleListener()).QueryInterface(aIID);
  }
};

/***********************************************************
module definition (xpcom registration)
***********************************************************/
var ConsoleListenerModule = {
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
      return ConsoleListenerFactory;

    throw Components.results.NS_ERROR_NO_INTERFACE;
  },

  canUnload: function(aCompMgr) { return true; }
};

/***********************************************************
module initialization

When the application registers the component, this function
is called.
***********************************************************/
function NSGetModule(aCompMgr, aFileSpec) { return ConsoleListenerModule; }


new ConsoleListener();