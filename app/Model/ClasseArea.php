<?php
App::uses('AppModel', 'Model');
/**
 * Classe Model
 *
 */
class ClasseArea extends AppModel
{   

    public $belongsTo = array(        
        'Bioma' => array(
            'className' => 'Bioma',
            'foreignKey' => 'bioma_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        ),
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
            'Bioma' => array(
                'fields' => array('nome')
            ),
            'Classificacao'
        )
    );

    public $virtualFields = array(
        'geoJSON' => "ST_AsGeoJSON(ClasseArea.the_geom)",
    );

    public function afterFind($results, $primary = false)
    {
        foreach ($results as &$value) {
            if (isset($value['ClasseArea']['the_geom'])) {
                unset($value['ClasseArea']['the_geom']);
            }
            if (isset($value['ClasseArea']['geoJSON'])) {
                $value['ClasseArea']['geoJSON'] = json_decode($value['ClasseArea']['geoJSON'],true);
            }
            if (isset($value['ClasseArea']['pixel_values'])) {
                $value['ClasseArea']['pixel_values'] = json_decode($value['ClasseArea']['pixel_values'],true);
            }
        }
        return $results;
    }

    public function beforeSave($options = array())
    {
        if (isset($this->data['ClasseArea']['geoJSON'])) {
            $geoJSON = json_encode($this->data['ClasseArea']['geoJSON']);
            $db = ConnectionManager::getDataSource('default');
            $this->data['ClasseArea']['the_geom'] = $db->expression("ST_GeomFromGeoJSON('$geoJSON')");
        }
        if (isset($this->data['ClasseArea']['pixel_values'])) {
            $pixelValues = json_encode($this->data['ClasseArea']['pixel_values']);
            $this->data['ClasseArea']['pixel_values'] = $pixelValues;            
        }
        return true;
    }
}
