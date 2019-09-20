<?php
App::uses('AppModel', 'Model');
/**
 * Integration Model
 *
 */
class Integration extends AppModel {
    // public $useTable = 'integration_filters';

	public $belongsTo = array(        
        'IntegrationProject' => array(
            'className' => 'IntegrationProject',
            'foreignKey' => 'integration_project_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        ),
        'ClasseAsset' => array(
            'className' => 'ClasseAsset',
            'foreignKey' => 'classe_asset_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        )
    );

    public function afterFind($results, $primary = false) {
        foreach ($results as $key => $value) {
            if(isset($value['ClasseAsset']['Classe'])) {
                $results[$key]['Classe'] = $value['ClasseAsset']['Classe'];
                $results[$key]['Asset'] = $value['ClasseAsset']['Asset'];
            }
        }
        return $results;
    }
}
