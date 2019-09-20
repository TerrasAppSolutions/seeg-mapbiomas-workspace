<?php
App::uses('Classification', 'Model');

class ClassificationService {

    public $Classification;

    public function __construct() {
        $this->Classification = new Classification();
    }

    /*
     * API
     */

    public function get($id) {
        $Classification = $this->Classification->find('first', array(
        ));

        return $Classification;
    }

    public function query($options = null, $paginate = null)
    {
        $usuarioAuth = $this->Classification->authUser;
                
        $optionsConditions = isset($options['conditions']) ? $options['conditions'] : array();
        
        // recupera dados
        $data = $this->Classification->find('all', $options);
        
        if ($paginate) {
            $countPagesOpt = $options;
            unset($countPagesOpt['limit']);
            unset($countPagesOpt['page']);
            $total = $this->Classification->find('count', $countPagesOpt);
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

        $usuarioAuth = $this->Classification->authUser;

        // save temporal filter  data
        // definição do nome e id do bioma do usuário
        // $usuarioBiomaNome = $usuarioAuth['UsuarioBioma']['Bioma']['nome'];
        // $usuarioBiomaId = $usuarioAuth['UsuarioBioma']['Bioma']['id'];

        // $data['biome_name'] = $usuarioBiomaNome;
        // $data['biome_id'] = $usuarioBiomaId;

        // verifica se alguma tarefa possui mesma configuração e atualiza
        $this->Classification->updateAll(
            array('active' => False),
            array(
                'carta_id' => $data['Classification']['carta_id'],
                'biome_id' => $data['Classification']['biome_id']
            )
        );

        $dataSaved = $this->Classification->save($data);

        return $dataSaved;
    }

    public function saveLot($data)
    {
        // pr($data);
        // exit;

        $usuarioAuth = $this->Classification->authUser;

        $saved = [];
        
        // procura as tarefas com a mesma configurações das criadas
        // seta o parâmetro active = false
        // envia notificação para usuário
        for ($i=0; $i < sizeof($data); $i++) { 
            $this->Classification->updateAll(
                array('active' => False),
                array(
                    'carta_id' => $data[$i]['carta_id'],
                    'biome_id' => $data[$i]['biome_id']
                )
            );
        }

        if($this->Classification->saveAll($data)) {
            $saved = $this->Classification->elements; //contains insert_ids
        }        
        return $saved;
    }

    /**
     * Deletar tarefa
     * @param {id} id
     */
    public function delete($id)
    {
        return $this->Classification->delete($id);
    }
}
