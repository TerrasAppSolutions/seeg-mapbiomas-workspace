<?php
App::uses('TemporalFilter', 'Model');
App::uses('Classificacao', 'Model');

class TemporalFilterService {

    public $TemporalFilter;

    public function __construct() {
        $this->TemporalFilter = new TemporalFilter();
        $this->Classificacao = new Classificacao();
    }

    /*
     * API
     */

    public function get($id) {
        $TemporalFilter = $this->TemporalFilter->find('first', array(
        ));

        return $TemporalFilter;
    }

    public function query($options = null, $paginate = null)
    {
        $usuarioAuth = $this->TemporalFilter->authUser;
                
        $optionsConditions = isset($options['conditions']) ? $options['conditions'] : array();
        
        // recupera dados
        $data = $this->TemporalFilter->find('all', $options);
        
        if ($paginate) {
            $countPagesOpt = $options;
            unset($countPagesOpt['limit']);
            unset($countPagesOpt['page']);
            $total = $this->TemporalFilter->find('count', $countPagesOpt);
            $data  = array(
                'data'       => $data,
                'page'       => $paginate['page'],
                'totalPages' => ceil($total / $options['limit']),
                'total'      => $total,
            );
        }
        return $data;
    }
    
    public function save($data)
    {
        $usuarioAuth = $this->Classificacao->authUser;

        // definição do nome e id do bioma do usuário
        /* $usuarioBiomaNome = $usuarioAuth['UsuarioBioma']['Bioma']['nome'];
        $usuarioBiomaId = $usuarioAuth['UsuarioBioma']['Bioma']['id'];

        $data['biome_name'] = $usuarioBiomaNome;
        $data['biome_id'] = $usuarioBiomaId; */

        // save temporal filter data
        $dataSaved = $this->TemporalFilter->save($data);

        return $dataSaved;
    }

    public function delete($id)
    {
        return $this->TemporalFilter->delete($id);
    }
}
