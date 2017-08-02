<?php
App::uses('AppModel', 'Model');

/**
 * Usuario Model
 *
 * @property Perfil $Perfil
 * @property UsuarioBioma $UsuarioBioma
 * @property UsuarioPerfil $UsuarioPerfil
 */
class Usuario extends AppModel {
    
    /**
     * Validation rules
     *
     * @var array
     */
    public $validate = array(
        'nome' => array(
            'notEmpty' => array(
                'rule' => array(
                    'notEmpty'
                ) ,
                
                //'message' => 'Your custom message here',
                //'allowEmpty' => false,
                //'required' => false,
                //'last' => false, // Stop validation after this rule
                //'on' => 'create', // Limit validation to 'create' or 'update' operations
                
                
            ) ,
        ) ,
        'email' => array(
            'email' => array(
                'rule' => array(
                    'email'
                ) ,
            ) ,
            'isUnique' => array(
                'rule' => array(
                    'isUnique'
                ) ,
            ) 
        ) ,
        'password' => array(
            'notEmpty' => array(
                'rule' => array(
                    'notEmpty'
                ) ,
            ) ,
        ) ,
    );
    
    /**
     * belongsTo associations
     *
     * @var array
     */
    public $belongsTo = array(
        'Perfil' => array(
            'className' => 'Perfil',
            'foreignKey' => 'perfil_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        )
    );
    
    /**
     * hasOne associations
     *
     * @var array
     */
    public $hasOne = array(
        'UsuarioBioma' => array(
            'className' => 'UsuarioBioma',
            'foreignKey' => 'usuario_id',
            'dependent' => false,
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'limit' => '',
            'offset' => '',
            'exclusive' => '',
            'finderQuery' => '',
            'counterQuery' => ''
        ) ,
        'UsuarioPerfil' => array(
            'className' => 'UsuarioPerfil',
            'foreignKey' => 'usuario_id',
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
        'default' => array(
            'UsuarioBioma' => array(
                'Bioma' => array(
                    'fields' => array('id','nome')
                )
            )
        )
    );
    
    public function beforeSave($options = array()) {
        if (isset($this->data[$this->alias]['password'])) {
            $this->data[$this->alias]['password'] = AuthComponent::password($this->data[$this->alias]['password']);
        }
        return true;
    }
}
