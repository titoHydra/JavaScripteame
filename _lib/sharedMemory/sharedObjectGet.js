	//returns a shared object stored in a XPCOM (shared by all the windows of the same browser instance (profile))
	this.sharedObjectGet = function(objectName, aDefault)
	{		
		var sharedObjectComponent = Components.classes['@particle.universe.tito/SharedObject;1']
                                    	.getService().wrappedJSObject;
		if(this.sharedObjectExists(objectName))
		{
			//this.dump('sharedObjectGet:The shared var "'+objectName+'" is a property of the XPCOM');
		}
		else
		{
			//this.dump('sharedObjectGet:The shared var "'+objectName+'" is NOT a property of the XPCOM');
			if(!aDefault && aDefault !== 0)
			{
				//this.dump('sharedObjectGet:The shared var "'+objectName+'" doenst have a default value');
				aDefault = {};
			}
			else
			{
				//this.dump('sharedObjectGet:The shared var "'+objectName+'" has a default value');
			}
			
			//this.dump('sharedObjectGet:The shared var "'+objectName+'" was stored as a property of the XPCOM');
			sharedObjectComponent.sharedObjectSet('myExt.'+objectName, aDefault);
		}
		//this.dump('sharedObjectGet:The property "'+objectName+'" was retrieved from the XPCOM');
		return  sharedObjectComponent.sharedObjectGet('myExt.'+objectName);
	}