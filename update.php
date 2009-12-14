<? 
@include('/home/content/e/x/t/extdeve/html/_stats/logear.php');

header("Content-type: text/xml");

echo '<'.'?xml version="1.0" encoding="UTF-8"?'.'>'."\n";

/*
	Firefox     {ec8030f7-c20a-464f-9b0e-13a3a9e97384} 2.0.0.11
	Thunderbird {3550f703-e582-4d05-9a08-453d09bdfdc6} 1.5.0.13 + 2.0.0.9
	
	Sunbird     {718e30fb-e89b-41dd-9da7-e25a45638b28} 0.3a1+ | 0.3a2
	Nvu         {136c295a-4a5a-41cf-bf24-5cee526720d5} 1.0
	Etna        {3a699c0b-c85e-4a8d-baf1-948bdcfb75bd} 0.3.1
	Flock       {a463f10c-3994-11da-9945-000d60ca027b} 0.7.14
	ChatZilla!  {59c81df5-4b7a-477b-912d-4e0fdf64e5f2} 0.9.75
	
	Mango       {4669bfc0-2957-11da-8cd6-0800200c9a66} 0 | 0.2
	Netscape    {3db10fab-e461-4c80-8b97-957ad5f8ea47} 8.1
	Songbird    {758DAD28-FDE9-4ab8-A301-3FFFAB3A697A} 0.1
	Songbird    songbird@songbirdnest.com              0 | 0.2
	"SeaMonkey" {92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a} 1.5a
	
*/

?>
<r:RDF xmlns:r="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
       xmlns="http://www.mozilla.org/2004/em-rdf#">
<?
		$dir = dirname(__FILE__).'/XPI/';
		if ($dh = opendir($dir)) 
		{
			while(($file = readdir($dh)) !== false)
			{
				if($file != "." and $file != "..")  
				{
					if(!is_dir($dir.$file) and eregi('rdf$', $file))
					{
						echo file_get_contents($dir.$file);
					}
				}            
			}
		}
?>

</r:RDF>