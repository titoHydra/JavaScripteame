	//returns the width of an element-REVIEW
	this.screenGetElementW = function(anElement)
	{
		if(anElement.boxObject)
			return anElement.boxObject.width;
		if(anElement.popupBoxObject)
			return anElement.popupBoxObject.width;
		if(anElement.width)
			return anElement.width;
	}
