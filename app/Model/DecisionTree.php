<?php
App::uses('AppModel', 'Model');
/**
 * DecisionTree Model
 *
 */
class DecisionTree extends AppModel {


    /**
     * belongsTo associations
     *
     * @var array
     */
    public $belongsTo = array(        
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
        'Classificacao' => array(
            'className' => 'Classificacao',
            'foreignKey' => 'decision_tree_id',
            'dependent' => true,
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'limit' => '1',
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
            'Classificacao' => array(
                'fields' => array('id')
            ),
        )
    );
    

	public function afterFind($results, $primary = false) {
        foreach ($results as $key => &$value) {
            if (isset($value['DecisionTree']['dtree'])) {
                $value['DecisionTree']['dtree'] = json_decode($value['DecisionTree']['dtree'], true);                                
            }
        }          
        return $results;
    }


    public function beforeSave($options = array()) {
        if (isset($this->data['DecisionTree']['dtree'])) {
            $this->data['DecisionTree']['dtree'] = json_encode($this->data['DecisionTree']['dtree']);            
        }
        return true;
    }

}
