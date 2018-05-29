<?php
App::uses('AppModel', 'Model');
/**
 * AmostraPonto Model
 *
 */
class AmostraPonto extends AppModel
{   

    public $belongsTo = array(        
        'Bioma' => array(
            'className' => 'Bioma',
            'foreignKey' => 'bioma_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        )
    );

    public $contains = array(
        'default' => array(
            'Classe' => array(
                //'fields' => array('nome')
            )
        )
    );

    public $virtualFields = array(
        'geoJSON' => "ST_AsGeoJSON(AmostraPonto.geom)",
    );

    public function afterFind($results, $primary = false)
    {
        foreach ($results as &$value) {            
            if (isset($value['AmostraPonto']['geoJSON'])) {
                $value['AmostraPonto']['geoJSON'] = json_decode($value['AmostraPonto']['geoJSON'],true);
            }            
        }
        return $results;
    }

    public function beforeSave($options = array())
    {
        if (isset($this->data['AmostraPonto']['geoJSON'])) {
            $geoJSON = json_encode($this->data['AmostraPonto']['geoJSON']);
            $db = ConnectionManager::getDataSource('default');
            $this->data['AmostraPonto']['geom'] = $db->expression("ST_GeomFromGeoJSON('$geoJSON')");
        }        
        return true;
    }
}
