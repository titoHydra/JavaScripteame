	//returns a tab from a document-REVIEW
	/*
		http://forums.mozillazine.org/viewtopic.php?p=3329527#p3329527
		document of page = event.originalTarget
		window of page = event.originalTarget.defaultView
		browser = gBrowser.getBrowserForDocument(event.originalTarget)
		tab = gBrowser.mTabs[gBrowser.getBrowserIndexForDocument(event.originalTarget)]
		panel = gBrowser.mTabs[gBrowser.getBrowserIndexForDocument(event.originalTarget)].linkedPanel
	*/
	this.tabGetFromDocument = function(aDoc)
	{
		return gBrowser.mTabs[gBrowser.getBrowserIndexForDocument(aDoc)]
	}
