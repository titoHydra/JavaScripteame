	//centers an element in the middle of the screen -REVIEW
	this.screenCenterElement = function(anElement)
	{
		var aDoc = window.document;		
		this.cssStyleSet(anElement, 'left',  (this.screenGetDocumentW(aDoc)/2)-(this.screenGetElementW(anElement)/2)+'px');
		this.cssStyleSet(anElement, 'top', (this.screenGetDocumentH(aDoc)/2)-(this.screenGetElementW(anElement)/2)+'px');
	}
