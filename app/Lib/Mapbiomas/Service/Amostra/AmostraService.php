<?php
App::uses('Amostra', 'Model');

class AmostraService
{

    public $Amostra;

    public function __construct()
    {
        $this->Amostra = new Amostra();
    }

    /*
     * API
     */

    public function get($id)
    {

        $usuarioAuth = $this->Amostra->authUser;

        $classeArea = $this->Amostra->find('first', array(
            'conditions' => array(
                'Amostra.id'         => $id,
                'Amostra.usuario_id' => $usuarioAuth['Usuario']['id'],
            ),
            'contain'    => $this->Amostra->contains['default'],
        ));

        return $classeArea;
    }

    public function query($options = null, $paginate = null)
    {

        $usuarioAuth = $this->Amostra->authUser;

        $options['contain'] = $this->Amostra->contains['default'];

        $options['conditions'] = isset($options['conditions']) ? $options['conditions'] : array();       

        $data = $this->Amostra->find('all', $options);

        if ($paginate) {
            $countPagesOpt = $options;
            unset($countPagesOpt['limit']);
            unset($countPagesOpt['page']);
            $total = $this->Amostra->find('count', $countPagesOpt);
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

        $usuarioAuth = $this->Amostra->authUser;

        if (empty($data['Amostra']['usuario_id']) && $usuarioAuth['Usuario']['id']) {
            $data['Amostra']['usuario_id'] = $usuarioAuth['Usuario']['id'];
        }

        unset($data['Amostra']['modified']);

        // save classe area
        $dataSaved = $this->Amostra->save($data);

        /*
         * Retorna a dado salvo
         */
        $classeArea = $this->get($this->Amostra->id);

        return $classeArea;
    }
    
    public function delete($id)
    {
        return $this->Amostra->delete($id);
    }

}
