<?php
App::uses('AppModel', 'Model');

/**
 * Qualidade Model
 *
 * @property Carta $Carta
 * @property Bioma $Bioma
 */
class Qualidade extends AppModel {
    
    /**
     * belongsTo associations
     *
     * @var array
     */
    public $belongsTo = array(
        'Carta' => array(
            'className' => 'Carta',
            'foreignKey' => 'carta_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        ) ,
        'Bioma' => array(
            'className' => 'Bioma',
            'foreignKey' => 'bioma_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        )
    );

    public $contains = array(
        'default' => array(
            'Bioma' => array(
                'fields' => array('id','nome')
            ),
            'Carta' => array(
                'fields' => array('id','codigo')
            )
        )
    );
}
