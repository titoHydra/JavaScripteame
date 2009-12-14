	//shorts the childs elements of a node to maxChilds elements
	this.shortChilds = function (anElement, maxChilds, fromTop)
	{
		if(anElement.hasChildNodes())
		{
			var nodesForDeletion = []
			var length = anElement.childNodes.length;
			if(length<=maxChilds)
				return;
			var nodesToRemove = length-maxChilds;
			var nodesRemoved = 0;
			
			if(fromTop)
			{
				for(var a=length-1;a>=0;a--)
				{
					if(!anElement.childNodes[a].hasAttribute('locked'))
					{
						nodesForDeletion[nodesForDeletion.length] = anElement.childNodes[a];
						nodesRemoved++;
						if(nodesRemoved == nodesToRemove)
							break;
					}
				}
			}
			else
			{
				for(var a=0;a<length;a++)
				{
					if(!anElement.childNodes[a].hasAttribute('locked'))
					{
						nodesForDeletion[nodesForDeletion.length] = anElement.childNodes[a];
						nodesRemoved++;
						if(nodesRemoved == nodesToRemove)
							break;
					}
				}
			}
			for(var id in nodesForDeletion)
				anElement.removeChild(nodesForDeletion[id]);
		}
	}
