<?php
App::uses('Territorio', 'Model');

class TerritorioService {
    
    public $Territorio;
    
    public function __construct() {
        $this->Territorio = new Territorio();
    }
    
    /*
     * API
    */
    public function findAll($query) {
        $result = [];
        
        $limit = 50;
        if (isset($query['limit']) && $query['limit'] < 50) {
            $limit = $query['limit'];
        }
        
        $page = null;
        if (isset($query['page'])) {
            $page = $query['page'];
        }
        
        $this->Territorio->virtualFields['area'] = "round( (st_area(Territorio.the_geom))::numeric, 2)";
        $this->Territorio->virtualFields['xmin'] = "st_xmin(the_geom)";
        $this->Territorio->virtualFields['ymin'] = "st_ymin(the_geom)";
        $this->Territorio->virtualFields['xmax'] = "st_xmax(the_geom)";
        $this->Territorio->virtualFields['ymax'] = "st_ymax(the_geom)";
        
        $array = array(
            'page' => $page,
            'limit' => $limit,
            'order' => 'Territorio.id ASC'
        );
        
        $resultBrasil1 = [];
        
        foreach ($this->Territorio->find("all", $array) as $key => $territorio) {
            $bounds = json_decode($territorio['Territorio']['bounds'], true) ['coordinates'][0];
            $r = array(
                "id" => $territorio['Territorio']['id'],
                "name" => $territorio['Territorio']['descricao'],
                "category" => $territorio['Territorio']['categoria'],
                "area" => floatval($territorio['Territorio']['area']) ,
                "bounds" => [[$bounds[0][1],
                $bounds[0][0]],
                [$bounds[2][1],
                $bounds[2][0]]]
            );
            if ($r['id'] == '10') {
                $resultBrasil1[] = $r;
            } 
            else {
                $result[] = $r;
            }
        }

        foreach ($result as $key => $value) {
            $resultBrasil1[] = $value;
        }

        $result = $resultBrasil1;        
        
        if ($page) {
            $result = array(
                'data' => $result,
                'page' => $page,
                'totalPages' => ceil($this->Territorio->find('count') / $limit)
            );
        }
        
        return $result;
    }
}
