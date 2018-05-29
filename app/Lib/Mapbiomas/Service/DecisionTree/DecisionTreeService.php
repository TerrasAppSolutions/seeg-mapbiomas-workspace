<?php

App::uses('DecisionTree', 'Model');

class DecisionTreeService
{

    public $DecisionTree;

    public function __construct()
    {
        $this->DecisionTree = new DecisionTree();
    }

    /*
     * API
     */

    public function get($id)
    {
        $dtree = $this->DecisionTree->find('first', array(
            'conditions' => array(
                'DecisionTree.id' => $id,
            ),
            'contain'    => $this->DecisionTree->contains['default'],
        ));

        return $dtree;
    }

    public function query($options = null, $paginate = null)
    {

        $usuarioAuth = $this->DecisionTree->authUser;

        $options['contain'] = $this->DecisionTree->contains['default'];

        $optionsConditions = isset($options['conditions']) ? $options['conditions'] : array();

        // recupera dados
        $data = $this->DecisionTree->find('all', $options);

        if ($paginate) {
            $countPagesOpt = $options;
            unset($countPagesOpt['limit']);
            unset($countPagesOpt['page']);
            $total = $this->DecisionTree->find('count', $countPagesOpt);
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

        $usuarioAuth = $this->DecisionTree->authUser;

        $usuarioBiomaId = $usuarioAuth['UsuarioBioma']['Bioma']['id'];

        $usuarioId = $usuarioAuth['UsuarioBioma']['Bioma']['id'];

        // associa dados ao usuario
        $data['DecisionTree']['usuario_id'] = $usuarioAuth['Usuario']['id'];

        // verifica se parametros utilizam a árvore, se sim, a arvore nao pode ser modificada
        if (!empty($data['DecisionTree']['id'])) {
            $classificacaoCount = $this->DecisionTree->Classificacao->find('count', array(
                'conditions' => array(
                    'Classificacao.decision_tree_id' => $data['DecisionTree']['id'],
                ),
            ));
            if ($classificacaoCount > 0) {
                return null;
            }
        }

        unset($data['DecisionTree']['modified']);

        // salva dtree
        $dataSaved = $this->DecisionTree->save($data);

        /*
         * Retorna a dado salvo
         */
        $dtree = $this->get($this->DecisionTree->id);

        return $dtree;
    }

    public function delete($id)
    {

        // verifica se parametros utilizam a árvore, se sim, a arvore nao pode ser modificada

        $classificacaoCount = $this->DecisionTree->Classificacao->find('count', array(
            'conditions' => array(
                'Classificacao.decision_tree_id' => $id,
            ),
        ));

        if ($classificacaoCount > 0) {
            return null;
        }

        $delete = $this->DecisionTree->delete($id);

        return $delete;
    }

}
