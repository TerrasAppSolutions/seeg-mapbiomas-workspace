<?php
App::uses('AppModel', 'Model');

/**
 * ClassificacaoTarefa Model
 *
 */
class ClassificacaoTarefa extends AppModel {
    
    /**
     * belongsTo associations
     *
     * @var array
     */
    public $belongsTo = array(
        'Classificacao' => array(
            'className' => 'Classificacao',
            'foreignKey' => 'classificacao_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        )
    );
    
    public $contains = array(
        'default' => array(
        	'Classificacao'
        )
    );
}
