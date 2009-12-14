	//returns a new textbox
	this.createTextbox = function (anID, aDefault, autoComplete)
	{
		var aTextbox = this.create('textbox');
		
			aTextbox.setAttribute('id', 'myExt-'+anID);
			aTextbox.setAttribute('name', anID);
			
			if(aDefault)
				aTextbox.setAttribute('value', aDefault);

			if(autoComplete)
				aTextbox = this.setAutocomplete(aTextbox);
		return aTextbox;
	}
