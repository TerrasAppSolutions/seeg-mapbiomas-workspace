<?php
App::uses('Classificacao', 'Model');
App::uses('CartaRegiao', 'Model');

class ClassificacaoService {

    public $Classificacao;

    public function __construct() {
        $this->Classificacao = new Classificacao();
    }

    /*
     * API
     */

    public function get($id) {
        $classificacao = $this->Classificacao->find('first', array(
            'conditions' => array(
                'Classificacao.id' => $id,
            ),
            'contain'    => $this->Classificacao->contains['default'],
        ));

        if ($classificacao) {
            $classificacao = $this->formatData([$classificacao])[0];
        }

        return $classificacao;
    }

    public function query($options = null) {

        $usuarioAuth = $this->Classificacao->authUser;                       

        $options['contain'] = $this->Classificacao->contains['default'];

        // controle de limite de registro        
        $options['limit'] = isset($options['limit']) && $options['limit'] <= 100 ? $options['limit'] : 100;

        // paginacao        
        $paginate = isset($options['page']) ? ['page' => $options['page']] : null;

        
        // filtros        
        $options['conditions'] = array();       

        // carta                
        if(isset($options['chart'])){
            $options['conditions']['Carta.codigo'] = $options['chart'];
        }

        // ano
        if(isset($options['year'])){
            $options['conditions']['Classificacao.year'] = $options['year'];
        }

        // recupera dados
        $data = $this->Classificacao->find('all', $options);

        $data = $this->formatData($data);

        if ($paginate) {
            $countPagesOpt = $options;
            unset($countPagesOpt['limit']);
            unset($countPagesOpt['page']);
            $total = $this->Classificacao->find('count', $countPagesOpt);
            $data  = array(
                'data'       => $data,
                'page'       => $paginate['page'],
                'totalPages' => ceil($total / $options['limit']),
                'total'      => $total,
            );
        }

        return $data;
    }

 
    /*
     * FIM API
     */
    private function formatData($data) {
        foreach ($data as $key => &$value) {
            
            $dataFormat = array(
                "id" => $value['Classificacao']['id'],
                "year" => $value['Classificacao']['year'],
                "carta" => $value['Carta']['codigo'],
                "t0" => $value['Classificacao']['t0'],
                "t1" => $value['Classificacao']['t1'],
                "cloudcover" => $value['Classificacao']['cloudcover'],
                "sensor" => $value['Classificacao']['sensor'],
                "bioma" => $value['Bioma']['nome'],
                "region" => $value['Classificacao']['region'],
                "geometry" => null
            );


            $value = $dataFormat;

           
        }

        return $data;
    }      
}
