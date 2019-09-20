<?php
App::uses('ClasseAsset', 'Model');

class ClasseAssetService {

    public $ClasseAsset;

    public function __construct() {
        $this->ClasseAsset = new ClasseAsset();
    }

    /*
     * API
     */

    public function get($id) {
        $ClasseAsset = $this->ClasseAsset->find('first', array(
        ));

        return $ClasseAsset;
    }

    public function query($options = null, $paginate = null)
    {
        $usuarioAuth = $this->ClasseAsset->authUser;
                
        $optionsConditions = isset($options['conditions']) ? $options['conditions'] : array();
        
        // recupera dados
        $data = $this->ClasseAsset->find('all', $options);
        
        if ($paginate) {
            $countPagesOpt = $options;
            unset($countPagesOpt['limit']);
            unset($countPagesOpt['page']);
            $total = $this->ClasseAsset->find('count', $countPagesOpt);
            $data  = array(
                'data'       => $data,
                'page'       => $paginate['page'],
                'totalPages' => ceil($total / $options['limit']),
                'total'      => $total,
            );
        }
        return $data;
    }
    
}
