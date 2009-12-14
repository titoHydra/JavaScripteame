	//sets an element like undragable
	this.dragUp = function(anElement)
	{
   		anElement.removeAttribute('dragable');
		this.cssStyleRemove(anElement, 'cursor');
	}
