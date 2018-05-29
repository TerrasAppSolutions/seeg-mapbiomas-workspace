<?php
App::uses('TemporalFilterProject', 'Model');
App::uses('TemporalFilter', 'Model');
App::uses('Classificacao', 'Model');

class TemporalFilterProjectService {

    public $TemporalFilterProject;

    public function __construct() {
        $this->TemporalFilterProject = new TemporalFilterProject();
        $this->TemporalFilter = new TemporalFilter();
        $this->Classificacao = new Classificacao();
    }

    /*
     * API
     */

    public function get($id) {
        $TemporalFilterProject = $this->TemporalFilterProject->find('first', array(
        ));

        return $TemporalFilterProject;
    }

    public function query($options = null, $paginate = null)
    {
        $usuarioAuth = $this->TemporalFilterProject->authUser;
                
        $optionsConditions = isset($options['conditions']) ? $options['conditions'] : array();
        
        // recupera dados
        $data = $this->TemporalFilterProject->find('all', $options);
        
        if ($paginate) {
            $countPagesOpt = $options;
            unset($countPagesOpt['limit']);
            unset($countPagesOpt['page']);
            $total = $this->TemporalFilterProject->find('count', $countPagesOpt);
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

        // save temporal filter project data
        $dataSaved = $this->TemporalFilterProject->save($data);

        return $dataSaved;
    }

    public function cloneProject($data)
    {
        $usuarioAuth = $this->Classificacao->authUser;

        // recupera regras do projeto
        $rules = $this->TemporalFilter->find('all', array(
            'conditions' => array(
                'TemporalFilter.filter_project_id' => $data['id']
            ),
        ));

        // cria um novo projeto
        unset($data['id']);

        // definição do nome e id do bioma do usuário
        $usuarioBiomaNome = $usuarioAuth['UsuarioBioma']['Bioma']['nome'];
        $usuarioBiomaId = $usuarioAuth['UsuarioBioma']['Bioma']['id'];

        $data['biome_name'] = $usuarioBiomaNome;
        $data['biome_id'] = $usuarioBiomaId;

        // clone project
        $newProject = $this->TemporalFilterProject->save($data);

        // elimina o campo id e redefine o campo filter_project_id
        foreach($rules as $key => $value) {
            unset($rules[$key]['TemporalFilter']['id']);
            $rules[$key]['TemporalFilter']['filter_project_id'] = $newProject['TemporalFilterProject']['id'];
        }

        $savedRules = $this->TemporalFilter->saveMany($rules);

        return $newProject;
    }

    public function delete($id)
    {
        return $this->TemporalFilterProject->delete($id);
    }
}
