<?php
App::uses('AppModel', 'Model');
/**
 * TemporalFilter Model
 *
 */
class TemporalFilterProject extends AppModel {
    /**
     * belongsTo associations
     *
     * @var array
     */
    public $belongsTo = array(        
        'Bioma' => array(
            'className' => 'Bioma',
            'foreignKey' => 'biome_id',
            'conditions' => '',
            'fields' => array('id','nome'),
            'order' => ''
        )
    );
}
