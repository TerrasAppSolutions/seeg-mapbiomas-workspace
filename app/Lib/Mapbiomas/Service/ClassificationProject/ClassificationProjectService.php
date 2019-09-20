<?php
App::uses('ClassificationProject', 'Model');

class ClassificationProjectService {

    public $ClassificationProject;

    public function __construct() {
        $this->ClassificationProject = new ClassificationProject();
    }

    /*
     * API
     */

    public function get($id) {
        $ClassificationProject = $this->ClassificationProject->find('first', array(
        ));

        return $ClassificationProject;
    }

    public function query($options = null, $paginate = null)
    {
        $usuarioAuth = $this->ClassificationProject->authUser;
                
        $optionsConditions = isset($options['conditions']) ? $options['conditions'] : array();

        // recupera dados por bioma
        $options['conditions']['biome_id'] = $usuarioAuth['UsuarioBioma']['Bioma']['id'];
        
        // recupera dados
        $data = $this->ClassificationProject->find('all', $options);
        
        if ($paginate) {
            $countPagesOpt = $options;
            unset($countPagesOpt['limit']);
            unset($countPagesOpt['page']);
            $total = $this->ClassificationProject->find('count', $countPagesOpt);
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

        // pr($data);
        // exit;

        $usuarioAuth = $this->ClassificationProject->authUser;

        // save temporal filter  data
        // definição do nome e id do bioma do usuário
        $usuarioBiomaNome = $usuarioAuth['UsuarioBioma']['Bioma']['nome'];
        $usuarioBiomaId = $usuarioAuth['UsuarioBioma']['Bioma']['id'];

        $data['biome_name'] = $usuarioBiomaNome;
        $data['biome_id'] = $usuarioBiomaId;

        $dataSaved = $this->ClassificationProject->save($data);

        return $dataSaved;
    }

    /**
     * Deletar projeto
     * @param {id} id
     */
    public function delete($id)
    {
        return $this->ClassificationProject->delete($id);
    }
}
