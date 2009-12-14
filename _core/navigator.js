/* 
	EXTENSION CONTROLLER - SETS AND CALL LISTENERS AND SHUTDOWN FUNCTIONS, ALSO DUMPS MESSAGES TO THE CONSOLE
	__EXT_AUTOR__ <__EXT_AUTOR_EMAIL__>
*/

	var myExt = {};

// Extension controller

	(function()
	{
		/*myExt global variables*/
			this.debugingGlobal = false;//it output to the console all calls to dump no matter what debugingThisFile value is
			//new line caracter detection
			var osVersion = String(Components.classes["@mozilla.org/xre/app-info;1"]
										.getService(Components.interfaces.nsIXULRuntime).OS).toLowerCase();
			if(osVersion.indexOf('win') != -1)
				this.__NEW_LINE__ = '\r\n';
			else if(osVersion.indexOf('mac') !=-1)
				this.__NEW_LINE__ = '\r';
			else
				this.__NEW_LINE__ = '\n';
				
		/*this function local variables*/
			var debugingThisFile = false;//sets debuging on/off for this JavaScript file
		//console
			var consoleService = Components.classes["@mozilla.org/consoleservice;1"].
									getService(Components.interfaces.nsIConsoleService);
		//controller properties
			var listeners = [];//an array of functions to add as listeners
			var shutdown = [];//an array of functions that will remove things added by the extension
			var focusedLocation = 'about:blank';//holds the location of the focused tab TOP document
			var urlBarListener;//the ProgressListener
			var callsToInitListeners = 0;//this is just dumb protection, if the extension found more calls to initListeners than removeListeners will throw an error
			var callsToRemoveListeners = 0;//
			
		//registerExtension - waiting for the browser to init the extension
			this.registerExtension = function()
			{
				this.dump('registerExtension', debugingThisFile);
				window.addEventListener("load", myExt.init, false);
				window.addEventListener("unload", myExt.unregisterExtension, false);
			};
		// init the extension, called when the browser has been loaded 
			this.init = function()
			{
				myExt.dump('init', debugingThisFile);
				myExt.addListener('browserInstantiated', myExt.registerTheListeners);
				myExt.initLoadListeners();
			};
		//register this extension to the "TheListeners" component
			this.registerTheListeners = function()
			{
				var theListeners = Components.classes['@particle.universe.tito/TheListeners;1']
						.getService().wrappedJSObject;
					theListeners.registerExtension('myExt', '__EXT_ID__');
			}
		//unregisterExtension - removing extension from browser, listeners, menus, vars, etcs
			this.unregisterExtension = function()
			{
				myExt.dump('unregisterExtension', debugingThisFile);
				window.removeEventListener("load", myExt.init, false);
				window.removeEventListener("unload", myExt.unregisterExtension, false);
				myExt.removeListeners();
				myExt.shutDown();
				myExt.destroy();
				return null;
			};
		//adding listeners waiting for the browser to load
			this.addListener = function(aListener, aFunction)
			{
				this.dump('addListener:'+aListener+':'+aFunction, debugingThisFile);
				if(!listeners[aListener])
					listeners[aListener] = [];
				listeners[aListener][listeners[aListener].length] = aFunction;
			};
		//removes a listener from the array of listeners
			this.removeListener = function(aListener, aFunction)
			{
				this.dump('removeListener', debugingThisFile);
				for(var id in listeners[aListener])
				{
					if(listeners[aListener][id].toSource() == aFunction.toSource())
					{
						this.dump('removeListener:'+aListener+':'+aFunction, debugingThisFile);			
						delete(listeners[aListener][id]);
						break;
					}
				}
			};
		//adds aFunction to the array of functions to be called when the extension is unregistered
			this.addShutDown = function(aFunction)
			{
				this.dump('addShutDown:'+aFunction, debugingThisFile);
				shutdown[shutdown.length] = aFunction;
			}
		//executing listeners - automatically init the BASIC listeners when the browser fully loaded
			this.initLoadListeners = function()
			{				
				this.dump('initLoadListeners', debugingThisFile);
				//browser instantiated - 
				//called just when a new instance of firefox is created (no window, many windows can be from one instance) 
				//this is useful for example to get just one preferences observer for all the windows.
					if(listeners['browserInstantiated'])
					{
						if(!this.sharedObjectExists('browserInstantiated'))
						{
							this.sharedObjectGet('browserInstantiated');
							for(var id in listeners['browserInstantiated'])
							{
								this.dump('initLoadListeners:browserInstantiated:'+listeners['browserInstantiated'][id], debugingThisFile);
								listeners['browserInstantiated'][id]();
							}
						}
					}
				//browser load
				//called when a new window of the browser is created
					if(listeners['browserLoad'])
					{
						for(var id in listeners['browserLoad'])
						{
							this.dump('initLoadListeners:browserLoad:'+listeners['browserLoad'][id], debugingThisFile);
							listeners['browserLoad'][id]();
						}
					}
			};
			this.initListeners = function()
			{
				this.dump('initListeners', debugingThisFile);
				//dumb protection
					callsToInitListeners++;
					if(callsToInitListeners-callsToRemoveListeners > 1)
						this.error('To re initListeners() You must call removeListeners() first');
				//popupshowing
					if(listeners['tabContextMenuShowing'])
					{
						this.dump('initListeners:tabContextMenuShowing', debugingThisFile);
						this.tabContextMenu().addEventListener('popupshowing', myExt.dispatchtabContextMenuShowing, false);
					}
				//onLocationChange
					if(listeners['onLocationChange'])
					{
						this.dump('initListeners:onLocationChange', debugingThisFile);
						
						urlBarListener =
						{
							QueryInterface: function(aIID)
							{
								if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
									aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
									aIID.equals(Components.interfaces.nsISupports)
									)
									return this;
								throw Components.results.NS_NOINTERFACE;
							},
							onLocationChange: function(aProgress, aRequest, aURI)
							{
							//	myExt.dump('onLocationChange:onLocationChange', debugingThisFile);
								/*
									QQQ this function run too fast if the event is "back" or "forward"
									calling to setTimeout seems to delay a little bit the call
									needs to check how to track these events, any idea? send mailto:extensiondevelopment@gmail.com thanks!!
									EXAMPLE: I was trying to update a label of a tab when this event is called, the function run to fast that 
									the label get updated first from my extension and then from firefox ( loosing my update of the label )
								*/
								setTimeout(function(){myExt.dispatchOnLocationChange(false)}, 85);
							},
							onStateChange: function(aWebProgress, aRequest, aFlag, aStatus)
							{
							},
							onProgressChange: function(aWebProgress, aRequest, curSelf, maxSelf, curTot, maxTot)
							{
							}
							,
							onStatusChange: function(aWebProgress, aRequest, aStatus, aMessage)
							{
							},
							onSecurityChange: function(aWebProgress, aRequest, aState)
							{
							},
							onRefreshAttempted: function(aBrowser, aWebProgress, aURI, aDelay, aSameURI)
							{
							}
						};
						gBrowser.addProgressListener(urlBarListener, Components.interfaces.nsIWebProgress.NOTIFY_LOCATION);
						/* REGISTRATION of this "event" CONTINUE IN THE NEXT IF OR ELSE IF*/
					}
				//DOMContentLoaded
					if(listeners['DOMContentLoadedNoFrames'] || listeners['DOMContentLoadedWithFrames'])
					{
						this.dump('initListeners:DOMContentLoaded', debugingThisFile);
						window.addEventListener("DOMContentLoaded", myExt.dispatchDOMContentLoaded, false);
					}
					//onLocationChange needs to look the load of documents
					else if(listeners['onLocationChange'])
					{
						this.dump('initListeners:onLocationChange:DOMContentLoaded', debugingThisFile);
						window.addEventListener("DOMContentLoaded", myExt.dispatchDOMContentLoaded, false);				
					}
				//onListenersLoad
					if(listeners['onListenersLoad'])
					{
						this.dump('initListeners:onListenersLoad', debugingThisFile);
						for(var id in listeners['onListenersLoad'])
						{
							this.dump('initListeners:onListenersLoad:'+listeners['onListenersLoad'][id], debugingThisFile);
							listeners['onListenersLoad'][id]();
						}
					}
			};
			//this is just cool. dispatch an event of this 'core'
			this.dispatchEvent = function()
			{
				this.dump('dispatchEvent', debugingThisFile);
				
				var aListener = arguments[0];
				if(listeners[aListener])
				{
					for(var id in listeners[aListener])
					{
						this.dump('dispatchEvent:'+aListener+':'+listeners[aListener][id], debugingThisFile);
						
						//I never use too many arguments
						listeners[aListener][id](
													arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],
													arguments[6],arguments[7],arguments[8],arguments[9],arguments[10]
												);
					}
				}
			}
			//notifies to all the instances of this extension that aFunction needs to be called
			this.notifyInstances = function()
			{
				this.dump('notifyInstances', debugingThisFile);

				var aFunction = arguments[0];
				var windows = this.windowsGet();
				for(var id in windows)
				{
					try{
						windows[id]['myExt'][aFunction](
															arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],
															arguments[6],arguments[7],arguments[8],arguments[9],arguments[10]
														);
					}catch(e){}
				}
			}
			//notifies to the instance of this extension in the focused window that aFunction needs to be called
			this.notifyFocused = function()
			{
				this.dump('notifyFocused', debugingThisFile);
				
				var aFunction = arguments[0];
				var win = this.windowGetFocused();
					try{
						win['myExt'][aFunction](
															arguments[1], arguments[2], arguments[3], arguments[4], arguments[5],
															arguments[6], arguments[7], arguments[8], arguments[9], arguments[10]
														);
					}catch(e){}
			}
		//fires the listener onLocationChange
			/*
				The objective is to notify to x functions that the tab you have focused changed it's URL OR that the tab focused document finished loading.
				The intention is to notify to the extension that is time to refresh the UI or x
				So a focused "about:blank" tab will receive 2 notifications when you write google.com and press enter in the location bar
				It's time to refresh the UI when the URL starting load ;and when the URL finish loading BUT this: ONLY for the focused tab
				This will listen the DOMContentLoaded and the urlBarListener but it will don't do nothing with the content(document) of the tab it self. (to work with document see DOMContentLoadedNoFrames or DOMContentLoadedWithFrames)
				Listening to "TabOpen","TabMove","TabClose","TabSelect" is not necesary beacuse urlBarListener is fired with this events and back/forward calls !important;
			*/
			this.dispatchOnLocationChange = function(focusedDocumentHasBeenLoaded)
			{
				var aDoc = window.top.getBrowser().browsers[window.top.getBrowser().mTabBox.selectedIndex].contentDocument;
				var aLocation = String(aDoc.location);
				
				if(focusedDocumentHasBeenLoaded || aLocation != focusedLocation )
				{
					this.dump('dispatchOnLocationChange:aLocation:'+aLocation+':focusedDocumentHasBeenLoaded:'+focusedDocumentHasBeenLoaded, debugingThisFile);
					focusedLocation = aLocation;
					for(var id in listeners['onLocationChange'])
					{
						listeners['onLocationChange'][id](aDoc);
					}
				}
			}
		//fires the listener fireDOMContentLoaded
			this.dispatchDOMContentLoaded = function(event)
			{
				//myExt.dump('dispatchDOMContentLoaded', debugingThisFile);
				
				var aDoc = event.originalTarget;
				var topDoc = aDoc.defaultView.top.document;
				
				if (aDoc != topDoc)//its a frame
				{
					//calling listeners for frames
						if(listeners['DOMContentLoadedWithFrames'])
						{
							//myExt.dump('dispatchDOMContentLoaded:framedDocument:aDoc.location:'+aDoc.location, debugingThisFile);
							for(var id in listeners['DOMContentLoadedWithFrames'])
							{
								listeners['DOMContentLoadedWithFrames'][id](aDoc);
							}
						}
				}
				else
				{
					//calling listeners for frames but for top document too
						if(listeners['DOMContentLoadedWithFrames'])
						{
							//myExt.dump('dispatchDOMContentLoaded:topDocument:aDoc.location:'+aDoc.location, debugingThisFile);
							for(var id in listeners['DOMContentLoadedWithFrames'])
							{
								listeners['DOMContentLoadedWithFrames'][id](aDoc);
							}
						}
					//calling listeners for top document
						if(listeners['DOMContentLoadedNoFrames'])
						{
							//myExt.dump('dispatchDOMContentLoaded:topDocument:aDoc.location:'+aDoc.location, debugingThisFile);
							for(var id in listeners['DOMContentLoadedNoFrames'])
							{
								listeners['DOMContentLoadedNoFrames'][id](aDoc);
							}
						}
					//notify to onLocationChange that the document has been loaded and the DOMcontentLoaded functions has been already called
					//but only if this loaded document is the current focused one
						if(listeners['onLocationChange'])
						{
							 if(aDoc == window.top.getBrowser().browsers[window.top.getBrowser().mTabBox.selectedIndex].contentDocument)
							 {
								 myExt.dispatchOnLocationChange(true);
							 }
						}
				}
			}
		//fires the listener popupshowing for the tabContextMenu
			this.dispatchtabContextMenuShowing = function (event)
			{
				if(event.originalTarget == myExt.tabContextMenu())
				{
					myExt.dump('dispatchtabContextMenuShowing', debugingThisFile);
					
					for(var id in listeners['tabContextMenuShowing'])
					{
						myExt.dump('dispatchtabContextMenuShowing:'+listeners['tabContextMenuShowing'][id], debugingThisFile);
						listeners['tabContextMenuShowing'][id](event);
					}
				}
			}
			
		//remove the listeners added by the extension
			this.removeListeners = function()
			{
				this.dump('removeListeners', debugingThisFile);
				//dumb protection
				callsToRemoveListeners++;
				
				if(listeners['tabContextMenuShowing'])
				{
					this.dump('removeListeners:tabContextMenuShowing', debugingThisFile);
					this.tabContextMenu().removeEventListener('popupshowing', myExt.dispatchtabContextMenuShowing, false);
				}
				if(listeners['onLocationChange'])
				{
					this.dump('removeListeners:onLocationChange', debugingThisFile);
				    gBrowser.removeProgressListener(urlBarListener);
				}
				if(listeners['DOMContentLoadedNoFrames'] || listeners['DOMContentLoadedWithFrames'])
				{
					this.dump('removeListeners:DOMContentLoaded', debugingThisFile);
					window.removeEventListener("DOMContentLoaded", myExt.dispatchDOMContentLoaded, false);
				}
				else if(listeners['onLocationChange'])
				{
					this.dump('removeListeners:onLocationChange:DOMContentLoaded', debugingThisFile);
					window.removeEventListener("DOMContentLoaded", myExt.dispatchDOMContentLoaded, false);
				}
			}			
		//calling functions that remove things added by the extension
			this.shutDown = function()
			{
				this.dump('shutDown', debugingThisFile);
				for(var id in shutdown)
				{
					this.dump('shutDown:'+shutdown[id], debugingThisFile);
					shutdown[id]();
				}
			}
		//sets to null this add-on
			this.destroy = function()
			{
				this.dump('destroy', debugingThisFile);
				myExt = null;
				delete(myExt);
				this.dump('exit', debugingThisFile);
				if(debugingThisFile)
					alert('myExt completed the shutdown. Time to look the error console if there is any errors. Looks like the window will be closed');
			}
		//output to the console messages
			this.dump = function(something, debugingThisFile)
			{
				if(debugingThisFile || this.debugingGlobal || typeof(debugingThisFile) == 'undefined')
				{
					if(typeof(something) == 'string' || typeof(something) == 'number')
						consoleService.logStringMessage('myExt:'+something);
					else if(typeof(something) == 'undefined' )
						consoleService.logStringMessage('myExt:undefined');
					else if(something == null)
						consoleService.logStringMessage('myExt:null');
					else
						consoleService.logStringMessage('myExt:'+something.toSource());
				}
			};
		//output to the console an error (and stop execution mmm... )
			this.error = function(aMsg)
			{
				setTimeout(function(){ throw new Error('myExt:' + aMsg);}, 0);
			};
			
		//registerExtension
			this.registerExtension();
			
		return null;
	
	}).apply(myExt);
