<?php
/**
 * EnderecoFixture
 *
 */
class EnderecoFixture extends CakeTestFixture {

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'pessoa_id' => array('type' => 'integer', 'null' => true),
		'municipio_id' => array('type' => 'integer', 'null' => true),
		'logradouro' => array('type' => 'string', 'null' => true),
		'numero' => array('type' => 'string', 'null' => true),
		'complemento' => array('type' => 'string', 'null' => true),
		'bairro' => array('type' => 'string', 'null' => true),
		'cep' => array('type' => 'string', 'null' => true, 'length' => 10),
		'created' => array('type' => 'datetime', 'null' => true),
		'modified' => array('type' => 'datetime', 'null' => true),
		'municipio' => array('type' => 'string', 'null' => true),
		'uf' => array('type' => 'string', 'null' => true, 'length' => 2),
		'estado_id' => array('type' => 'integer', 'null' => true),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id'),
			'enderecos_municipio_id' => array('unique' => false, 'column' => 'municipio_id'),
			'enderecos_pessoa_id' => array('unique' => false, 'column' => 'pessoa_id')
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
			'pessoa_id' => 1,
			'municipio_id' => 1,
			'logradouro' => 'Lorem ipsum dolor sit amet',
			'numero' => 'Lorem ipsum dolor sit amet',
			'complemento' => 'Lorem ipsum dolor sit amet',
			'bairro' => 'Lorem ipsum dolor sit amet',
			'cep' => 'Lorem ip',
			'created' => '2014-04-11 17:07:44',
			'modified' => '2014-04-11 17:07:44',
			'municipio' => 'Lorem ipsum dolor sit amet',
			'uf' => '',
			'estado_id' => 1
		),
	);

}
