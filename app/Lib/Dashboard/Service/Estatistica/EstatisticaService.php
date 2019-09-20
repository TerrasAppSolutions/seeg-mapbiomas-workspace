<?php
App::uses('EstatisticaNivel', 'Model');
App::uses('EstatisticaTransicaoNivel', 'Model');
App::uses('TerritorioInfra', 'Model');
App::uses('TerritorioInfraBuffer', 'Model');
App::uses('InfrastructureLevel', 'Model');
App::uses('InfrastrutureHierarchy', 'Model');


class EstatisticaService {

    public $EstatisticaNivel;
    public $EstatisticaTransicaoNivel;
    public $TerritorioInfra;
    public $TerritorioInfraBuffer;
    public $InfrastructureLevel;
    public $InfrastrutureHierarchy;

    public function __construct() {
        $this->EstatisticaNivel = new EstatisticaNivel();
        $this->EstatisticaTransicaoNivel = new EstatisticaTransicaoNivel();
        $this->TerritorioInfra = new TerritorioInfra();
        $this->TerritorioInfraBuffer = new TerritorioInfraBuffer();
        $this->InfrastructureLevel = new InfrastructureLevel();
        $this->InfrastrutureHierarchy = new InfrastrutureHierarchy();
    }

    /*
     * API
     * coverage rest
     * ex: http://workspace.localhost/dashboard/services/statistics/coverage?classification_ids=24&territory_id=3550308&year=2015
    */

    public function coverage($query) {

        $conditions = [];

        if (isset($query['year'])) {
            $conditions['EstatisticaNivel.ano'] = $query['year'];
        }

        if (isset($query['territory_id'])) {
            $conditions['EstatisticaNivel.territorio'] = explode(",", $query['territory_id']);
        }

        if (isset($query['classification_ids'])) {
            $classification_ids = explode(",", $query['classification_ids']);
            $conditions['EstatisticaNivel.classe'] = $classification_ids;
        }

        $estatisticas = [];

        if (count($conditions) > 0) {
            $estatisticas = $this->EstatisticaNivel->find('all', array(
                'conditions' => $conditions,
                'contain' => $this->EstatisticaNivel->contains['default'],
                'order' => ['EstatisticaNivel.classe ASC','EstatisticaNivel.ano ASC']
            ));
        }

        $result = [];

        foreach ($estatisticas as $key => $stat) {
            $r = array(
                "id" => $stat['EstatisticaNivel']['classe'],
                "l1" => $stat['EstatisticaNivel']['classe_l1'],
                "l2" => $stat['EstatisticaNivel']['classe_l2'],
                "l3" => $stat['EstatisticaNivel']['classe_l3'],
                "territory" => $stat['EstatisticaNivel']['territorio'],
                "year" => $stat['EstatisticaNivel']['ano'],
                "area" => $stat['EstatisticaNivel']['area']*100,
                //"percentage" => $stat['EstatisticaNivel']['percentagem'],
            );
            $result[] = $r;
        }

        return $result;
    }

    public function groupedcover($query) {

        $conditions = [];

        if (isset($query['year'])) {
            $conditions['EstatisticaNivel.ano'] = $query['year'];
        }

        if (isset($query['territory_id'])) {
            $conditions['EstatisticaNivel.territorio'] = explode(",", $query['territory_id']);
        }


        if (isset($query['classification_id'])) {
            $classification_id = explode(",", $query['classification_id']);
        }

        $estatisticas = [];
        $resultf = [];

        // para cada classe realiza consulta em todos os niveis
        foreach ($classification_id as $key => $cid) {
            $result = [];
            if (count($conditions) > 0) {

                $conditions['OR'] = [];
                $conditions['OR']['EstatisticaNivel.classe'] = $cid;
                $conditions['OR']['EstatisticaNivel.classe_l1'] = $cid;
                $conditions['OR']['EstatisticaNivel.classe_l2'] = $cid;
                $conditions['OR']['EstatisticaNivel.classe_l3'] = $cid;

                $estatisticas = $this->EstatisticaNivel->find('all', array(
                    'conditions' => $conditions,
                    'contain' => $this->EstatisticaNivel->contains['default'],
                    'order' => ['EstatisticaNivel.classe ASC','EstatisticaNivel.ano ASC']
                ));

                if(sizeof($estatisticas) <= 0) {
                    $conditions['OR'] = [];

                    $estatisticas = $this->EstatisticaNivel->find('all', array(
                        'conditions' => $conditions,
                        'contain' => $this->EstatisticaNivel->contains['default'],
                        'order' => ['EstatisticaNivel.classe ASC','EstatisticaNivel.ano ASC']
                    ));

                    for ($i=0; $i < sizeof($estatisticas); $i++) {
                        $estatisticas[$i]['EstatisticaNivel']['area'] = 0;
                    }
                }
            }

            // formata resultado
            foreach ($estatisticas as $key => $stat) {
                $r = array(
                    "id" => $stat['EstatisticaNivel']['classe'],
                    "l1" => $stat['EstatisticaNivel']['classe_l1'],
                    "l2" => $stat['EstatisticaNivel']['classe_l2'],
                    "l3" => $stat['EstatisticaNivel']['classe_l3'],
                    "territory" => $stat['EstatisticaNivel']['territorio'],
                    "year" => $stat['EstatisticaNivel']['ano'],
                    "area" => $stat['EstatisticaNivel']['area']*100,
                    //"percentage" => $stat['EstatisticaNivel']['percentagem'],
                );

                if($r["id"] == $r["l1"]){
                    $r["l"] = '1';
                }
                elseif ($r["id"] == $r["l2"]){
                    $r["l"] = '2';
                }
                elseif($r["id"] == $r["l3"]){
                    $r["l"] = '3';
                }

                $result[] = $r;
            }

            //echo json_encode($result);

            // agrupa por classe ano
            $resTerClasseAno = [];
            foreach ($result as $key => $re) {
                $resTerClasseAno[$re['territory'].'-'.$cid.'-'.$re['year']] = $re;
                $resTerClasseAno[$re['territory'].'-'.$cid.'-'.$re['year']]['area'] = 0;
                $resTerClasseAno[$re['territory'].'-'.$cid.'-'.$re['year']]['id'] = intval($cid);
                $resTerClasseAno[$re['territory'].'-'.$cid.'-'.$re['year']]['l1'] = intval($cid);
                $resTerClasseAno[$re['territory'].'-'.$cid.'-'.$re['year']]['l2'] = intval($cid);
                $resTerClasseAno[$re['territory'].'-'.$cid.'-'.$re['year']]['l3'] = intval($cid);
            }

            foreach ($result as $key => $re2) {
                //if($re2['l'] == '3'){
                    $resTerClasseAno[$re2['territory'].'-'.$cid.'-'.$re2['year']]['area'] += $re2['area'];
                    /*if(!isset($resTerClasseAno[$re2['territory'].'-'.$cid.'-'.$re2['year']]['s'])){
                        $resTerClasseAno[$re2['territory'].'-'.$cid.'-'.$re2['year']]['s'] = "";
                    }
                    $resTerClasseAno[$re2['territory'].'-'.$cid.'-'.$re2['year']]['s'] .= ("-". $re2['id']."-");*/
                //}
            }

            $result1 = [];
            foreach ($resTerClasseAno as $key => $re3) {
                $result1[] = $re3;
            }

            $resultf = array_merge($resultf,$result1);
        }

        return $resultf;
    }

    private function findClasse($classe,$ano){
    }

    /**
     * Inspeciona um ponto, retorna os dados de estatísticas relacionados
     * @param lat latitude
     * @param year ano
     * @param lng longitude
     */
    public function inspector($query) {
        
        if (!isset($query['lat']) || !isset($query['year']) || !isset($query['lng'])) {
            return [];
        }

        $lat = $query['lat'];
        $lng = $query['lng'];
        $year = $query['year'];

        $consulta = "
            select * FROM map_territorio_inspector($year, $lng, $lat);
        ";

        $res = $this->EstatisticaNivel->query($consulta);
        $result = [];

        foreach ($res as $key => $value) {
            $result[] = $value[0];
        }
        return $result;
    }

    public function transitions($query) {
        //proc_nice(20);
        //ini_set('memory_limit', '3G');
        //ini_set('max_execution_time', '300');

        $conditions = [];

        $year1 = null;
        if (isset($query['year'])) {
            $year1 = explode(",", $query['year']) [0];
            $conditions['EstatisticaTransicaoNivel.ano_inicial'] = $year1;
        }

        $year2 = null;
        if (isset($query['year'])) {
            $year2 = explode(",", $query['year']) [1];
            $conditions['EstatisticaTransicaoNivel.ano_final'] = $year2;
        }

        if (isset($query['territory_id'])) {
            $conditions['EstatisticaTransicaoNivel.territorio'] = $query['territory_id'];
        }else{
            die;
        }

        $estatisticasTransicoes = [];

        if (count($conditions) > 0) {
            $estatisticasTransicoes = $this->EstatisticaTransicaoNivel->find('all', array(
                'conditions' => $conditions
            ));
        }

        $result = [];
        $coveragesClasses = [];
        foreach ($estatisticasTransicoes as $key => $estatisticaTransicao) {
            $r = array(
                "from" => $estatisticaTransicao['EstatisticaTransicaoNivel']['classe_inicial'],
                "from_l1" => $estatisticaTransicao['EstatisticaTransicaoNivel']['classe_inicial_l1'],
                "from_l2" => $estatisticaTransicao['EstatisticaTransicaoNivel']['classe_inicial_l2'],
                "from_l3" => $estatisticaTransicao['EstatisticaTransicaoNivel']['classe_inicial_l3'],
                "to" => $estatisticaTransicao['EstatisticaTransicaoNivel']['classe_final'],
                "to_l1" => $estatisticaTransicao['EstatisticaTransicaoNivel']['classe_final_l1'],
                "to_l2" => $estatisticaTransicao['EstatisticaTransicaoNivel']['classe_final_l2'],
                "to_l3" => $estatisticaTransicao['EstatisticaTransicaoNivel']['classe_final_l3'],
                "area" => $estatisticaTransicao['EstatisticaTransicaoNivel']['area']*100
            );
            $result[] = $r;
            $coveragesClasses[] = $estatisticaTransicao['EstatisticaTransicaoNivel']['classe_inicial'];
        }

        $resultCoverages = [];

        $rcoverages1 = $this->coverage(array(
            'year' => $year1,
            'territory_id' => $query['territory_id'],
            'classification_ids' => implode(",", $coveragesClasses)
        ));

        $resultCoverages = array_merge($resultCoverages, $rcoverages1);

        $rcoverages2 = $this->coverage(array(
            'year' => $year2,
            'territory_id' => $query['territory_id'],
            'classification_ids' => implode(",", $coveragesClasses)
        ));

        $resultCoverages = array_merge($resultCoverages, $rcoverages2);

        return array(
            "transitions" => $result,
            "coverages" => $resultCoverages
        );
    }

    public function saveTransition($data){
        //$this->EstatisticaTransicaoNivel->save($data);
    }

    /**
     * API de infrastrutura
     * url: http://workspace.localhost/dashboard/services/statistics/infrastructure?limit=10
     */
    public function infrastructure($query) {
        $options = [];

        if (!isset($query['ano']) && !isset($query['cat1'])) {
            return [];
        }

        if (isset($query['limit'])) {
            $options['limit'] = $query['limit'];
        }

        if (isset($query['ano'])) {
            $options['conditions']['ano'] = $query['ano'];
        }

        if (isset($query['cat1'])) {
            $options['conditions']['cat1'] = $query['cat1'];
        }

        $options['fields'] = array(
            'id',
            'shapename', 
            'nome', 
            'ano', 
            'extrainfo', 
            'cat1', 
            'cat2',
            'cat3',
            'cat4',
            'cat5',
            'cat6',
            'cat7',
        );
        
        $territorios = $this->TerritorioInfra->find('all', $options);
        
        $result = [];

        foreach ($territorios as $key => $value) {
            $result[$key] = $value['TerritorioInfra'];
            if(isset($result[$key]['extrainfo'])) {
                $result[$key]['extrainfo'] = json_decode($result[$key]['extrainfo'], true);
            }
        }

        return $result;
    }

    public function infra_hierarchy($query) {
        $options = [];

        $infrastrutureHierarchy = $this->InfrastrutureHierarchy->find('all', $options);

        $result = [];

        foreach ($infrastrutureHierarchy as $key => $value) {
            $result[$key] = $value['InfrastrutureHierarchy'];
        }

        return $result;
    }

    public function infra_levels($query) {
        // get the dictionary data for english
        if(isset($query['language']) && $query['language'] == 'en') {
            $str = file_get_contents(__DIR__.'/infra_en.json', 'r');
            $infra_en = json_decode($str, true);
        } else {
            $query['language'] = '';
        }

        // infra buffer
        $options_buffer = [];
        // $territorios_infra_buffer = $this->TerritorioInfraBuffer->find('all', $options_buffer);
        
        $options = array(
            // 'page' => $page,
            // 'limit' => $limit,
            // 'order' => 'categoria ASC'
        );
        
        $InfrastructureLevels = $this->InfrastructureLevel->find('all', $options);

        // pr($InfrastructureLevels);

        $data = [];

        foreach ($InfrastructureLevels as $key => $value) {
            $data[$key] = $value['InfrastructureLevel'];
            // pr($data[$key]);
            // language = en
            if(isset($infra_en[$data[$key]['name']]) && $query['language'] == 'en') {
                $data[$key]['name'] = $infra_en[$data[$key]['name']];
            }
            // find buffer
            for ($p=0; $p < sizeof($value['TerritorioInfraBuffer']); $p++) {
                $element = $value['TerritorioInfraBuffer'][$p];
                $data[$key]['buffer_' . (string)($element['bufdist']/1000) . 'k'] = true;
            }
        }

        // pr($data);

        $result = [];
        $parent = 0;

        /* while (sizeof($data) > 0) {
            foreach ($data as $key => $value) {
                if($value['parent_id'] == $parent) {
                    $result[$key] = $value;
                    $result[$key]['sub'] = array();
                    unset($data[$key]);
                }
            }
        } */
        function createTree(&$list, $parent){
            $tree = array();
            foreach ($parent as $k=>$l){
                if(isset($list[$l['id']])){
                    $l['children'] = createTree($list, $list[$l['id']]);
                }
                $tree[] = $l;
            } 
            return $tree;
        }

        $new = array();
        foreach ($data as $a){
            // pr($a);
            $new[$a['categoria'] - 1][] = $a;
        }

        // pr($new);

        // percorrendo os elementos separados por categoria
        // $new[$i]
        for ($i = sizeof($new) - 1; $i > 0; $i--) {
            // percorre os elementos de uma categoria
            // $new[$i][$j]
            for ($j = 0; $j < sizeof($new[$i]); $j++) {
                // percorre os elementos da catgoria anterior
                // $new[$i - 1][$k]
                for ($k = 0; $k < sizeof($new[$i - 1]); $k++) {
                    // pr($new[$i - 1][$k]);
                    if(!isset($new[$i - 1][$k]['sub'])) {   
                        $new[$i - 1][$k]['sub'] = [];
                    }
                    if($new[$i - 1][$k]['id'] == $new[$i][$j]['parent_id']) {
                        $new[$i - 1][$k]['sub'][] = $new[$i][$j];
                    }
                }
            }
            
            unset($new[$i]);
        }

        return $new;
    }

    /**
     * Retorna o buffer a partir
     * @param territorio_id
     * @param categoria_id
     * @param categoria_name
     */
    public function infra_buffer($query) {

        $territorio_id = $query['territorio_id'];
        $categoria_id = $query['categoria_id'];
        $categoria_name = $query['categoria_name'];
        $buffer = $query['buffer'] * 1000;
        
        $consulta = "
            select * from map_get_infrabuffer_stats_cobertura($territorio_id, $categoria_id, '$categoria_name');
        ";

        $res = $this->EstatisticaNivel->query($consulta);
        $result = [];

        foreach ($res as $key => $value) {
            // buffer set
            if($buffer == $value[0]['bufdist']) {
                // area conversion
                $value[0]['area'] = (float)$value[0]['area'];
                $result[] = $value[0];
            }
            // area conversion
            // $value[0]['area'] = (float)$value[0]['area'];
            // $result[] = $value[0];
        }

        return $result;
    }

    /**
     * Estatística de infraestrutura
     */
    public function coverage_infra($query) {
        
        if (!isset($query['territory_id']) || !isset($query['level_id']) || !isset($query['buffer'])) {
            return [];
        }

        
        $territory_id = $query['territory_id'];
        $level_id = $query['level_id'];
        $buffer = $query['buffer'];
        
        // if there is classification ids
        if (isset($query['classification_ids'])) {
            $classification_ids = $query['classification_ids'];
            $consulta = "
                select * FROM map_get_infrabuffer_stats_coberturav2(ARRAY [$territory_id], ARRAY [$level_id], ARRAY [$buffer], ARRAY [$classification_ids]);
            ";
        } else {
           $consulta = "
                select * FROM map_get_infrabuffer_stats_coberturav2(ARRAY [$territory_id], ARRAY [$level_id], ARRAY [$buffer]);
            ";
        }

        $res = $this->EstatisticaNivel->query($consulta);
        $result = [];

        foreach ($res as $key => $value) {
            // ajustando estrutura
            // $value[0]['area'] = (float)$value[0]['area'];
            // unset($value[0]['classe_desc']);
            // $value[0]['level_id'] = $value[0]['infra_level'];
            // unset($value[0]['infra_level']);
            // $value[0]['territory_id'] = $value[0]['territorio'];
            // unset($value[0]['territorio']);
            // $value[0]['l1'] = $value[0]['classe_l1'];
            // unset($value[0]['classe_l1']);
            // $value[0]['l2'] = $value[0]['classe_l2'];
            // unset($value[0]['classe_l2']);
            // $value[0]['l3'] = $value[0]['classe_l3'];
            // unset($value[0]['classe_l3']);
            // $value[0]['year'] = $value[0]['ano'];
            // unset($value[0]['ano']);
            // $value[0]['id'] = $value[0]['classe'];
            // unset($value[0]['classe']);

            $r = array(
                "id" => $value[0]['classe'],
                "level_id" => $value[0]['infra_level'],
                "l1" => $value[0]['classe_l1'],
                "l2" => $value[0]['classe_l2'],
                "l3" => $value[0]['classe_l3'],
                "territory" => $value[0]['territorio'],
                "year" => $value[0]['ano'],
                "area" => (float)$value[0]['area'],
            );

            // filtro por ano
            if(isset($query['year']) && $query['year'] == $r['year']) {
                // $result[] = $value[0];
                $result[] = $r;
            } else if(!isset($query['year'])) {
                // $result[] = $value[0];
                $result[] = $r;
            }
        }
        return $result;
    }


    public function groupedcover_infra($query) {
        
        if (!isset($query['territory_id']) || !isset($query['level_id']) || !isset($query['buffer'])) {
            return [];
        }
        
        $territory_id = $query['territory_id'];
        $level_id = $query['level_id'];
        $buffer = $query['buffer'];

        if (isset($query['classification_ids'])) {
            $classification_ids = explode(",", $query['classification_ids']);
        }

        $estatisticas = [];
        $resultf = [];

        // para cada classe realiza consulta em todos os niveis
        foreach ($classification_ids as $key => $cid) {
            $result = [];

            $consulta = "
                select * FROM map_get_infrabuffer_stats_coberturav2(ARRAY [$territory_id], ARRAY [$level_id], ARRAY [$buffer], ARRAY [$cid]) ORDER BY ano;
            ";

            $estatisticas = $this->EstatisticaNivel->query($consulta);


            if(sizeof($estatisticas) <= 0) {

                $consulta = "
                    select * FROM map_get_infrabuffer_stats_coberturav2(ARRAY [$territory_id], ARRAY [$level_id], ARRAY [$buffer]) ORDER BY ano;
                ";

                $estatisticas = $this->EstatisticaNivel->query($consulta);

                for ($i=0; $i < sizeof($estatisticas); $i++) {
                    $estatisticas[$i][0]['area'] = 0;
                }
            }

            foreach ($estatisticas as $key => $value) {
                $r = array(
                    "id" => $value[0]['classe'],
                    "level_id" => $value[0]['infra_level'],
                    "l1" => $value[0]['classe_l1'],
                    "l2" => $value[0]['classe_l2'],
                    "l3" => $value[0]['classe_l3'],
                    "territory" => $value[0]['territorio'],
                    "year" => $value[0]['ano'],
                    "area" => $value[0]['area'],
                );

                if($r["id"] == $r["l1"]){
                    $r["l"] = '1';
                }
                elseif ($r["id"] == $r["l2"]){
                    $r["l"] = '2';
                }
                elseif($r["id"] == $r["l3"]){
                    $r["l"] = '3';
                }

                $result[] = $r;
            }

            // agrupa por classe ano
            $resTerClasseAno = [];
            foreach ($result as $key => $re) {
                $resTerClasseAno[$re['territory'].'-'.$cid.'-'.$re['year']] = $re;
                $resTerClasseAno[$re['territory'].'-'.$cid.'-'.$re['year']]['area'] = 0;
                $resTerClasseAno[$re['territory'].'-'.$cid.'-'.$re['year']]['id'] = intval($cid);
                $resTerClasseAno[$re['territory'].'-'.$cid.'-'.$re['year']]['l1'] = intval($cid);
                $resTerClasseAno[$re['territory'].'-'.$cid.'-'.$re['year']]['l2'] = intval($cid);
                $resTerClasseAno[$re['territory'].'-'.$cid.'-'.$re['year']]['l3'] = intval($cid);
            }

            foreach ($result as $key => $re2) {
                //if($re2['l'] == '3'){
                    $resTerClasseAno[$re2['territory'].'-'.$cid.'-'.$re2['year']]['area'] += $re2['area'];
                    /*if(!isset($resTerClasseAno[$re2['territory'].'-'.$cid.'-'.$re2['year']]['s'])){
                        $resTerClasseAno[$re2['territory'].'-'.$cid.'-'.$re2['year']]['s'] = "";
                    }
                    $resTerClasseAno[$re2['territory'].'-'.$cid.'-'.$re2['year']]['s'] .= ("-". $re2['id']."-");*/
                //}
            }

            $result1 = [];
            foreach ($resTerClasseAno as $key => $re3) {
                $result1[] = $re3;
            }

            $resultf = array_merge($resultf,$result1);
        }

        return $resultf;
    }
}
