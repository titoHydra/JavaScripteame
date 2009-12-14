	//sets a textbox to autocomplete
	/*
		Components.classes["@mozilla.org/satchel/form-history;1"].getService(Components.interfaces.nsIFormHistory2).addEntry('myExt#'+id, 'tito');
		Components.classes["@mozilla.org/satchel/form-history;1"].getService(Components.interfaces.nsIFormHistory2).addEntry('myExt#'+id, 'a');
		Components.classes["@mozilla.org/satchel/form-history;1"].getService(Components.interfaces.nsIFormHistory2).addEntry('myExt#'+id, 'aa');
		Components.classes["@mozilla.org/satchel/form-history;1"].getService(Components.interfaces.nsIFormHistory2).addEntry('myExt#'+id, 'aab');
	*/

	this.setAutocomplete = function (aTextbox)
	{
		aTextbox.setAttribute('type', 'autocomplete');
		aTextbox.setAttribute('autocompletesearchparam', 'myExt#'+aTextbox.getAttribute('id'));
		aTextbox.setAttribute('autocompletesearch', 'form-history');
		aTextbox.setAttribute('maxrows', '20');
		aTextbox.setAttribute('tabscrolling', true);
		aTextbox.setAttribute('minresultsforpopup', 1);

		if(this.isSeaMonkey())
		{
			aTextbox.setAttribute('disablehistory', true);//hide the arrow of the history
			aTextbox.setAttribute('showpopup', true);
			aTextbox.setAttribute('autofill', true);
			aTextbox.setAttribute('autofillaftermatch', true);
		}
		else
		{
			aTextbox.setAttribute('autocompletepopup', 'PopupAutoComplete');
			aTextbox.setAttribute('completeselectedindex', true);
			aTextbox.setAttribute('completedefaultindex', true);
			aTextbox.setAttribute('enablehistory', true);
		}
		return aTextbox;
	}
