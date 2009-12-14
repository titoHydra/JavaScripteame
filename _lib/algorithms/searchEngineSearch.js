	//returns true or false if searchQuery is found in aString
	this.searchEngineSearch = function (searchQuery, aString)
	{		
		//normalizing aString - search is caseinsensitive
			aString = this.trim(aString).toLowerCase();
		
		//finding "or" conditions
			searchQuery = this.trim(searchQuery).toLowerCase().replace(/ or /gi, ',');
			searchQuery = searchQuery.split(',');
		//for each "or" condition - if no "or" conditions was found, this will loop one time.
			for(var id in searchQuery)
			{
				//getting words
					var subQuery = this.trim(searchQuery[id]).split(' ');
				//found flag
					var found = false;
					
				//foreach word to search
				for(var id2 in subQuery)
				{
					var word = this.trim(subQuery[id2]);

					if(word == '' || word == '-' || word == '+')
					{
						continue;
					}
					else if(word[0] == '-' && aString.indexOf(word.replace(/^\-/, '')) != -1)
					{
						found = false;
						break;
					}
					else if(word[0] != '-' && aString.indexOf(word) == -1)
					{
						found = false;
						break;
					}
					else
					{
						found = true;
					}
				}
				if(found)
					return true;
			}
		return false;
	};