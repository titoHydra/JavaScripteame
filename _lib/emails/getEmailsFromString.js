	//parse anString looking for text that looks like emails
	this.getEmailsFromString = function(aString)
	{
			aString = this.decodeUTF8Recursive(aString.toLowerCase())
							.replace(/\\/g, '\n')
							.replace(/ at /gi, '@')
							.replace(/\[at\]/gi, '@')
							.replace(/\(at\)/gi, '@')
							.replace(/ dot /gi, '.')
							.replace(/\[dot\]/gi, '.')
							.replace(/\(dot\)/gi, '.')
							.replace(/\*/g, '\n')
							.replace(/'/g, '\n')
							.replace(/"/g, '\n')
							.replace(/,/g, '\n')
							.replace(/\t/g,'\n')
							.replace(/\r/g,'\n')
							.replace(/;/g, '\n')
							.replace(/\:/g, '\n')
							.replace(/=/g, '\n')
							.replace(/\)/g, '\n')
							.replace(/\(/g, '\n')
							.replace(/</g, '\n')
							.replace(/>/g, '\n')
							.replace(/\[/g, '\n')
							.replace(/\]/g, '\n')
							.replace(/\|/g, '\n')
							.replace(/´/g, '\n')
							.replace(/`/g, '\n')
							.replace(/\.\./g, '.')
							.replace(/ /g, '\n')
							.replace(/\//g, '\n')
							.replace(/#/g, '\n')
							.replace(/\?/g, '\n').toLowerCase();
							
		aString = this.arrayUnique(aString.split('\n'));
		var emails = [];
		for(var a=0;a<aString.length;a++)
		{
			if(aString[a].indexOf('@') != -1)
			{
				aString[a] = (aString[a]).replace(/\.+$/, '').replace(/^\.+/, '');
				var email = aString[a].split('@');
				var user = email[0];
				var domain = email[1];
				
				if(user.length < 1 || user.length > 64){}
				else if(domain.length < 1 || domain.length > 255){}
				else if(domain.indexOf('.') == -1){}
				else if(!(/^[A-Za-z0-9\\-\\.]+$/.test(domain))){}
				else
					emails[emails.length] = aString[a];
			}
		}
		return emails;
	}
