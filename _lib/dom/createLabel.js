	//returns a new label
	this.createLabel = function (aValue)
	{
		var aLabel = this.create('label');
			aLabel.setAttribute('value', aValue);

		return aLabel;
	}
