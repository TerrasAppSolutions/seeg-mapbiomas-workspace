<?php
App::uses('AppModel', 'Model');
/**
 * Classe Model
 *
 */
class Amostra extends AppModel
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

    public $hasMany = array(
        'AmostraPonto' => array(
            'className' => 'AmostraPonto',
            'foreignKey' => 'amostra_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        )
    );

    public $contains = array(
        'default' => array(
            'Bioma' => array(
                'fields' => array('nome')
            ),
            'AmostraPonto'
        )
    );

    public $virtualFields = array(
        'polygon' => "ST_AsGeoJSON(Amostra.geom)",
    );

    public function afterFind($results, $primary = false)
    {
        foreach ($results as &$value) {
            if (isset($value['Amostra']['geoJSON'])) {
                $value['Amostra']['polygon'] = json_decode($value['Amostra']['polygon'], true);
            }
            if (isset($value['AmostraPonto'])) {
                $value['Amostra']['points'] = json_decode($value['Amostra']['polygon'], true);
                unset($value['AmostraPonto']);
            }
        }
        return $results;
    }

    public function beforeSave($options = array())
    {
        if (isset($this->data['Amostra']['geoJSON'])) {
            $geoJSON = json_encode($this->data['Amostra']['polygon']);
            $db = ConnectionManager::getDataSource('default');
            $this->data['Amostra']['geom'] = $db->expression("ST_GeomFromGeoJSON('$geoJSON')");
        }
        return true;
    }
}
