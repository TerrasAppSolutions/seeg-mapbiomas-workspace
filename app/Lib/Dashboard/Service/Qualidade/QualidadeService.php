<?php
App::uses('Qualidade', 'Model');

class QualidadeService {
    
    public $Qualidade;
    
    public function __construct() {
        $this->Qualidade = new Qualidade();
    }
    
    /*
     * API
     */
     public function query($query) {
        
        $options = array(
            'conditions' => null,            
        );
        
        if (isset($query['year'])) {
            $options['conditions']['Qualidade.ano'] = $query['year'];
        }
        
        if (isset($query['bioma'])) {
            $options['conditions']['Bioma.nome'] = $query['bioma'];
        }
        
        if (isset($query['chart'])) {            
            $options['conditions']['Carta.codigo'] = $query['chart'];
        }       
        
        $options['contain'] = $this->Qualidade->contains['default'];
                        
        $qualidades = $this->Qualidade->find('all', $options);              
        
        $result = [];
        
        foreach ($qualidades as $key => $q) {
            $r = array(                
                "chart" => $q['Carta']['codigo'],                
                "bioma" => $q['Bioma']['nome'],                
                "year" => $q['Qualidade']['ano'],                
                "quality" => $q['Qualidade']['qualidade']
            );
            $result[] = $r;
        }
        
        return $result;
    }
}
