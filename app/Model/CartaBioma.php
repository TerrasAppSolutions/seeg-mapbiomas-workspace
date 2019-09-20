<?php
App::uses('AppModel', 'Model');
/**
 * CartaRegiao Model
 *
 */
class CartaBioma extends AppModel {
    // public $useTable = 'carta_regioes';
    
    public $belongsTo = array(        
        'Carta' => array(
            'className' => 'Carta',
            'foreignKey' => 'carta_id',
            'conditions' => '',
            'fields' => array('id','codigo'),
            'order' => ''
        )
    );
}
