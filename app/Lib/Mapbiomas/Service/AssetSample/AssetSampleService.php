<?php
App::uses('AssetSample', 'Model');

class AssetSampleService {

    public $AssetSample;

    public function __construct() {
        $this->AssetSample = new AssetSample();
    }

    /*
     * API
     */

    public function get($id) {
        $AssetSample = $this->AssetSample->find('first', array(
        ));

        return $AssetSample;
    }

    public function query($options = null, $paginate = null)
    {
        $usuarioAuth = $this->AssetSample->authUser;
                
        $optionsConditions = isset($options['conditions']) ? $options['conditions'] : array();
        
        // recupera dados
        $data = $this->AssetSample->find('all', $options);
        
        if ($paginate) {
            $countPagesOpt = $options;
            unset($countPagesOpt['limit']);
            unset($countPagesOpt['page']);
            $total = $this->AssetSample->find('count', $countPagesOpt);
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
