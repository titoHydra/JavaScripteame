<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<?
class addons
{
	function addons()
	{
		$this->addons_dir = str_replace("\\", "/", dirname(__FILE__)."/");
	}
	function crear_dir($dir)
	{ 
		if(!file_exists($dir))
		{
			$carpetas = explode("/", $dir);
			$num = count($carpetas);
			for($a = 0;$a < $num;$a++)
			{
				if(!file_exists($carpetas[$a]) and $carpetas[$a] != '')
				{
					$carpetas[$a] = rawurldecode($carpetas[$a]);

					mkdir($carpetas[$a]);
				}
				$carpetas[$a + 1] = ($carpetas[$a] . '/' . $carpetas[$a + 1]);
			}
		}
	}
	function guardar_archivo($ruta, $contenido)
	{
		$this->crear_dir(dirname($ruta));
		file_put_contents($ruta, $contenido);
	}
	function sort_by_string_length($array)
	{
		$fin = count($array);
		
		$new_array = array();    
		
		for($i=0;$i<$fin;$i++)
		{
			$new_array[strlen($array[$i])][] = $array[$i];
		}
		
		ksort($new_array);
		
		foreach($new_array as $key => $value)
		{
			$str .= implode("\n", $new_array[$key])."\n";
		}
		
		return explode("\n", trim($str));
	}

	// delete files on temporal directory
	function delete_temp_directory($dir)
	{

		if ($dh = @opendir($dir)) 
		{
			while(($file = readdir($dh)) !== false)
			{
				if($file != "." and $file != "..")  
				{
					if(!is_dir($dir.$file))
					{
						//echo $dir.$file.'<br>';
						@unlink($dir.$file);
						@rmdir($dir.$file);
					}
					if(is_dir($dir.$file)) 
					{
						$newdir = $dir.$file."/";
						chdir($newdir);
						//echo $dir.$file.'<br>';
						@unlink($newdir);
						@rmdir($newdir);
						$this->delete_temp_directory($newdir);
					} 
				}            
			}
			chdir("..");
		}
	}
	function copy_to_temp_directory($dir)
	{
		$dir = str_replace('\\', '/', $dir);
		if ($dh = opendir($dir)) 
		{
			while(($file = readdir($dh)) !== false)
			{
				if( $file != "." and $file != "..")  
				{
					if(!is_dir($dir.$file))
					{
						$this->crear_dir(dirname(str_replace($this->origen, $this->temp_dir, str_replace($this->lib, $this->temp_dir.'chrome/content/lib/', $dir.$file))));
						copy($dir.$file, str_replace($this->lib, $this->temp_dir.'chrome/content/lib/', str_replace($this->origen, $this->temp_dir, $dir.$file)));
					}
					if(is_dir($dir.$file))
					{
						$this->crear_dir(dirname($dir.$file));
						$newdir = $dir.$file."/";
						chdir($newdir);
						$this->copy_to_temp_directory($newdir);
					} 
				}            
			}
			chdir("..");
		}
	}
	function copy_from_to_directory($dir, $to, $desde='')
	{
		if($desde == '')
			$desde = $dir;
		if ($dh = @opendir($dir)) 
		{
			while(($file = readdir($dh)) !== false)
			{
				if( $file != "." and $file != "..")  
				{
					if(!is_dir($dir.$file))
					{
						$this->crear_dir(dirname(str_replace($desde, $to, $dir.$file)));
						copy($dir.$file, str_replace($desde, $to, $dir.$file));
					}
					if(is_dir($dir.$file))
					{
						$this->crear_dir(dirname($dir.$file));
						$newdir = $dir.$file."/";
						chdir($newdir);
						$this->copy_from_to_directory($newdir, $to, $dir);
					} 
				}            
			}
			chdir("..");
		}
	}
	// Recursive function to list all files on a directory
	function list_directory($dir, &$list)
	{
		if ($dh = @opendir($dir)) 
		{
			while(($file = readdir($dh)) !== false)
			{
				if( $file != "." and $file != "..")  
				{
					if(!is_dir($dir.$file))
					{
						$list[] = str_replace("\\", "/", $dir.$file);
					}
					if(is_dir($dir.$file)) 
					{
						$newdir = $dir.$file."/";
						chdir($newdir);
						$this->list_directory($newdir, $list);
					} 
				}            
			}
			chdir("..");
		}
		return $list;
	}
	function list_directories($dir)
	{
		if ($dh = opendir($dir)) 
		{
			while(($file = readdir($dh)) !== false)
			{
				if( $file != "." and $file != "..")  
				{
					if(is_dir($dir.$file)) 
					{
						$dirs[] = $file;
					} 
				}            
			}
		}
		return $dirs;
	}
	function get_langs_list($dir)
	{
		$list = array();
		if ($dh = @opendir($dir)) 
		{
			while(($file = readdir($dh)) !== false)
			{
				if($file != "." and $file != "..")  
				{
					if(is_dir($dir.$file) )
						$list[] = $file;
				}            
			}
		}
		return $list;
	}
	function list_files($dir)
	{
		$list = array();
		if ($dh = @opendir($dir)) 
		{
			while(($file = readdir($dh)) !== false)
			{
				if($file != "." and $file != "..")  
				{
					if(is_file($dir.$file) )
						$list[] = $file;
				}            
			}
		}
		return $list;
	}
	function apply_vars($vars, $c, $varios_pases = false)
	{
		foreach($vars as $k => $v)
		{
			$c = str_replace($k, $v, $c);
		}
		if(!$varios_pases)
			$c = $this->apply_vars($vars, $c, true);
		return $c;
	}
	function thumb($origen, $destino,  $ancho = 100,$alto = 100, $calidad = 82)
	{
		@unlink($destino);
		$small = @imagecreatetruecolor($ancho, $alto);
		
		if(preg_match('~jpg$~i', $origen) || preg_match('~jpeg$~i', $origen) )
			$im = @imagecreatefromjpeg($origen);
		else if(preg_match('~gif$~i', $origen) )
			$im = @imagecreatefromgif($origen);
		else if(preg_match('~png$~i', $origen) )
		{
			$im = @imagecreatefrompng($origen);
			@imagealphablending($small, false); // setting alpha blending on
		}	
		else if(preg_match('~bmp$~i', $origen) )
			$im = @imagecreatefromwbmp($origen);

		$O_X = @imagesx($im);
		$O_Y = @imagesy($im);
		$OriginalX = $O_X;
		$OriginalY = $O_Y;
		if ($OriginalX < $OriginalY)
		{
			$OriginalY = floor(($alto * $OriginalX) / $ancho);
			@imagecopyresampled($small, $im, 0, 0, 0, ceil((($O_Y-$OriginalY)/2)), $ancho, $alto, $OriginalX, $OriginalY);
		}
		else
		{
			$OriginalX = floor(($ancho * $OriginalY) / $alto);
			@imagecopyresampled($small, $im, 0, 0, ceil((($O_X-$OriginalX)/2)), 0, $ancho, $alto, $OriginalX, $OriginalY);
		}
		@imageinterlace($small, 1);
		
		if(preg_match('~jpg$~i', $origen) || preg_match('~jpeg$~i', $origen))
			$im = @imagejpeg($small, $destino, $calidad);
		else if(preg_match('~gif$~i', $origen))
			$im = @imagegif($small, $destino, $calidad);
		else if(preg_match('~png$~i', $origen))
		{
			imagesavealpha($small, true);
			$im = @imagepng($small, $destino, 0, NULL);
		}
		else if(preg_match('~bmp$~i', $origen))
			$im = @imagewbmp($small, $destino, $calidad);

		@imagedestroy($im);
	}
    function _htmlspecialchars($string) {
        // init
        $aTransSpecchar = array(
            '&' => '&amp;',
			'"' => '&quot;',
            '<' => '&lt;',
            '>' => '&gt;'
            );                      // ENT_COMPAT set

        // return translated string
        return strtr($string,$aTransSpecchar);
    }

	function build_package_sin_jar($addon_id)
	{
		//directorios
			$this->origen   = $this->addons_dir.$addon_id."/_dev/";
			$this->destino  = $this->addons_dir.$addon_id."/releases/";
			$this->lib = str_replace("\\", "/", dirname(__FILE__)."/_lib/");
			$this->temp_dir = str_replace("\\", "/", dirname(dirname(__FILE__))."/_em_temp/".$addon_id."/");
			$this->delete_temp_directory($this->temp_dir);
	
		//datos de la version
			$datos = explode("\n", file_get_contents($this->origen.'info.txt'));
			
			$vars['__EXT_ID__']= $datos[5]; 		
			$vars['__EXT_NOMBRE__'] = $datos[0];
			$vars['__EXT_NOMBRE_QUOTE__'] = $this->_htmlspecialchars($datos[0]);
			$vars['__EXT_DESCRIPCION__'] = $datos[1];
			$vars['__EXT_DESCRIPCION_QUOTE__'] = $this->_htmlspecialchars($datos[1]);
			$vars['__EXT_SUBVERSION__'] = $datos[6];
			$vars['__EXT_VERSION__'] = $datos[2].'.'.date('ymd').'.'.$vars['__EXT_SUBVERSION__'];
			$vars['__EXT_AUTOR__']= $datos[3];
			$vars['__EXT_AUTOR_EMAIL__']= $datos[4];
			$vars['__EXT_ANO__']= date('Y'); 		
			$vars['myExt']= $addon_id; 		
			 
			if($datos[7] != '')
			{
				$vars['__EXT_HOME_PAGE__'] = '<em:homepageURL>'.$datos[7].'</em:homepageURL>';
				$vars['__EXT_HOME_PAGE_URL__'] = $datos[7];
			}
			else
			{
				$vars['__EXT_HOME_PAGE__'] = '';
				$vars['__EXT_HOME_PAGE_URL__'] = '';
			}
			$vars['__EXT_DONATE__'] = $datos[8];
		/* CHROME.MANIFEST*/
			$chrome_manifest = '
content	myExt chrome/content/

overlay	chrome://browser/content/browser.xul chrome://myExt/content/xul/navigator/navigator.xul
overlay	chrome://navigator/content/navigator.xul chrome://myExt/content/xul/navigator/navigator.xul
';
			
		/* ICON */
			if(file_exists($this->origen.'icon.png'))
			{
				$this->crear_dir($this->temp_dir.'chrome/content/icon/');
				copy($this->origen.'icon.png', $this->temp_dir.'chrome/content/icon/icon.png');
				copy($this->origen.'icon.png', $this->temp_dir.'icon.png');
				$this->thumb($this->origen.'icon.png', $this->temp_dir.'chrome/content/icon/icon32.png', 32,32);
				$this->thumb($this->origen.'icon.png', $this->temp_dir.'chrome/content/icon/icon24.png', 24,24);
				$this->thumb($this->origen.'icon.png', $this->temp_dir.'chrome/content/icon/icon16.png', 16,16);
				
				$vars['__ICON_URL32__'] = 'chrome://myExt/content/icon/icon32.png';
				$vars['__ICON_URL24__'] = 'chrome://myExt/content/icon/icon24.png';
				$vars['__ICON_URI16__'] = 'chrome://myExt/content/icon/icon16.png';
				$vars['__ICON_URL__']   = '<em:iconURL>chrome://myExt/content/icon/icon.png</em:iconURL>';
			}
			else
			{
				$vars['__ICON_URL32__'] = '';
				$vars['__ICON_URL24__'] = '';
				$vars['__ICON_URI16__'] = '';
				$vars['__ICON_URL__'] = '';
			}
		/* PREFERENCIAS */
			//prefrences.js
			if(file_exists($this->origen.'preferences.js'))
				$this->guardar_archivo($this->temp_dir.'defaults/preferences/'.$addon_id.'.js', $this->apply_vars($vars, file_get_contents($this->origen.'preferences.js')));
			//preferences.xul
			if(file_exists($this->origen.'xul/preferences/preferences.xul'))
			{
				$this->guardar_archivo($this->temp_dir.'chrome/content/xul/preferences/preferences.xul', trim($this->apply_vars($vars,  file_get_contents($this->origen.'xul/preferences/preferences.xul'))));
				$vars['__PREFERENCES_URL__'] = '<em:optionsURL>chrome://'.$addon_id.'/content/xul/preferences/preferences.xul</em:optionsURL>';
			}
			else
				$vars['__PREFERENCES_URL__'] = '';

		//NAVIGATOR
			$overlay = '
<?xml version="1.0" encoding="UTF-8"?>
';
//xul.dtd
if(file_exists($this->origen.'locales/en-US/xul.dtd'))
{
$overlay .='
<!-- xul localized strings -->
	<!DOCTYPE overlay SYSTEM "chrome://myExt/locale/xul.dtd"> 
';
}
	//css 
		$css = array();
		$this->list_directory($this->origen.'xul/navigator/', $css);
		$hay_css = false;
		foreach($css as $file)
		{
			if(preg_match('~css$~', $file))
			{
				$hay_css = true;
				break;
			}
		}
		if($hay_css)
		{
$overlay .='
<!-- css styles for navigator -->';
		}
		foreach($css as $file)
		{
			if(preg_match('~css$~', $file))
			{
				$overlay .= "\n\t".'<?xml-stylesheet href="chrome://myExt/content/xul/navigator/'.str_replace($this->origen.'xul/navigator/', '', $file).'" type="text/css"?>';
				$this->guardar_archivo($this->temp_dir.'chrome/content/xul/navigator/'.str_replace($this->origen.'xul/navigator/', '', $file), trim($this->apply_vars($vars, file_get_contents($file))));
			}
			else if(preg_match('~png$~', $file) || preg_match('~gif$~', $file) || preg_match('~jpg$~', $file) || preg_match('~jpeg$~', $file) )
			{
				$this->crear_dir(dirname($this->temp_dir.'chrome/content/xul/navigator/'.str_replace($this->origen.'xul/navigator/', '', $file)));
				copy($file, $this->temp_dir.'chrome/content/xul/navigator/'.str_replace($this->origen.'xul/navigator/', '', $file));
			}
		}


$overlay .= '

<overlay xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul">

';
//js.properties
if(file_exists($this->origen.'locales/en-US/js.properties'))
{
	$overlay .='<!-- js localized strings -->
	<stringbundleset id="stringbundleset">
		<stringbundle id="myExt-localization" src="chrome://myExt/locale/js.properties"/>
	</stringbundleset>

';
	$this->guardar_archivo($this->temp_dir.'chrome/content/core/jsStrings.js', $this->apply_vars($vars, file_get_contents(dirname(__FILE__).'/_core/jsStrings.js')));
	$sources .= file_get_contents($this->temp_dir.'chrome/content/core/jsStrings.js');
}

	$overlay .= '<!-- controller -->'."\n";
	$overlay .= "\t".'<script type="application/x-javascript" src="chrome://myExt/content/core/navigator.js"/>'."\n";
	
	$this->guardar_archivo($this->temp_dir.'chrome/content/core/navigator.js', $this->apply_vars($vars, file_get_contents(dirname(__FILE__).'/_core/navigator.js')));
	$sources .= file_get_contents($this->temp_dir.'chrome/content/core/navigator.js');
			if(file_exists($this->origen.'js/preferences.js'))
			{
				$overlay .= '<!-- options -->'."\n";
				$overlay .= "\t".'<script type="application/x-javascript" src="chrome://myExt/content/core/preferences.js"/>'."\n";
				$this->guardar_archivo($this->temp_dir.'chrome/content/core/preferences.js', $this->apply_vars($vars, file_get_contents(dirname(__FILE__).'/_core/preferences.js')));
				$sources .= file_get_contents($this->temp_dir.'chrome/content/core/preferences.js');
			}

			if(file_exists($this->origen.'locales/en-US/js.properties'))
			{
				$overlay .= '<!-- jsStrings -->'."\n";
				$overlay .= "\t".'<script type="application/x-javascript" src="chrome://myExt/content/core/jsStrings.js"/>'."\n";
			}
			//JS LIB
				//modules looking for functions
					$js_modules = array();
					$this->list_directory($this->origen, $js_modules);
					
					foreach($js_modules as $file)
					{
						if(preg_match('~xul$~', $file) || preg_match('~js$~', $file))
							$sources .= $this->apply_vars($vars, file_get_contents($file));
					}
					
				//lib names
					$lib_functions = array();
					$this->list_directory(dirname(__FILE__).'/_lib/', $lib_functions);
					$js_functions = array();
					foreach($lib_functions as $file)
					{
						if(!preg_match('~js$~', $file))
							continue;
						$js_functions[names][] = preg_replace('~.js$~', '', basename($file));
						$js_functions[files][] = $file;
					}
					//print_r($js_functions[names]);
					$include_lib = array();
					while(true)
					{
						$anadido = false;
						foreach($js_functions[names] as $k => $v)
						{
							if(strpos($sources, $v.'(') !== false)
							{
								if(!in_array($js_functions[files][$k], $include_lib))
								{
									$anadido = true;
									$include_lib[] = $js_functions[files][$k];
									$sources .= file_get_contents($js_functions[files][$k]);
								}
							}
						}
						if($anadido === false)
							break;
					}
				
					natsort($include_lib);

				$overlay .= "\n".'<!-- js lib -->'."\n";
				
				$librerias = $this->list_directories(dirname(__FILE__).'/_lib/');
				foreach($librerias as $lib)
				{
						$contenido = '(function()
{
';
					$anadido = false;
					
					foreach($include_lib as $file)
					{
						if(strpos($file, '_lib/'.$lib.'/') !== false)
						{
							$anadido = true;
							$contenido .= "\t".trim(file_get_contents($file))."\n"; 
							$dir_fotos = dirname($file).'/'.preg_replace('~.js$~', '', basename($file)).'/';
							if(file_exists($dir_fotos) && is_dir($dir_fotos))
							{
							//	echo 'es un dir de fotos '.$dir_fotos;
								$this->copy_to_temp_directory($dir_fotos);
							}
						}
					}
					if($anadido === false)
						continue;
				$contenido .= '
	return null;

}).apply(myExt);
';
					$this->guardar_archivo($this->temp_dir.'chrome/content/lib/'.$lib.'.js', $this->apply_vars($vars, $contenido));
					$overlay .= "\t".'<script type="application/x-javascript" src="chrome://myExt/content/lib/'.$lib.'.js"/>'."\n";
				}
				
			//modules
				$overlay .= "\n".'<!-- extension js -->'."\n";
				$js_modules = array();
				$this->list_directory($this->origen.'js/', $js_modules);
				
						$modules_header = '(function()
{
';
				$modules_footer = '
	return null;

}).apply(myExt);
';
				natsort($js_modules);
			//	$js_modules = array_reverse($js_modules);
				foreach($js_modules as $file)
				{
					$this->guardar_archivo($this->temp_dir.'chrome/content/js/'.str_replace($this->origen.'js/', '', $file), $this->apply_vars($vars, $modules_header.file_get_contents($file).$modules_footer));
					$overlay .= "\t".'<script type="application/x-javascript" src="chrome://myExt/content/js/'.str_replace($this->origen.'js/', '', $file).'"/>'."\n";
				}
				
			//xul overlays
				$xul_overlays = array();
				$this->list_directory($this->origen.'xul/navigator/', $xul_overlays);
				foreach($xul_overlays as $file)
				{
					if(preg_match('~xul$~', $file))
						$overlay .= "\n".file_get_contents($file)."\n";
					if(preg_match('~toolbar.css$~', $file))
						$chrome_manifest .= 'style chrome://global/content/customizeToolbar.xul chrome://myExt/content/xul/navigator/toolbar.css'."\n";
				}
			//keysets!
				if(file_exists($this->origen.'xul/mainKeyset/'))
				{
					$overlay .= "\n".'<keyset id="mainKeyset">'."\n";
					$overlay .= file_get_contents($this->origen.'xul/mainKeyset/mainKeyset.xul');
					$overlay .= "\n</keyset>\n";
				}
			//closing file
				$overlay .= '</overlay>';
		
			$this->guardar_archivo($this->temp_dir.'chrome/content/xul/navigator/navigator.xul', trim($this->apply_vars($vars, $overlay)));
			
		/* LOCALES */ 	
			//copiando localizaciones
			$langs = $this->get_langs_list($this->origen.'locales/');
			foreach($langs as $lang)
				$chrome_manifest .= 'locale	'.$addon_id.'	'.$lang.'	chrome/locale/'.$lang.'/'."\n";

			$this->copy_from_to_directory($this->origen.'locales/', $this->temp_dir.'chrome/locale/');
		
			$archivos_de_localizacion = array();
			$this->list_directory($this->temp_dir.'chrome/locale/', $archivos_de_localizacion);
			foreach($archivos_de_localizacion as $f)
			{
				$this->guardar_archivo($f,  $this->apply_vars($vars, file_get_contents($f)));
			}

		/*XUL OVERLAYS - ACA NUEVOS METER*/
			//about
				$xul_overlays = array();
				$this->list_directory($this->origen.'xul/about/', $xul_overlays);
				foreach($xul_overlays as $file)
				{
					if(file_exists($this->origen.'locales/en-US/about.dtd'))
						$__LANG_DTD__ = "<!-- xul localized strings -->\n\t".'<!DOCTYPE overlay SYSTEM "chrome://myExt/locale/about.dtd">';
					else
						$__LANG_DTD__ = '';
					
					$chrome_manifest .= 'overlay	chrome://mozapps/content/extensions/about.xul	chrome://myExt/content/xul/about/about.xul'."\n";
					
					if(preg_match('~png$i~', $file) || preg_match('~gif$i~', $file) || preg_match('~jpg$i~', $file) || preg_match('~jpeg$i~', $file) )
					{
						$this->crear_dir(dirname($this->temp_dir.'chrome/content/xul/about/'.str_replace($this->origen.'xul/about/', '', $file)));
						copy($file, $this->temp_dir.'chrome/content/xul/about/'.str_replace($this->origen.'xul/about/', '', $file));
					}
					else
					{
						$this->guardar_archivo($this->temp_dir.'chrome/content/xul/about/'.basename($file),trim($this->apply_vars($vars,  str_replace('__LANG_DTD__', $__LANG_DTD__, file_get_contents($file)))));
					}
				}
			//console
				$xul_overlays = array();
				$this->list_directory($this->origen.'xul/console/', $xul_overlays);
				foreach($xul_overlays as $file)
				{
					if(file_exists($this->origen.'locales/en-US/console.dtd'))
						$__LANG_DTD__ = "<!-- xul localized strings -->\n\t".'<!DOCTYPE overlay SYSTEM "chrome://myExt/locale/console.dtd">';
					else
						$__LANG_DTD__ = '';
					
					$chrome_manifest .= 'overlay	chrome://console2/content/console2.xul chrome://myExt/content/xul/console/console.xul'."\n".'overlay	chrome://global/content/console.xul chrome://myExt/content/xul/console/console.xul'."\n";
					
					if(preg_match('~png$i~', $file) || preg_match('~gif$i~', $file) || preg_match('~jpg$i~', $file) || preg_match('~jpeg$i~', $file) )
					{
						$this->crear_dir(dirname($this->temp_dir.'chrome/content/xul/console/'.str_replace($this->origen.'xul/console/', '', $file)));
						copy($file, $this->temp_dir.'chrome/content/xul/console/'.str_replace($this->origen.'xul/console/', '', $file));
					}
					else
					{
						$this->guardar_archivo($this->temp_dir.'chrome/content/xul/console/'.basename($file), trim($this->apply_vars($vars, str_replace('__LANG_DTD__', $__LANG_DTD__, file_get_contents($file)))));
					}
				}
				
			//console
				$xul_overlays = array();
				$this->list_directory($this->origen.'xul/komodo/', $xul_overlays);
				foreach($xul_overlays as $file)
				{
					if(file_exists($this->origen.'locales/en-US/komodo.dtd'))
						$__LANG_DTD__ = "<!-- xul localized strings -->\n\t".'<!DOCTYPE overlay SYSTEM "chrome://myExt/locale/komodo.dtd">';
					else
						$__LANG_DTD__ = '';
					

					$chrome_manifest .= 'overlay chrome://komodo/content/komodo.xul chrome://myExt/content/xul/komodo/komodo.xul'."\n";
					
					if(preg_match('~png$i~', $file) || preg_match('~gif$i~', $file) || preg_match('~jpg$i~', $file) || preg_match('~jpeg$i~', $file) )
					{
						$this->crear_dir(dirname($this->temp_dir.'chrome/content/xul/komodo/'.str_replace($this->origen.'xul/komodo/', '', $file)));
						copy($file, $this->temp_dir.'chrome/content/xul/komodo/'.str_replace($this->origen.'xul/komodo/', '', $file));
					}
					else
					{
						$this->guardar_archivo($this->temp_dir.'chrome/content/xul/komodo/'.basename($file), $this->apply_vars($vars, str_replace('__LANG_DTD__', $__LANG_DTD__, trim(file_get_contents($file)))));
					}
				}
				
			//components
				$components= array();
				$this->list_directory(dirname(__FILE__).'/_components/', $components);
				foreach($components as $file)
				{
					if(strpos($sources, preg_replace('~.js$~', '', basename($file))) !== false)
					{
						$this->guardar_archivo($this->temp_dir.'components/'.str_replace(str_replace('\\', '/', dirname(__FILE__)).'/_components/', '', $file), trim($this->apply_vars($vars, file_get_contents($file))));
					}
				}

				$chrome_manifest = explode("\n", $chrome_manifest);
				$chrome_manifest = array_unique($chrome_manifest);
				$chrome_manifest = implode("\n", $chrome_manifest);
				
				$this->guardar_archivo($this->temp_dir.'chrome.manifest', $this->apply_vars($vars, $this->apply_vars($vars, $chrome_manifest)));

		//remplazando variables en archivos de informacion
			$this->guardar_archivo($this->temp_dir.'install.rdf', $this->apply_vars($vars, file_get_contents($this->origen.'install.rdf')));
			$this->guardar_archivo($this->temp_dir.'license.txt', $this->apply_vars($vars, file_get_contents(dirname(__FILE__).'/license.txt')));


echo 'hou yeah';
		/* ZIP FILE */
			$this->xpi_file = $addon_id.'-'.$vars['__EXT_VERSION__']."-".time().".xpi"; 

			$zip = new ZipArchive();
			
			$filename = $this->destino."/".$this->xpi_file;
			$this->crear_dir(dirname($filename));
			@unlink($filename);
			if ($zip->open($filename, ZIPARCHIVE::CREATE)!==TRUE)
				die("cannot open <".$filename.">");
			$a = array();
			$list = $this->list_directory($this->temp_dir,$a);

			for($a=0;$a<count($list);$a++)
			{
				$zip->addFile($list[$a], str_replace($this->temp_dir, "", $list[$a]));
			}
			$zip->close();
			
		//Ask for Add-on instalation
			echo "<script>window.open('".$addon_id.'/releases/'.$this->xpi_file."', '_top')</script>";
			echo "<script>close()</script>";
	}	
	
}
	echo '<h1>Complex Extension builder</h1><ul>';

	$dir = dirname(__FILE__).'/';
	if ($dh = @opendir($dir)) 
	{
	   while(($file = readdir($dh)) !== false)
		{
		   if( 
		   $file != "." &&  
		   $file != ".." &&  
		   strpos($file, '.php') === false &&  
		   strpos($dir.$file, '_em/_') === false && 
		   is_dir($file) && 
		   !is_dir(dirname(__FILE__).'/'.$file.'/_dev/chrome')
		   )
				$XPIs[] = "<li><a href=\"?XPI=".$file."\">".$file."</a></li>";
	   }
	   @chdir("..");
	}
	echo implode("", $XPIs);
	
	$addon = new addons();
	if($_GET[XPI]!='')
		$addon->build_package_sin_jar($_GET[XPI]);
?>