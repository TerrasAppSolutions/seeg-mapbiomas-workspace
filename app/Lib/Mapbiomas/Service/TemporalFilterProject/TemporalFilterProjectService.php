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

        // recupera dados por bioma
        $options['conditions']['biome_id'] = $usuarioAuth['UsuarioBioma']['Bioma']['id'];
        
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

    /**
     * Deletar projeto
     * @param {id} id
     */
    public function delete($id)
    {
        return $this->TemporalFilterProject->delete($id);
    }

    /**
     * Ativa projeto para processamento
     */
    public function activateProject($data)
    {
        // recupera os projetos relacionados com biome id
        $projects = $this->TemporalFilterProject->find('all', array(
            'conditions' => array(
                'biome_id' => $data['biome_id']
            ),
            'order' => 'TemporalFilterProject.created DESC'
        ));

        // redefine o campo activate para falso
        // apenas o escolhido que permanece com o valor selecionado
        foreach($projects as $key => $value) {
            $projects[$key]['TemporalFilterProject']['active'] = false;

            if($projects[$key]['TemporalFilterProject']['id'] == $data['id']) {
                $projects[$key]['TemporalFilterProject']['active'] = $data['active'];
            }
        }

        $projectsSaved = $this->TemporalFilterProject->saveMany($projects);

        return $projects;
    }
}
