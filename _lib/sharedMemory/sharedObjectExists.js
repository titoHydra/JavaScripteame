	//returns true if a shared object created by a XPCOM exists (shared by all the windows of the same browser instance (profile))
	this.sharedObjectExists = function(objectName)
	{
        var sharedObjectComponent = Components.classes['@particle.universe.tito/SharedObject;1']
                                    	.getService().wrappedJSObject;

       return sharedObjectComponent.sharedObjectExists('myExt.'+objectName);
	}