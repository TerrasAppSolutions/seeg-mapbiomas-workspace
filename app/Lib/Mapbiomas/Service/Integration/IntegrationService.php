<?php
App::uses('Integration', 'Model');
App::uses('Classificacao', 'Model');

class IntegrationService {

    public $Integration;

    public function __construct() {
        $this->Integration = new Integration();
        $this->Classificacao = new Classificacao();
        $this->Integration->Behaviors->load('Containable');
    }

    /*
     * API
     */

    public function get($id) {
        $Integration = $this->Integration->find('first', array(
        ));

        return $Integration;
    }

    public function query($options = null, $paginate = null)
    {
        $usuarioAuth = $this->Integration->authUser;
                
        $optionsConditions = isset($options['conditions']) ? $options['conditions'] : array();

        $options['contain'] = array('ClasseAsset' => 
            array('Classe', 'Asset')
        );
        
        // recupera dados
        $data = $this->Integration->find('all', $options);
        
        if ($paginate) {
            $countPagesOpt = $options;
            unset($countPagesOpt['limit']);
            unset($countPagesOpt['page']);
            $total = $this->Integration->find('count', $countPagesOpt);
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
        $usuarioBiomaNome = $usuarioAuth['UsuarioBioma']['Bioma']['nome'];
        $usuarioBiomaId = $usuarioAuth['UsuarioBioma']['Bioma']['id'];

        $data['biome_name'] = $usuarioBiomaNome;
        $data['biome_id'] = $usuarioBiomaId;

        // save temporal   data
        $dataSaved = $this->Integration->save($data);

        return $dataSaved;
    }

    public function saveLot($data)
    {
        // deleta todos as regras salvas naquele projeto
        if(sizeof($data) && isset($data[0]['Integration'])) {
            $this->Integration->deleteAll(
                array('integration_project_id' => $data[0]['Integration']['integration_project_id'])
            );
        }

        $saved = $this->Integration->saveMany($data);

        return $saved;
    }
    
    public function delete($id)
    {
        return $this->Integration->delete($id);
    }
}
