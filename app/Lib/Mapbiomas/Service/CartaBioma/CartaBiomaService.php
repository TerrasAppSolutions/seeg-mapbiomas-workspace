<?php
App::uses('CartaBioma', 'Model');

class CartaBiomaService {

    public $CartaBioma;

    public function __construct() {
        $this->CartaBioma = new CartaBioma();
    }

    /*
     * API
     */

    public function get($id) {
        $CartaBioma = $this->CartaBioma->find('first', array(
        ));

        return $CartaBioma;
    }

    public function query($options = null, $paginate = null)
    {
        $usuarioAuth = $this->CartaBioma->authUser;

        // definição do nome e id do bioma do usuário
        $usuarioBiomaNome = $usuarioAuth['UsuarioBioma']['Bioma']['nome'];
        $usuarioBiomaId = $usuarioAuth['UsuarioBioma']['Bioma']['id'];
                
        $optionsConditions = isset($options['conditions']) ? $options['conditions'] : array();

        // pr($usuarioBiomaId);

        // $options['conditions']['CartaBioma.bioma_id'] = 6;
        $options['conditions']['CartaBioma.bioma_id'] = $usuarioBiomaId;
        
        // recupera dados
        $data = $this->CartaBioma->find('all', $options);
        
        if ($paginate) {
            $countPagesOpt = $options;
            unset($countPagesOpt['limit']);
            unset($countPagesOpt['page']);
            $total = $this->CartaBioma->find('count', $countPagesOpt);
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
