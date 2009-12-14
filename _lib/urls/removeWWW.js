	//remove the ww. ww09. www09. ww-09. www-09. www. www09. es-en.www. es.www09. (and probably others) from a domain name
	/*
		http://www-142.ibm.com/software/products/uy/es/category/SWF00
		http://es-es.www.mozilla.org/
	*/
	this.removeWWW = function(aDomain)
	{
		if(!aDomain)
			return '';
		var withoutAZ09WWW = aDomain.replace(/^([a-z]|[0-9]|-)+\.www?-?([0-9]+)?\./i, '');
		if(aDomain != withoutAZ09WWW)
			return withoutAZ09WWW;
		else
			return aDomain.replace(/^www?-?([0-9]+)?\./i, '');
	}
