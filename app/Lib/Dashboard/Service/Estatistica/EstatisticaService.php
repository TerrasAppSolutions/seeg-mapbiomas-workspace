<?php
App::uses('EstatisticaNivel', 'Model');
App::uses('EstatisticaTransicaoNivel', 'Model');


class EstatisticaService {
    
    public $EstatisticaNivel;
    
    public $EstatisticaTransicaoNivel;
    
    public function __construct() {
        $this->EstatisticaNivel = new EstatisticaNivel();
        $this->EstatisticaTransicaoNivel = new EstatisticaTransicaoNivel();
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
}
