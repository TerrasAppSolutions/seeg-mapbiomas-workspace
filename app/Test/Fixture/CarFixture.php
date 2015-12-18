<?php
/**
 * CarFixture
 *
 */
class CarFixture extends CakeTestFixture {

/**
 * Table name
 *
 * @var string
 */
	public $table = 'cars';

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'status' => array('type' => 'string', 'null' => true, 'length' => 64),
		'numero' => array('type' => 'string', 'null' => true, 'length' => 64),
		'nome' => array('type' => 'string', 'null' => true),
		'denominacao' => array('type' => 'string', 'null' => true),
		'documento_fundiario' => array('type' => 'string', 'null' => true),
		'natureza' => array('type' => 'string', 'null' => true),
		'area_imovel' => array('type' => 'float', 'null' => true),
		'endereco' => array('type' => 'string', 'null' => true),
		'municipio_id' => array('type' => 'integer', 'null' => true),
		'cep' => array('type' => 'string', 'null' => true, 'length' => 64),
		'tecnico_nome' => array('type' => 'string', 'null' => true),
		'tecnico_orgao' => array('type' => 'string', 'null' => true),
		'gps_marca' => array('type' => 'string', 'null' => true),
		'gps_modelo' => array('type' => 'string', 'null' => true),
		'gps_precisao' => array('type' => 'string', 'null' => true),
		'created' => array('type' => 'datetime', 'null' => true),
		'modified' => array('type' => 'datetime', 'null' => true),
		'propriedade_id' => array('type' => 'integer', 'null' => true),
		'validado' => array('type' => 'boolean', 'null' => true),
		'matricula' => array('type' => 'string', 'null' => true),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id')
		),
		'tableParameters' => array()
	);

/**
 * Records
 *
 * @var array
 */
	public $records = array(
		array(
			'id' => 1,
			'status' => 'Lorem ipsum dolor sit amet',
			'numero' => 'Lorem ipsum dolor sit amet',
			'nome' => 'Lorem ipsum dolor sit amet',
			'denominacao' => 'Lorem ipsum dolor sit amet',
			'documento_fundiario' => 'Lorem ipsum dolor sit amet',
			'natureza' => 'Lorem ipsum dolor sit amet',
			'area_imovel' => 1,
			'endereco' => 'Lorem ipsum dolor sit amet',
			'municipio_id' => 1,
			'cep' => 'Lorem ipsum dolor sit amet',
			'tecnico_nome' => 'Lorem ipsum dolor sit amet',
			'tecnico_orgao' => 'Lorem ipsum dolor sit amet',
			'gps_marca' => 'Lorem ipsum dolor sit amet',
			'gps_modelo' => 'Lorem ipsum dolor sit amet',
			'gps_precisao' => 'Lorem ipsum dolor sit amet',
			'created' => '2014-04-11 17:06:06',
			'modified' => '2014-04-11 17:06:06',
			'propriedade_id' => 1,
			'validado' => 1,
			'matricula' => 'Lorem ipsum dolor sit amet'
		),
	);

}
