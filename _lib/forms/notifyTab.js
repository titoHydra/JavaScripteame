	//shows a notification in the current tab, if aTime is passed the notification will be hidden before the time
	this.notifyTab = function(aString, aTime)
	{
		var notificationBox = gBrowser.getNotificationBox();
		var notification =  notificationBox
								.appendNotification
								(
									"__EXT_NOMBRE__   :   "+aString,
									'myExt-notifyTab-'+this.sha256(aString),
									'__ICON_URI16__',
									gBrowser.getNotificationBox().PRIORITY_INFO_LOW,
									null
								);
		if(aTime)
			setTimeout(function(){try{notificationBox.removeNotification(notification)}catch(e){/*if the notification is removed manually this throw an exception*/} }, aTime);
	}