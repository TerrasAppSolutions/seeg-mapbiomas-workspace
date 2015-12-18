<?php
App::uses('Estatistica', 'Model');
App::uses('EstatisticaTransicao', 'Model');

class EstatisticaService {
    
    public $Estatistica;
    
    public $EstatisticaTransicao;
    
    public function __construct() {
        $this->Estatistica = new Estatistica();
        $this->EstatisticaTransicao = new EstatisticaTransicao();
    }
    
    /*
     * API
    */
    
    public function coverage($query) {
        
        $conditions = [];
        
        if (isset($query['year'])) {
            $conditions['Estatistica.ano'] = $query['year'];
        }
        
        if (isset($query['territory_id'])) {
            $conditions['Estatistica.territorio'] = $query['territory_id'];
        }
        
        if (isset($query['classification_ids'])) {
            $classification_ids = explode(",", $query['classification_ids']);
            $conditions['Estatistica.classe'] = $classification_ids;
        }
        
        $estatisticas = [];
        
        if (count($conditions) > 0) {
            $estatisticas = $this->Estatistica->find('all', array(
                'conditions' => $conditions,
                'contain' => $this->Estatistica->contains['default']
            ));
        }
        
        $result = [];
        
        foreach ($estatisticas as $key => $stat) {
            $r = array(
                "id" => $stat['Estatistica']['classe'],
                "area" => $stat['Estatistica']['area'],
                "percentage" => $stat['Estatistica']['percentagem'],
            );
            $result[] = $r;
        }
        
        return $result;
    }
    
    public function transitions($query) {
        
        $conditions = [];
        
        $year1 = null;
        if (isset($query['year'])) {
            $year1 = explode(",", $query['year']) [0];
            $conditions['EstatisticaTransicao.ano_inicial'] = $year1;
        }
        
        $year2 = null;
        if (isset($query['year'])) {
            $year2 = explode(",", $query['year']) [1];
            $conditions['EstatisticaTransicao.ano_final'] = $year2;
        }
        
        if (isset($query['territory_id'])) {
            $conditions['EstatisticaTransicao.territorio'] = $query['territory_id'];
        }
        
        $estatisticasTransicoes = [];
        
        if (count($conditions) > 0) {
            $estatisticasTransicoes = $this->EstatisticaTransicao->find('all', array(
                'conditions' => $conditions
            ));
        }
        
        $result = [];
        $coveragesClasses = [];
        foreach ($estatisticasTransicoes as $key => $estatisticaTransicao) {
            $r = array(
                "from" => $estatisticaTransicao['EstatisticaTransicao']['classe_inicial'],
                "to" => $estatisticaTransicao['EstatisticaTransicao']['classe_final'],
                "percentage" => $estatisticaTransicao['EstatisticaTransicao']['porcentagem'],
                "area" => $estatisticaTransicao['EstatisticaTransicao']['area']
            );
            $result[] = $r;
            $coveragesClasses[] = $estatisticaTransicao['EstatisticaTransicao']['classe_inicial'];
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
}
