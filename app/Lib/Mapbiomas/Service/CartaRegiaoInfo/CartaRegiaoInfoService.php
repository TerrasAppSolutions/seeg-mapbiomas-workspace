<?php
App::uses('CartaRegiaoInfo', 'Model');

class CartaRegiaoInfoService {

    public $CartaRegiaoInfo;

    public function __construct() {
        $this->CartaRegiaoInfo = new CartaRegiaoInfo();
    }

    /*
     * API
     */

    public function get($id) {
        $cartaRegiaoInfo = $this->CartaRegiaoInfo->find('first', array(
        ));

        return $cartaRegiaoInfo;
    }

    public function query($options = null, $paginate = null)
    {
        $usuarioAuth = $this->CartaRegiaoInfo->authUser;
                
        $optionsConditions = isset($options['conditions']) ? $options['conditions'] : array();
        
        // recupera dados
        $data = $this->CartaRegiaoInfo->find('all', $options);
        
        if ($paginate) {
            $countPagesOpt = $options;
            unset($countPagesOpt['limit']);
            unset($countPagesOpt['page']);
            $total = $this->CartaRegiaoInfo->find('count', $countPagesOpt);
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
