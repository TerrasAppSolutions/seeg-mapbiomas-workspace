<?php
/**
 * PropriedadeFixture
 *
 */
class PropriedadeFixture extends CakeTestFixture {

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'nome' => array('type' => 'string', 'null' => true),
		'denominacao' => array('type' => 'string', 'null' => true),
		'documento_fundiario' => array('type' => 'string', 'null' => true),
		'natureza' => array('type' => 'string', 'null' => true),
		'area_imovel' => array('type' => 'float', 'null' => true),
		'endereco' => array('type' => 'string', 'null' => true),
		'municipio_id' => array('type' => 'integer', 'null' => true),
		'cep' => array('type' => 'string', 'null' => true, 'length' => 64),
		'created' => array('type' => 'datetime', 'null' => true),
		'modified' => array('type' => 'datetime', 'null' => true),
		'estado_id' => array('type' => 'integer', 'null' => true),
		'the_geom' => array('type' => 'text', 'null' => true),
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
			'nome' => 'Lorem ipsum dolor sit amet',
			'denominacao' => 'Lorem ipsum dolor sit amet',
			'documento_fundiario' => 'Lorem ipsum dolor sit amet',
			'natureza' => 'Lorem ipsum dolor sit amet',
			'area_imovel' => 1,
			'endereco' => 'Lorem ipsum dolor sit amet',
			'municipio_id' => 1,
			'cep' => 'Lorem ipsum dolor sit amet',
			'created' => '2014-04-11 17:13:38',
			'modified' => '2014-04-11 17:13:38',
			'estado_id' => 1,
			'the_geom' => 'Lorem ipsum dolor sit amet, aliquet feugiat. Convallis morbi fringilla gravida, phasellus feugiat dapibus velit nunc, pulvinar eget sollicitudin venenatis cum nullam, vivamus ut a sed, mollitia lectus. Nulla vestibulum massa neque ut et, id hendrerit sit, feugiat in taciti enim proin nibh, tempor dignissim, rhoncus duis vestibulum nunc mattis convallis.'
		),
	);

}
