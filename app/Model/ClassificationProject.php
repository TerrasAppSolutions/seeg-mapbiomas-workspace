<?php
App::uses('AppModel', 'Model');
/**
 * IntegrationFilter Model
 *
 */
class ClassificationProject extends AppModel {
    // public $useTable = 'random_forest_projects';
    public $belongsTo = array(        
        'AssetSample' => array(
            'className' => 'AssetSample',
            'foreignKey' => 'asset_sample_id',
            'conditions' => '',
            'fields' => array(),
            'order' => ''
        )
    );
}
