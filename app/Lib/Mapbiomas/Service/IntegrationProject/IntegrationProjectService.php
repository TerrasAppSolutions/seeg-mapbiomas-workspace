<?php
App::uses('IntegrationProject', 'Model');
App::uses('Integration', 'Model');
App::uses('Classificacao', 'Model');

class IntegrationProjectService {

    public $IntegrationProject;

    public function __construct() {
        $this->IntegrationProject = new IntegrationProject();
        $this->Integration = new Integration();
        $this->Classificacao = new Classificacao();
    }

    /*
     * API
     */

    public function get($id) {
        $IntegrationProject = $this->IntegrationProject->find('first', array(
        ));

        return $IntegrationProject;
    }

    public function query($options = null, $paginate = null)
    {
        $usuarioAuth = $this->IntegrationProject->authUser;
                
        $optionsConditions = isset($options['conditions']) ? $options['conditions'] : array();

        // recupera dados por bioma
        $options['conditions']['biome_id'] = $usuarioAuth['UsuarioBioma']['Bioma']['id'];
        
        // recupera dados
        $data = $this->IntegrationProject->find('all', $options);
        
        if ($paginate) {
            $countPagesOpt = $options;
            unset($countPagesOpt['limit']);
            unset($countPagesOpt['page']);
            $total = $this->IntegrationProject->find('count', $countPagesOpt);
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

        // save temporal  project data
        $dataSaved = $this->IntegrationProject->save($data);

        return $dataSaved;
    }
    
    public function delete($id)
    {
        return $this->IntegrationProject->delete($id);
    }

    public function activateProject($data)
    {
        $this->IntegrationProject->updateAll(
            array('active' => False)
        );

        // salva dados do projeto
        $project = $this->IntegrationProject->save($data);

        return $project;
    }
}
