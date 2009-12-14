	//returns an array with all the values of a panel form
	this.formValues = function(aForm)
	{
		var values = [];
		
		//textbox
			var inputs = aForm.getElementsByTagName('textbox');
			for(var a=0;a<inputs.length;a++)
			{
				if(inputs[a].getAttribute('name') != '')
				{
					values[inputs[a].getAttribute('name')] = inputs[a].value;
				}
			}
		//checkbox...
		//radios...
			
		return values;
	}