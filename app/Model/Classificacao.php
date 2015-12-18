<?php
App::uses('AppModel', 'Model');

/**
 * Classificacao Model
 *
 * @property Carta $Carta
 * @property Bioma $Bioma
 * @property ClassificacaoUsuario $ClassificacaoUsuario
 */
class Classificacao extends AppModel {
    
    /**
     * Validation rules
     *
     * @var array
     */
    public $validate = array(
        'carta_id' => array(
            'numeric' => array(
                'rule' => array(
                    'numeric'
                ) ,
                
                //'message' => 'Your custom message here',
                //'allowEmpty' => false,
                //'required' => false,
                //'last' => false, // Stop validation after this rule
                //'on' => 'create', // Limit validation to 'create' or 'update' operations
                
                
            ) ,
        ) ,
        'bioma_id' => array(
            'numeric' => array(
                'rule' => array(
                    'numeric'
                ) ,
                
                //'message' => 'Your custom message here',
                //'allowEmpty' => false,
                //'required' => false,
                //'last' => false, // Stop validation after this rule
                //'on' => 'create', // Limit validation to 'create' or 'update' operations
                
                
            ) ,
        ) ,
    );
    
    //The Associations below have been created with all possible keys, those that are not needed can be removed
    
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
    
    /**
     * hasMany associations
     *
     * @var array
     */
    public $hasMany = array(
        'ClassificacaoUsuario' => array(
            'className' => 'ClassificacaoUsuario',
            'foreignKey' => 'classificacao_id',
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
    
    public $contains = array(
        'default' => array()
    );
    
    public function afterFind($results, $primary = false) {
        foreach ($results as $key => $value) {
            if (isset($value['Classificacao']['dtv'])) {
                $results[$key]['Classificacao']['dtv'] = json_decode($value['Classificacao']['dtv'], true);                                
            }
        }          
        return $results;
    }
    
    public function beforeSave($options = array()) {
        if (isset($this->data['Classificacao']['dtv'])) {
            $this->data['Classificacao']['dtv'] = json_encode($this->data['Classificacao']['dtv']);            
        }
        return true;
    }
}
