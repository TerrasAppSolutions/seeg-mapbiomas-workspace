<?php
App::uses('AppModel', 'Model');
/**
 * UsuarioPerfil Model
 *
 * @property Usuario $Usuario
 * @property Perfil $Perfil
 */
class UsuarioPerfil extends AppModel {


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
		'Perfil' => array(
			'className' => 'Perfil',
			'foreignKey' => 'perfil_id',
			'conditions' => '',
			'fields' => '',
			'order' => ''
		)
	);
}
