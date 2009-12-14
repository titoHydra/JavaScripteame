/* 
	SHARES OBJECTS BETWEEN WINDOWS OF THE SAME BROWSER INSTANCE FOR N ADD-ONS 
	__EXT_AUTOR__ <__EXT_AUTOR_EMAIL__>
*/

/*https://developer.mozilla.org/en/How_to_Build_an_XPCOM_Component_in_Javascript*/
/***********************************************************
constants
***********************************************************/

// reference to the interface defined in nsISharedObject.idl
const nsISharedObject = Components.interfaces.nsISharedObject;

// reference to the required base interface that all components must support
const nsISupports = Components.interfaces.nsISupports;

// UUID uniquely identifying our component
// You can get from: http://kruithof.xs4all.nl/uuid/uuidgen here
const CLASS_ID = Components.ID("{205bf060-c5f1-11de-8a39-0800200c9a66}");

// description
const CLASS_NAME = "Shares objects of N add-ons between windows of the same browser instance";

// textual unique identifier
const CONTRACT_ID = "@particle.universe.tito/SharedObject;1";

/***********************************************************
class definition
***********************************************************/

//class constructor
function SharedObject() {
// If you only need to access your component from Javascript, uncomment the following line:
this.wrappedJSObject = this;
}

// class definition
SharedObject.prototype = 
{
	//our array that will store the shared variables
	s : [],
	//appends a var to the array 's' (store)
	sharedObjectSet: function(aName,aValue)
	{
		this.s[aName] = aValue;
	},
	//gets a var from the array 's' (store)
	sharedObjectGet: function(aName)
	{
		return this.s[aName];
	},
	//sets to null the array in the position aName
	sharedObjectDestroy: function(aName)
	{
		/* 
			CAUTION THIS WILL DESTROY THE OBJECT INSIDE THE XPCOM COMPONENT 
			BUT THE REFERENCE (if any) ON YOUR EXTENSION WILL REMAIN INTACT
		*/
		this.s[aName] = null;
		delete(this.s[aName]);
	},
	//returns true if the object aName exists in 's' (store)
	sharedObjectExists: function(aName)
	{
		if(!this.s[aName])
			return false;
		else
			return true;
	},

  QueryInterface: function(aIID)
  {
    if (!aIID.equals(nsISharedObject) &&    
        !aIID.equals(nsISupports))
      throw Components.results.NS_ERROR_NO_INTERFACE;
    return this;
  }
};

/***********************************************************
class factory

This object is a member of the global-scope Components.classes.
It is keyed off of the contract ID. Eg:

mySharedObject = Components.classes["@dietrich.ganx4.com/SharedObject;1"].
                          createInstance(Components.interfaces.nsISharedObject);

***********************************************************/
var SharedObjectFactory = {
  createInstance: function (aOuter, aIID)
  {
    if (aOuter != null)
      throw Components.results.NS_ERROR_NO_AGGREGATION;
    return (new SharedObject()).QueryInterface(aIID);
  }
};

/***********************************************************
module definition (xpcom registration)
***********************************************************/
var SharedObjectModule = {
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
      return SharedObjectFactory;

    throw Components.results.NS_ERROR_NO_INTERFACE;
  },

  canUnload: function(aCompMgr) { return true; }
};

/***********************************************************
module initialization

When the application registers the component, this function
is called.
***********************************************************/
function NSGetModule(aCompMgr, aFileSpec) { return SharedObjectModule; }