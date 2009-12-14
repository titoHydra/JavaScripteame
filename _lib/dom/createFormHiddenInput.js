	//returns a new textbox that is hidden ( work like type="hidden" on HTML )
	this.createFormHiddenInput = function (anID, aDefault)
	{
		var aTextbox = this.create('textbox');
		
			aTextbox.setAttribute('id', 'myExt-'+anID);
			aTextbox.setAttribute('name', anID);
			aTextbox.setAttribute('hidden', true);
			
			if(aDefault)
				aTextbox.setAttribute('value', aDefault);

		return aTextbox;
	}
