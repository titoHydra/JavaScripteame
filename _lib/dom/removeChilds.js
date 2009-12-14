	//removes all non locked childs from a node
	this.removeChilds = function (anElement)
	{
		if(anElement.hasChildNodes())
		{
			var deletion = []
			var length = anElement.childNodes.length;
			for(var a=0;a<length;a++)
			{
				if(!anElement.childNodes[a].hasAttribute('locked'))
					deletion[deletion.length] = anElement.childNodes[a];
			}
			for(var id in deletion)
				anElement.removeChild(deletion[id]);
		}
	}
