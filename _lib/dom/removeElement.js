	//removes an element from the dom
	this.removeElement = function (anElement)
	{
		if(anElement && anElement.parentNode)//Sometimes the element was removed.
			anElement.parentNode.removeChild(anElement);
	}
