	//returns a new label for a form
	this.createFormLabel = function (aValue)
	{
		var aLabel = this.createLabel(aValue);
			aLabel.setAttribute('style', 'color:#666666');

		return aLabel;
	}
