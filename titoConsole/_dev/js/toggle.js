		var debugingThisFile = false;//sets debuging on/off for this JavaScript file

		this.extensionToggle = function()
		{
			this.preferenceSet('enabled', !this.preferenceGet('enabled'))
		}
		this.alertBoxToggle = function()
		{
			this.preferenceSet('enabled.display',  !this.preferenceGet('enabled.display'))
		}
