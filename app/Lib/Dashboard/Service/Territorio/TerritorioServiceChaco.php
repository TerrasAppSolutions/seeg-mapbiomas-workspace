<?php
App::uses('Territorio', 'Model');
App::uses('Municipio', 'Model');

class TerritorioServiceChaco
{

    public $Territorio;

    public function __construct()
    {
        set_time_limit(0);
        ini_set('memory_limit','2048M');
        
        $this->Territorio = new Territorio();
        $this->Municipio = new Municipio();
    }

    /*
     * API
     */
    public function findAll($query)
    {

        $result = [];

        $limit = null;
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
            'order' => 'Territorio.id ASC',
        );

        $options['conditions'] = [];

        if (isset($query['name'])) {
            $options['conditions']["Territorio.descricao iLike"] = $query['name'] . "%";
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
        $estado = null;
        $pais = null;

        try {

            $territorios = $this->Territorio->find("all", $options);

            foreach ($territorios as $key => $territorio) {
                $bounds = json_decode($territorio['Territorio']['bounds'], true)['coordinates'][0];

                $municipio = null;
                /*
                 * Municipio / Estado / Pais
                 */
                if ($territorio['Territorio']['categoria'] == 'País') {

                    $territorio_explode = str_split($territorio['Territorio']['id']);
                    $pais_id = $territorio_explode[0];
                    $pais = $this->Territorio->find('first', array(
                        'conditions' => array(
                            'Territorio.id' => $pais_id,
                        ),
                        'fields' => array('descricao'),
                    ));

                    if (isset($pais['Territorio'])) {
                        $pais = $pais['Territorio'];
                    }
                }

                if ($territorio['Territorio']['categoria'] == 'Município') {

                    $territorio_explode = str_split($territorio['Territorio']['id']);
                    $pais_id = $territorio_explode[0];
                    $estado_id = $territorio_explode[0] . $territorio_explode[1] . $territorio_explode[2];

                    $pais = $this->Territorio->find('first', array(
                        'conditions' => array(
                            'Territorio.id' => $pais_id,
                        ),
                        'fields' => array('descricao'),
                    ));

                    if (isset($pais['Territorio'])) {
                        $pais = $pais['Territorio'];
                    }

                    $estado = $this->Territorio->find('first', array(
                        'conditions' => array(
                            'Territorio.id' => $estado_id,
                        ),
                        'fields' => array('id', 'descricao', 'categoria'),
                    ));

                    if (isset($estado['Territorio'])) {
                        $estado = $estado['Territorio'];
                    }

                }

                if ($territorio['Territorio']['categoria'] == 'Estado') {
                    $territorio_explode = str_split($territorio['Territorio']['id']);
                    $pais_id = $territorio_explode[0];
                    $estado_id = $territorio_explode[0] . $territorio_explode[1] . $territorio_explode[2];

                    $estado = $this->Territorio->find('first', array(
                        'conditions' => array(
                            'Territorio.id' => $estado_id,
                        ),
                        'fields' => array('id', 'descricao', 'categoria'),
                    ));

                    if (isset($estado['Territorio'])) {
                        $estado = "";
                    }

                    $pais = $this->Territorio->find('first', array(
                        'conditions' => array(
                        'Territorio.id' => $pais_id,
                    ),
                        'fields' => array('descricao'),
                    ));
                    if (isset($pais['Territorio'])) {
                        $pais = $pais['Territorio'];
                    }
                }

                if ($territorio['Territorio']['categoria'] == 'Bioma-País') {
                    $territorio_explode = str_split($territorio['Territorio']['id']);
                    $pais_id = $territorio_explode[5];

                    if (isset($estado['Territorio'])) {
                        $estado = "";
                    }

                    $pais = $this->Territorio->find('first', array(
                        'conditions' => array(
                        'Territorio.id' => $pais_id,
                    ),
                        'fields' => array('descricao'),
                    ));
                    if (isset($pais['Territorio'])) {
                        $pais = $pais['Territorio'];
                    }
                }

                $r = array(
                    "id" => $territorio['Territorio']['id'],
                    "name" => $territorio['Territorio']['descricao'],
                    "state" => $estado ? $estado['descricao'] : "",
                    "country" => $pais ? $pais['descricao'] : "",
                    "category" => !empty($lang[$territorio['Territorio']['categoria']]) ? $lang[$territorio['Territorio']['categoria']] : $territorio['Territorio']['categoria'],
                    "area" => floatval($territorio['Territorio']['area']),
                    "bounds" => [[$bounds[0][1],
                        $bounds[0][0]],
                        [$bounds[2][1],
                            $bounds[2][0]]],
                );

                if ($r['id'] == '10') {
                    $resultBrasil1[] = $r;
                } else {
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
                    'totalPages' => ceil($this->Territorio->find('count') / $limit),
                );
            }

            http_response_code(200);
            return $result;

        } catch (Exception $e) {

            $erros = array(
                'messagem' => 'Não foi possível carregar os dados de territórios',
                'erros' => $e->getMessage(),
            );

            $responseData = $erros;

            http_response_code(400);
            return $responseData;
        }

    }
}
