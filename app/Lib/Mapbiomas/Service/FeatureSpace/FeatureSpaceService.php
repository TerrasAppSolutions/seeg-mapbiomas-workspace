<?php
App::uses('FeatureSpace', 'Model');

class FeatureSpaceService {

    public $FeatureSpace;

    public function __construct() {
        $this->FeatureSpace = new FeatureSpace();
    }

    /*
     * API
     */

    public function get($id) {
        $FeatureSpace = $this->FeatureSpace->find('first', array(
        ));

        return $FeatureSpace;
    }

    public function query($options = null, $paginate = null)
    {
        $usuarioAuth = $this->FeatureSpace->authUser;
                
        $optionsConditions = isset($options['conditions']) ? $options['conditions'] : array();
        
        // recupera dados
        $data = $this->FeatureSpace->find('all', $options);
        
        if ($paginate) {
            $countPagesOpt = $options;
            unset($countPagesOpt['limit']);
            unset($countPagesOpt['page']);
            $total = $this->FeatureSpace->find('count', $countPagesOpt);
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
