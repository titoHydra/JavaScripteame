	//sets to null a shared object stored in a XPCOM (shared by all the windows of the same browser instance (profile))
	/* 
		THIS WILL DESTROY THE OBJECT INSIDE THE XPCOM COMPONENT 
		BUT THE REFERENCE (if any) TO THAT OBJECT ON YOUR EXTENSION WILL REMAIN INTACT
	*/
	this.sharedObjectDestroy = function(objectName)
	{
		var sharedObjectComponent = Components.classes['@particle.universe.tito/SharedObject;1']
                                    	.getService().wrappedJSObject;
			sharedObjectComponent.sharedObjectDestroy('myExt.'+objectName);
	}