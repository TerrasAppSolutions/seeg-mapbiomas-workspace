<?php
App::uses('AppModel', 'Model');
/**
 * Bioma Model
 *
 * @property Classificacao $Classificacao
 */
class Bioma extends AppModel {


	//The Associations below have been created with all possible keys, those that are not needed can be removed

/**
 * hasMany associations
 *
 * @var array
 */
	public $hasMany = array(
		'Classificacao' => array(
			'className' => 'Classificacao',
			'foreignKey' => 'bioma_id',
			'dependent' => false,
			'conditions' => '',
			'fields' => '',
			'order' => '',
			'limit' => '',
			'offset' => '',
			'exclusive' => '',
			'finderQuery' => '',
			'counterQuery' => ''
		)
	);

}
