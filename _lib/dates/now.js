	// returns current date, format: 2009-12-31 00:00:00
	this.now = function()
	{
		var date = new Date();
		return date.getFullYear() + '-' + 
			(date.getMonth() < 9 ? '0' : '') + (date.getMonth()+1) + '-' +
			(date.getDate() < 10 ? '0' : '') + date.getDate() + ' '+ 
			(date.getHours() < 10 ? '0' : '') + date.getHours() + ':'+ 
			(date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ':'+ 
			(date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
	}