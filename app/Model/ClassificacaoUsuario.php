<?php
App::uses('AppModel', 'Model');
/**
 * ClassificacaoUsuario Model
 *
 * @property Usuario $Usuario
 * @property Classificacao $Classificacao
 */
class ClassificacaoUsuario extends AppModel {

//The Associations below have been created with all possible keys, those that are not needed can be removed

/**
 * belongsTo associations
 *
 * @var array
 */
	public $belongsTo = array(
		'Usuario' => array(
			'className' => 'Usuario',
			'foreignKey' => 'usuario_id',
			'conditions' => '',
			'fields' => '',
			'order' => ''
		),
		'Classificacao' => array(
			'className' => 'Classificacao',
			'foreignKey' => 'classificacao_id',
			'conditions' => '',
			'fields' => '',
			'order' => ''
		)
	);
}
