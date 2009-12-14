	//returns the height of an element-REVIEW
	this.screenGetElementH = function(anElement)
	{
		if(anElement.boxObject)
			return anElement.boxObject.height;
		if(anElement.popupBoxObject)
			return anElement.popupBoxObject.height;
		if(anElement.height)
			return anElement.height;
	}
