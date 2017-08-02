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
        ),
        'Colecao' => array(
            'className' => 'Colecao',
            'foreignKey' => 'colecao_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        ),
        'CartaRegiao' => array(
            'className' => 'CartaRegiao',
            'foreignKey' => 'regiao_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        ),
        'DecisionTree' => array(
            'className' => 'DecisionTree',
            'foreignKey' => 'decision_tree_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        )
    );

     /**
     * hasOne associations
     *
     * @var array
     * public $hasOne = array();
     */
    
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
        ),
        'ClassificacaoTarefa' => array(
            'className' => 'ClassificacaoTarefa',
            'foreignKey' => 'classificacao_id',
            'dependent' => false,
            'conditions' => '',
            'fields' => '',
            'order' => array('ClassificacaoTarefa.id ASC'),
            'limit' => '',
            'offset' => '',
            'exclusive' => '',
            'finderQuery' => '',
            'counterQuery' => ''
        )       
    );
    
    public $contains = array(
        'default' => array(
            'Bioma' => array(
                'fields' => array('id','nome')
            ),
            'Carta' => array(
                'fields' => array('id','codigo')
            ),
            'DecisionTree',                       
            'ClassificacaoTarefa',           
            'CartaRegiao',
            'Colecao'
        )
    );
    
    public function afterFind($results, $primary = false) {
        foreach ($results as $key => &$value) {
            if (isset($value['Classificacao']['dtv'])) {
                $value['Classificacao']['dtv'] = json_decode($value['Classificacao']['dtv'], true);                                
            }
            if (isset($value['Classificacao']['id'])) {
                $value['Classificacao']['file_name'] = $this->buildFileName($value);                                
            }
            if (isset($value['Colecao']['config'])) {
                $value['Colecao']['config'] = json_decode($value['Colecao']['config'], true);                                
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

    private function buildFileName($value){
        
        $bioma = null;

        if(!empty($value['Bioma'])){
            $bioma = $value['Bioma']['nome'];
        }else{
            $bioma = $this->Bioma->read('nome',$value['Classificacao']['bioma_id'])['Bioma']['nome'];
        }

        $carta = null;

        if(!empty($value['Carta'])){
            $carta = $value['Carta']['codigo'];
        }else{
            $carta = $this->Carta->read('codigo',$value['Classificacao']['carta_id'])['Carta']['codigo'];
        }

        $ano = $value['Classificacao']['year'];

        $cartaRegiaoCodigo = null;

        if(!empty($value['CartaRegiao'])){
            $cartaRegiaoCodigo = $value['CartaRegiao']['regiao'];
        }else{
            $cartaRegiao = $this->CartaRegiao->read('regiao',$value['Classificacao']['regiao_id']);
            $cartaRegiaoCodigo = $cartaRegiao['CartaRegiao']['regiao'] ? $cartaRegiao['CartaRegiao']['regiao'] : '0';
        }

        $fileName = $bioma."_".$carta."_". $ano."_".$cartaRegiaoCodigo;
    
        return $fileName;
    }
}
