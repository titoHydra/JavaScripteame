	this.sha256 = function(aString)
	{
		var converter =
		  Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].
			createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
		
		// we use UTF-8 here, you can choose other encodings.
		converter.charset = "UTF-8";
		// result is an out parameter,
		// result.value will contain the array length
		var result = {};
		// data is an array of bytes
		var data = converter.convertToByteArray(aString, result);
		var ch = Components.classes["@mozilla.org/security/hash;1"]
						   .createInstance(Components.interfaces.nsICryptoHash);
		ch.init(ch.SHA256);
		ch.update(data, data.length);
		var hash = ch.finish(false);
		
		// return the two-digit hexadecimal code for a byte
		function toHexString(charCode)
		{
		  return ("0" + charCode.toString(16)).slice(-2);
		}
		
		// convert the binary hash data to a hex string.
		var s = [toHexString(hash.charCodeAt(i)) for (i in hash)].join("");
		// s now contains your hash in hex: should be
		// 5eb63bbbe01eeed093cb22bb8f5acdc3
		return s;
	}
