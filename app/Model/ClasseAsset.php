<?php
App::uses('AppModel', 'Model');
/**
 * Classe Model
 *
 */
class ClasseAsset extends AppModel {
    /**
     * belongsTo associations
     *
     * @var array
     */
    public $belongsTo = array(        
        'Classe' => array(
            'className' => 'Classe',
            'foreignKey' => 'classe_id',
            'conditions' => '',
            'fields' => array('id','classe', 'cor', 'ativo', 'valor'),
            'order' => ''
        ),
        'Asset' => array(
            'className' => 'Asset',
            'foreignKey' => 'asset_id',
            'conditions' => '',
            'fields' => array('asset', 'id', 'name'),
            'order' => ''
        )
    );

    /**
     * Construindo o objeto de asset e classe
     * @param $results 
     */
    /* public function afterFind($results, $primary = false) {
        $data = [];
        foreach ($results as $key => $value) {
            $value['ClasseAsset']['classe'] = $value['Classe']['classe'];
            $value['ClasseAsset']['cor'] = $value['Classe']['cor'];
            $value['ClasseAsset']['ativo'] = $value['Classe']['ativo'];

            array_push($data, $value['ClasseAsset']);
        }          
        return $data;
    } */
}
