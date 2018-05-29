<?php

/**
 * Application model for CakePHP.
 *
 * This file is application-wide model file. You can put all
 * application-wide model-related methods here.
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       app.Model
 * @since         CakePHP(tm) v 0.2.9
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */
App::uses('AuthComponent', 'Controller/Component');
App::uses('Model', 'Model');
App::uses('CakeTime', 'Utility');

/**
 * Application model for Cake.
 *
 * Add your application-wide methods in the class below, your models
 * will inherit them.
 *
 * @package       app.Model
 */
class AppModel extends Model {

    public $actsAs = array('Containable');
    public $contains = array();
    public $authUser;

    public function __construct($id = false, $table = null, $ds = null) {
        parent::__construct($id, $table, $ds);
        $this->authUser = AuthComponent::user();
    }

    public function setContain($param) {
        $this->contain($this->contains[$param]);
    }

    /**
     * converte o campo geom de string json para array e copia
     * os campos do registro numa chave properties
     * 
     * @param array $data
     * @param boolean se é uma lista ou um registro unico
     * @return array
     */
    public function buildGeoJson($data, $isCollection = false, $field = "geom_json") {

        if (!$isCollection) {
            $data = array($data);
        }

        // estrutura padrao de uma FeatureCollection geojson
        $collection = array(
            "type" => "FeatureCollection",
            "features" => array(),
        );

        foreach ($data as $key => $value) {
            // estrutura padrao de uma Feature geojson
            $feature = array(
                "type" => "Feature",
                "properties" => array(),
                "geometry" => array(),
            );

            // seta geometry o com o campo "geom" convertido para geojson
            if (isset($value[$field])) {
                $feature['geometry'] = json_decode($value[$field], true);
            }

            // seta properties o com os outros campos do registro
            $feature['properties'] = $value;

            // remove possiveis campos "the_geom"
            unset($feature['properties'][$field]);
            unset($feature['properties']["the_geom"]);
            unset($feature['properties']["app_geom"]);
            unset($feature['properties']["appd_geom"]);
            unset($feature['properties']["geojson"]);

            $collection['features'][] = $feature;
        }

        if (!$isCollection) {
            $r = $collection['features'][0];
        } else {
            $r = $collection;
        }

        return $r;
    }

    public function setGeoJSONProperties($geoJSON, $data) {
        $geoJSONArray = json_decode($geoJSON,true);
        $geoJSONArray['properties'] = $data;
        unset($geoJSONArray['properties']["the_geom"]);
        unset($geoJSONArray['properties']["app_geom"]);
        unset($geoJSONArray['properties']["appd_geom"]);        
        unset($geoJSONArray['properties']["geojson"]);
        unset($geoJSONArray['properties']["geoJSON"]);
        return $geoJSONArray;
    }

    public function wktForce2d($wkt) {
        $db = ConnectionManager::getDataSource('default');
        // se for 4d, retira as coordenadas zm
        $wkt2d = preg_replace('/\s0\sNAN|\sZM|\sNAN|\sM\s/', "", $wkt);
        return $db->expression("ST_GeomFromText('$wkt2d',4674)");
    }

    public function geomFromGeojson($geojson) {
        $db = ConnectionManager::getDataSource('default');
        return $db->expression("ST_Transform(ST_SetSRID(ST_GeomFromGeoJSON('$geojson'),900913),4674)");
    }
    
    
    public function geomCentroid($geometry){
        $db = ConnectionManager::getDataSource('default');
        return $db->expression("ST_Centroid('$geometry')");
    }

}
