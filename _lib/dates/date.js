	// returns current date, format: 2009-12-31
	this.date = function()
	{
		var date = new Date();
		return date.getFullYear() + '-' + 
			(date.getMonth() < 9 ? '0' : '') + (date.getMonth()+1) + '-' +
			(date.getDate() < 10 ? '0' : '') + date.getDate();
	}