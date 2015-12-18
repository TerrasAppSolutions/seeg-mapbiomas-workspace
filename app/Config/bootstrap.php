<?php

/**
 * This file is loaded automatically by the app/webroot/index.php file after core.php
 *
 * This file should load/create any application wide configuration settings, such as
 * Caching, Logging, loading additional configuration files.
 *
 * You should also use this file to include any files that provide global functions/constants
 * that your application uses.
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       app.Config
 * @since         CakePHP(tm) v 0.10.8.2117
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */
// Setup a 'default' cache configuration for use in the application.
Cache::config('default', array('engine' => 'File'));

/**
 * The settings below can be used to set additional paths to models, views and controllers.
 *
 * App::build(array(
 *     'Model'                     => array('/path/to/models/', '/next/path/to/models/'),
 *     'Model/Behavior'            => array('/path/to/behaviors/', '/next/path/to/behaviors/'),
 *     'Model/Datasource'          => array('/path/to/datasources/', '/next/path/to/datasources/'),
 *     'Model/Datasource/Database' => array('/path/to/databases/', '/next/path/to/database/'),
 *     'Model/Datasource/Session'  => array('/path/to/sessions/', '/next/path/to/sessions/'),
 *     'Controller'                => array('/path/to/controllers/', '/next/path/to/controllers/'),
 *     'Controller/Component'      => array('/path/to/components/', '/next/path/to/components/'),
 *     'Controller/Component/Auth' => array('/path/to/auths/', '/next/path/to/auths/'),
 *     'Controller/Component/Acl'  => array('/path/to/acls/', '/next/path/to/acls/'),
 *     'View'                      => array('/path/to/views/', '/next/path/to/views/'),
 *     'View/Helper'               => array('/path/to/helpers/', '/next/path/to/helpers/'),
 *     'Console'                   => array('/path/to/consoles/', '/next/path/to/consoles/'),
 *     'Console/Command'           => array('/path/to/commands/', '/next/path/to/commands/'),
 *     'Console/Command/Task'      => array('/path/to/tasks/', '/next/path/to/tasks/'),
 *     'Lib'                       => array('/path/to/libs/', '/next/path/to/libs/'),
 *     'Locale'                    => array('/path/to/locales/', '/next/path/to/locales/'),
 *     'Vendor'                    => array('/path/to/vendors/', '/next/path/to/vendors/'),
 *     'Plugin'                    => array('/path/to/plugins/', '/next/path/to/plugins/'),
 * ));
 *
 */
/**
 * Custom Inflector rules can be set to correctly pluralize or singularize table, model, controller names or whatever other
 * string is passed to the inflection functions
 *
 * Inflector::rules('singular', array('rules' => array(), 'irregular' => array(), 'uninflected' => array()));
 * Inflector::rules('plural', array('rules' => array(), 'irregular' => array(), 'uninflected' => array()));
 *
 */
/**
 * Plugins need to be loaded manually, you can either load them one by one or all of them in a single call
 * Uncomment one of the lines below, as you need. Make sure you read the documentation on CakePlugin to use more
 * advanced ways of loading plugins
 *
 * CakePlugin::loadAll(); // Loads all plugins at once
 * CakePlugin::load('DebugKit'); //Loads a single plugin named DebugKit
 *
 */
/**
 * You can attach event listeners to the request lifecycle as Dispatcher Filter. By default CakePHP bundles two filters:
 *
 * - AssetDispatcher filter will serve your asset files (css, images, js, etc) from your themes and plugins
 * - CacheDispatcher filter will read the Cache.check configure variable and try to serve cached content generated from controllers
 *
 * Feel free to remove or add filters as you see fit for your application. A few examples:
 *
 * Configure::write('Dispatcher.filters', array(
 * 		'MyCacheFilter', //  will use MyCacheFilter class from the Routing/Filter package in your app.
 * 		'MyPlugin.MyFilter', // will use MyFilter class from the Routing/Filter package in MyPlugin plugin.
 * 		array('callable' => $aFunction, 'on' => 'before', 'priority' => 9), // A valid PHP callback type to be called on beforeDispatch
 * 		array('callable' => $anotherMethod, 'on' => 'after'), // A valid PHP callback type to be called on afterDispatch
 *
 * ));
 */
Configure::write('Dispatcher.filters', array(
    'AssetDispatcher',
    'CacheDispatcher'
));

/**
 * Configures default file logging options
 */
App::uses('CakeLog', 'Log');
CakeLog::config('debug', array(
    'engine' => 'File',
    'types' => array('notice', 'info', 'debug'),
    'file' => 'debug',
));
CakeLog::config('error', array(
    'engine' => 'File',
    'types' => array('warning', 'error', 'critical', 'alert', 'emergency'),
    'file' => 'error',
));

/*  ==  */


// Definindo idioma da aplicação
Configure::write('Config.language', 'pt-br');

// Adicionando o caminho do locale
App::build(array('locales' => dirname(dirname(__FILE__)) . DS . 'locale' . DS));

// Alteração do inflector
$_uninflected = array('atlas', 'lapis', 'onibus', 'pires', 'virus', '.*x');
$_pluralIrregular = array(
    'abdomens' => 'abdomen',
    'alemao' => 'alemaes',
    'artesa' => 'artesaos',
    'as' => 'ases',
    'bencao' => 'bencaos',
    'cao' => 'caes',
    'capelao' => 'capelaes',
    'capitao' => 'capitaes',
    'chao' => 'chaos',
    'charlatao' => 'charlataes',
    'cidadao' => 'cidadaos',
    'consul' => 'consules',
    'cristao' => 'cristaos',
    'dificil' => 'dificeis',
    'email' => 'emails',
    'escrivao' => 'escrivaes',
    'fossel' => 'fosseis',
    'germens' => 'germen',
    'grao' => 'graos',
    'hifens' => 'hifen',
    'irmao' => 'irmaos',
    'liquens' => 'liquen',
    'mal' => 'males',
    'mao' => 'maos',
    'orfao' => 'orfaos',
    'pais' => 'paises',
    'pai' => 'pais',
    'pao' => 'paes',
    'perfil' => 'perfis',
    'projetil' => 'projeteis',
    'reptil' => 'repteis',
    'sacristao' => 'sacristaes',
    'sotao' => 'sotaos',
    'tabeliao' => 'tabeliaes',
    'banner' => 'banners',
    'newsletter' => 'newsletters',
    'status' => 'status'
);

Inflector::rules('singular', array(
    'rules' => array(
        '/^(.*)(oes|aes|aos)$/i' => '\1ao',
        '/^(.*)(a|e|o|u)is$/i' => '\1\2l',
        '/^(.*)e?is$/i' => '\1il',
        '/^(.*)(r|s|z)es$/i' => '\1\2',
        '/^(.*)ns$/i' => '\1m',
        '/^(.*)s$/i' => '\1',
    ),
    'uninflected' => $_uninflected,
    'irregular' => array_flip($_pluralIrregular)
        ), true);

Inflector::rules('plural', array(
    'rules' => array(
        '/^(.*)ao$/i' => '\1oes',
        '/^(.*)(r|s|z)$/i' => '\1\2es',
        '/^(.*)(a|e|o|u)l$/i' => '\1\2is',
        '/^(.*)il$/i' => '\1is',
        '/^(.*)(m|n)$/i' => '\1ns',
        '/^(.*)$/i' => '\1s'
    ),
    'uninflected' => $_uninflected,
    'irregular' => $_pluralIrregular
        ), true);

Inflector::rules('transliteration', array(
    '/À|Á|Â|Ã|Ä|Å|Ǻ|Ā|Ă|Ą|Ǎ/' => 'A',
    '/È|É|Ê|Ë|Ē|Ĕ|Ė|Ę|Ě/' => 'E',
    '/Ì|Í|Î|Ï|Ĩ|Ī|Ĭ|Ǐ|Į|İ/' => 'I',
    '/Ò|Ó|Ô|Õ|Ö|Ō|Ŏ|Ǒ|Ő|Ơ|Ø|Ǿ/' => 'O',
    '/Ù|Ú|Û|Ü|Ũ|Ū|Ŭ|Ů|Ű|Ų|Ư|Ǔ|Ǖ|Ǘ|Ǚ|Ǜ/' => 'U',
    '/Ç|Ć|Ĉ|Ċ|Č/' => 'C',
    '/Ð|Ď|Đ/' => 'D',
    '/Ĝ|Ğ|Ġ|Ģ/' => 'G',
    '/Ĥ|Ħ/' => 'H',
    '/Ĵ/' => 'J',
    '/Ķ/' => 'K',
    '/Ĺ|Ļ|Ľ|Ŀ|Ł/' => 'L',
    '/Ñ|Ń|Ņ|Ň/' => 'N',
    '/Ŕ|Ŗ|Ř/' => 'R',
    '/Ś|Ŝ|Ş|Š/' => 'S',
    '/Ţ|Ť|Ŧ/' => 'T',
    '/Ý|Ÿ|Ŷ/' => 'Y',
    '/Ź|Ż|Ž/' => 'Z',
    '/Ŵ/' => 'W',
    '/Æ|Ǽ/' => 'AE',
    '/ß/' => 'ss',
    '/Ĳ/' => 'IJ',
    '/Œ/' => 'OE',
    '/à|á|â|ã|ä|å|ǻ|ā|ă|ą|ǎ|ª/' => 'a',
    '/è|é|ê|ë|ē|ĕ|ė|ę|ě|&/' => 'e',
    '/ì|í|î|ï|ĩ|ī|ĭ|ǐ|į|ı/' => 'i',
    '/ò|ó|ô|õ|ö|ō|ŏ|ǒ|ő|ơ|ø|ǿ|º/' => 'o',
    '/ù|ú|û|ü|ũ|ū|ŭ|ů|ű|ų|ư|ǔ|ǖ|ǘ|ǚ|ǜ/' => 'u',
    '/ç|ć|ĉ|ċ|č/' => 'c',
    '/ð|ď|đ/' => 'd',
    '/ĝ|ğ|ġ|ģ/' => 'g',
    '/ĥ|ħ/' => 'h',
    '/ĵ/' => 'j',
    '/ķ/' => 'k',
    '/ĺ|ļ|ľ|ŀ|ł/' => 'l',
    '/ñ|ń|ņ|ň|ŉ/' => 'n',
    '/ŕ|ŗ|ř/' => 'r',
    '/ś|ŝ|ş|š|ſ/' => 's',
    '/ţ|ť|ŧ/' => 't',
    '/ý|ÿ|ŷ/' => 'y',
    '/ŵ/' => 'w',
    '/ź|ż|ž/' => 'z',
    '/æ|ǽ/' => 'ae',
    '/ĳ/' => 'ij',
    '/œ/' => 'oe',
    '/ƒ/' => 'f'
));

unset($_uninflected, $_pluralIrregular);

Cache::config('appCache', array(
    'engine' => 'File',
    'duration' => '+10 years',
    'path' => CACHE . DS . 'app',
));

Cache::config('pdfCache', array(
    'engine' => 'File',
    'duration' => '+10 years',
    'path' => CACHE . DS . 'pdf',
));

App::uses('IniReader', 'Configure');
// Read config files from app/Config
Configure::config('CONFIG', new IniReader());
Configure::load('CONFIG', 'CONFIG');

App::uses('CakeNumber', 'Utility');
CakeNumber::addFormat('BRL', array('before' => 'R$', 'thousands' => '.', 'decimals' => ','));

define('APP_BASE_PATH', ROOT . DS . APP_DIR);
define('APP_WEBROOT_BASE_PATH', ROOT . DS . APP_DIR . DS . WEBROOT_DIR);

CakePlugin::load('Mapbiomas');
CakePlugin::load('Export');
CakePlugin::load('Dashboard');
