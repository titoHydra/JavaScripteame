		var debugingThisFile = false;//sets debuging on/off for this JavaScript file

		this.formEditString = function(strings_id)
		{
			this.dump('formEditString', debugingThisFile);
				var rowString = this.getRowStringID(strings_id);
			//building the form
				//xul content
					var aLabel =  this.createFormLabel(this.getString('string.example'));
					var aTextbox = this.createTextbox('form-edit-string', rowString.strings_string);
						
					var aHiddenValue = this.createFormHiddenInput('form-edit-string-id', rowString.strings_id);

				//butonscreateFormHiddenInput
				var buttons = [];

					var button = [];
						button[0] = this.getString('save');
						button[1] = function(formData){ if(myExt.trim(formData['form-edit-string']) == '') return; myExt.updateString(myExt.trim(formData['form-edit-string']), formData['form-edit-string-id']); myExt.notifyInstances('setStrings'); };
						
					buttons[buttons.length] = button;
					
					var button = [];
						button[0] = this.getString('close');
				
					buttons[buttons.length] = button;

				this.form('string_edit', this.getString('log.and.display.messages.with.the.strings'), [aLabel,aTextbox,aHiddenValue], buttons, true);
		}
