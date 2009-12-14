	//return true if the ip address is private
	this.isIPAddressPrivate = function(aIP)
	{
		/* 
			checking private ranges - thanks to callimachus
			The private IP blocks as documented in RFC 1918 and RFC 3330: 
				1 - 10.0.0.0 - 10.255.255.255
				2 - 127.0.0.0 - 127.255.255.255
				3 - 172.16.0.0 - 172.31.255.255
				4 - 169.254.0.0 - 169.254.255.255
				5 - 192.168.0.0 - 192.168.255.255
		*/
		var nodos = aIP.split('.');
		if(nodos.length==4)
		{
			/* cheking ranges 1,2,5,4' */
			if(nodos[0] == '10' || nodos[0] == '127' || nodos[0]+'.'+nodos[1] == '192.168' || nodos[0]+'.'+nodos[1] == '169.254')
				return true;
			/* cheking ranges 3 */
			if((nodos[0] == '172') && (nodos[1] >= 16 && nodos[1] <= 31))
				return true;
		}
		return false;
	}
