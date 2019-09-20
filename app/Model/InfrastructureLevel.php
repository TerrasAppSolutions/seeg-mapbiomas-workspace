<?php
App::uses('AppModel', 'Model');
/**
 * InfrastructureLevel Model
 *
 */
class InfrastructureLevel extends AppModel {
    public $useTable = "infrastructure_levels";

    public $hasMany = array(
		'TerritorioInfraBuffer' => array(
			'className' => 'TerritorioInfraBuffer',
			'foreignKey' => 'infra_level',
			'dependent' => false,
			'conditions' => '',
			'fields' => array('shapename', 'bufdist'),
			'order' => '',
			'limit' => '',
			'offset' => '',
			'exclusive' => '',
			'finderQuery' => '',
			'counterQuery' => ''
		)
    );
    /* public $contains = array(
        'default' => array(
            'TerritorioInfraBuffer' => array(
                'fields' => array('name')
            ),
        )
    ); */
}
