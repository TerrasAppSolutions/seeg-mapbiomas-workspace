<?php
/**
 * PessoaJuridicaFixture
 *
 */
class PessoaJuridicaFixture extends CakeTestFixture {

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'pessoa_id' => array('type' => 'integer', 'null' => false),
		'razao_social' => array('type' => 'string', 'null' => false),
		'nome_fantasia' => array('type' => 'string', 'null' => true),
		'cnpj' => array('type' => 'string', 'null' => false),
		'tipo' => array('type' => 'string', 'null' => true),
		'created' => array('type' => 'datetime', 'null' => true),
		'modified' => array('type' => 'datetime', 'null' => true),
		'data_fundacao' => array('type' => 'date', 'null' => true),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id'),
			'pessoa_juridica_pessoa_id' => array('unique' => false, 'column' => 'pessoa_id')
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
			'razao_social' => 'Lorem ipsum dolor sit amet',
			'nome_fantasia' => 'Lorem ipsum dolor sit amet',
			'cnpj' => 'Lorem ipsum dolor sit amet',
			'tipo' => 'Lorem ipsum dolor sit amet',
			'created' => '2014-04-11 17:12:02',
			'modified' => '2014-04-11 17:12:02',
			'data_fundacao' => '2014-04-11'
		),
	);

}
