<?php
App::uses('MosaicCartaProject', 'Model');

class MosaicCartaProjectService {

    public $MosaicCartaProject;

    public function __construct() {
        $this->MosaicCartaProject = new MosaicCartaProject();
    }

    /*
     * API
     */

    public function get($id) {
        $MosaicCartaProject = $this->MosaicCartaProject->find('first', array(
        ));

        return $MosaicCartaProject;
    }

    public function query($options = null, $paginate = null)
    {
        $usuarioAuth = $this->MosaicCartaProject->authUser;
                
        $optionsConditions = isset($options['conditions']) ? $options['conditions'] : array();

        // recupera dados por bioma
        $options['conditions']['biome_id'] = $usuarioAuth['UsuarioBioma']['Bioma']['id'];
        
        // recupera dados
        $data = $this->MosaicCartaProject->find('all', $options);
        
        if ($paginate) {
            $countPagesOpt = $options;
            unset($countPagesOpt['limit']);
            unset($countPagesOpt['page']);
            $total = $this->MosaicCartaProject->find('count', $countPagesOpt);
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

        $usuarioAuth = $this->MosaicCartaProject->authUser;

        // save temporal filter  data
        // definição do nome e id do bioma do usuário
        $usuarioBiomaNome = $usuarioAuth['UsuarioBioma']['Bioma']['nome'];
        $usuarioBiomaId = $usuarioAuth['UsuarioBioma']['Bioma']['id'];

        $data['biome_name'] = $usuarioBiomaNome;
        $data['biome_id'] = $usuarioBiomaId;

        $dataSaved = $this->MosaicCartaProject->save($data);

        return $dataSaved;
    }

    /**
     * Deletar projeto
     * @param {id} id
     */
    public function delete($id)
    {
        return $this->MosaicCartaProject->delete($id);
    }
}
