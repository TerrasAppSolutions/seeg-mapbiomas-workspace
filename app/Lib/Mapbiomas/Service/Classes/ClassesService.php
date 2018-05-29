<?php
App::uses('Classe', 'Model');

class ClassesService {

    public $Classe;

    public function __construct() {
        $this->Classe = new Classe();
    }

    /*
     * API
     */

    public function get($id) {
        $Classe = $this->Classe->find('first', array(
        ));

        return $Classe;
    }

    public function query($options = null, $paginate = null)
    {
        $usuarioAuth = $this->Classe->authUser;
                
        $optionsConditions = isset($options['conditions']) ? $options['conditions'] : array();
        
        // recupera dados
        $data = $this->Classe->find('all', $options);
        
        if ($paginate) {
            $countPagesOpt = $options;
            unset($countPagesOpt['limit']);
            unset($countPagesOpt['page']);
            $total = $this->Classe->find('count', $countPagesOpt);
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
