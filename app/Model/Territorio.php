<?php
App::uses('AppModel', 'Model');
/**
 * Territorio Model
 *
 */
class Territorio extends AppModel {
	public $useTable = 'territorios';

	public $virtualFields = array(
		'area' => "ST_Area(the_geom)",
		'geoJSON' => "ST_AsGeoJSON(ST_Transform(ST_SetSRID(the_geom,4674),4326))",       
		'bounds' => "ST_AsGeoJSON(ST_Envelope(ST_Transform(ST_SetSRID(the_geom,4674),4326)))"       
	);     

}
