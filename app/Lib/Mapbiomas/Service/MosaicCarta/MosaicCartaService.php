<?php
App::uses('MosaicCarta', 'Model');

class MosaicCartaService {

    public $MosaicCarta;

    public function __construct() {
        $this->MosaicCarta = new MosaicCarta();
    }

    /*
     * API
     */

    public function get($id) {
        $MosaicCarta = $this->MosaicCarta->find('first', array(
        ));

        return $MosaicCarta;
    }

    public function query($options = null, $paginate = null)
    {
        $usuarioAuth = $this->MosaicCarta->authUser;
                
        $optionsConditions = isset($options['conditions']) ? $options['conditions'] : array();
        
        // recupera dados
        $data = $this->MosaicCarta->find('all', $options);
        
        if ($paginate) {
            $countPagesOpt = $options;
            unset($countPagesOpt['limit']);
            unset($countPagesOpt['page']);
            $total = $this->MosaicCarta->find('count', $countPagesOpt);
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

        $usuarioAuth = $this->MosaicCarta->authUser;

        // save temporal filter  data
        // definição do nome e id do bioma do usuário
        // $usuarioBiomaNome = $usuarioAuth['UsuarioBioma']['Bioma']['nome'];
        // $usuarioBiomaId = $usuarioAuth['UsuarioBioma']['Bioma']['id'];

        // $data['biome_name'] = $usuarioBiomaNome;
        // $data['biome_id'] = $usuarioBiomaId;

        // verifica se alguma tarefa possui mesma configuração e atualiza
        $this->MosaicCarta->updateAll(
            array('active' => False),
            array(
                'carta_id' => $data['MosaicCarta']['carta_id'],
                'year' => $data['MosaicCarta']['year'],
                'biome_id' => $data['MosaicCarta']['biome_id'],
                'sensor' => $data['MosaicCarta']['sensor']
            )
        );

        $dataSaved = $this->MosaicCarta->save($data);

        return $dataSaved;
    }

    public function saveLot($data)
    {
        // pr($data);
        // exit;

        $usuarioAuth = $this->MosaicCarta->authUser;

        $saved = [];
        
        // procura as tarefas com a mesma configurações das criadas
        // seta o parâmetro active = false
        // envia notificação para usuário
        for ($i=0; $i < sizeof($data); $i++) { 
            $this->MosaicCarta->updateAll(
                array('active' => False),
                array(
                    'carta_id' => $data[$i]['carta_id'],
                    'year' => $data[$i]['year'],
                    'biome_id' => $data[$i]['biome_id'],
                    'sensor' => $data[$i]['sensor']
                )
            );
        }

        if($this->MosaicCarta->saveAll($data)) {
            $saved = $this->MosaicCarta->elements; //contains insert_ids
        }

        return $saved;
    }

    /**
     * Deletar tarefa
     * @param {id} id
     */
    public function delete($id)
    {
        return $this->MosaicCarta->delete($id);
    }

}
