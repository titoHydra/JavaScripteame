	//open an external URI - mailto: for example
	this.openURI = function(aURL, isSecure)
	{
		//security
		if((aURL.toLowerCase()).indexOf('chrome://') != -1 && !isSecure)
		{
			this.error(' chrome:// URLs can\'t be opened with openURI ');
			return;
		}
		else if((aURL.toLowerCase()).indexOf('javascript:') != -1 && !isSecure)
		{
			this.error(' javascript:// URLs can\'t be opened with openURI ');
			return;
		}
		(function (aURL)
		{
		  var ios = Components.classes["@mozilla.org/network/io-service;1"]
							  .getService(Components.interfaces.nsIIOService);
		  var uri = ios.newURI(aURL, null, null);
		
		  var protocolSvc = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"]
									  .getService(Components.interfaces.nsIExternalProtocolService);
		
		  if (!protocolSvc.isExposedProtocol(uri.scheme)) {
			// If we're not a browser, use the external protocol service to load the URI.
			protocolSvc.loadUrl(uri);
		  }
		  else {
			var loadgroup = Components.classes["@mozilla.org/network/load-group;1"]
									  .createInstance(Components.interfaces.nsILoadGroup);
			var appstartup = Components.classes["@mozilla.org/toolkit/app-startup;1"]
									   .getService(Components.interfaces.nsIAppStartup);
		
			var loadListener = {
			  onStartRequest: function ll_start(aRequest, aContext) {
				appstartup.enterLastWindowClosingSurvivalArea();
			  },
			  onStopRequest: function ll_stop(aRequest, aContext, aStatusCode) {
				appstartup.exitLastWindowClosingSurvivalArea();
			  },
			  QueryInterface: function ll_QI(iid) {
				if (iid.equals(Components.interfaces.nsISupports) ||
					iid.equals(Components.interfaces.nsIRequestObserver) ||
					iid.equals(Components.interfaces.nsISupportsWeakReference))
				  return this;
				throw Components.results.NS_ERROR_NO_INTERFACE;
			  }
			}
			loadgroup.groupObserver = loadListener;
		
			var uriListener = {
			  onStartURIOpen: function(uri) { return false; },
			  doContent: function(ctype, preferred, request, handler) { return false; },
			  isPreferred: function(ctype, desired) { return false; },
			  canHandleContent: function(ctype, preferred, desired) { return false; },
			  loadCookie: null,
			  parentContentListener: null,
			  getInterface: function(iid) {
				if (iid.equals(Components.interfaces.nsIURIContentListener))
				  return this;
				if (iid.equals(Components.interfaces.nsILoadGroup))
				  return loadgroup;
				throw Components.results.NS_ERROR_NO_INTERFACE;
			  }
			}
		
			var channel = ios.newChannelFromURI(uri);
			var uriLoader = Components.classes["@mozilla.org/uriloader;1"]
									  .getService(Components.interfaces.nsIURILoader);
			uriLoader.openURI(channel, true, uriListener);
		  }
		})(aURL); 
	}