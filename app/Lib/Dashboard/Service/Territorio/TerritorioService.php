<?php
App::uses('Territorio', 'Model');
App::uses('Municipio', 'Model');


class TerritorioService {
    
    public $Territorio;
    
    public function __construct() {
        $this->Territorio = new Territorio();
        $this->Municipio = new Municipio();
    }
    
    /*
     * API
    */
    public function findAll($query) {
        $result = [];
        
        $limit = 50;
        if (isset($query['limit'])) {
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
        
        $options = array(
            'page' => $page,
            'limit' => $limit,
            'order' => 'Territorio.id ASC'
        );

        $options['conditions'] = [];

        if (isset($query['name'])) {
            $options['conditions']["Territorio.descricao iLike"] = $query['name']."%";
        }

        if (isset($query['category'])) {
            $options['conditions']["Territorio.categoria"] = ucwords($query['category']);
        }

        $lang = [];
        if (isset($query['language']) && $query['language'] == 'en') {
            $lang = [
                'País' => 'Country',
                'Estado' => 'State',
                'Municipio' => 'City',
                'Bioma' => 'Biome',
            ];
        }
        
        $resultBrasil1 = [];
        
        foreach ($this->Territorio->find("all", $options) as $key => $territorio) {
            $bounds = json_decode($territorio['Territorio']['bounds'], true) ['coordinates'][0];
            
            $municipio = null;

            if($territorio['Territorio']['categoria'] == 'Municipio'){
                $municipio = $this->Municipio->find('first',array(
                    'conditions' => array(
                        'Municipio.id' => $territorio['Territorio']['id']
                    ),
                    'fields' => array('id'),
                    'contain' => array(
                        'Estado' => array(
                            'fields' => array('sigla')
                        )
                    )
                ));                
            }

            $r = array(
                "id" => $territorio['Territorio']['id'],
                "name" => $territorio['Territorio']['descricao'],
                "state" => $municipio ? $municipio['Estado']['sigla'] : "",
                "category" =>  !empty($lang[$territorio['Territorio']['categoria']]) ? $lang[$territorio['Territorio']['categoria']] : $territorio['Territorio']['categoria'],
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
