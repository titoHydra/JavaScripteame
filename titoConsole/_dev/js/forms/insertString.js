		var debugingThisFile = false;//sets debuging on/off for this JavaScript file

		this.formInsertString = function()
		{
			this.dump('formInsertString', debugingThisFile);
			//building the form
				//xul content
					var aLabel =  this.createFormLabel(this.getString('string.example'));
					var aTextbox = this.createTextbox('form-add-string');

				//butons
				var buttons = [];

					var button = [];
						button[0] = this.getString('save');
						button[1] = function(formData){ if(myExt.trim(formData['form-add-string']) == '') return; myExt.insertString(myExt.trim(formData['form-add-string'])); myExt.notifyInstances('setStrings'); };
						
					buttons[buttons.length] = button;
					
					var button = [];
						button[0] = this.getString('close');
				
					buttons[buttons.length] = button;

				this.form('string_add', this.getString('log.and.display.messages.with.the.strings'), [aLabel,aTextbox], buttons, true);
		}
