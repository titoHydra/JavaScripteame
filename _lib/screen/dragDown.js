	//sets an element like dragable
	this.dragDown = function(anElement)
	{
   		anElement.setAttribute('dragable', true);
		this.cssStyleSet(anElement, 'cursor', 'move');
	}
