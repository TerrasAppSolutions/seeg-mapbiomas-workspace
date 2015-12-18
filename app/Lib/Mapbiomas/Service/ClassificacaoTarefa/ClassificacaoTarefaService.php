<?php
App::uses('ClassificacaoTarefa', 'Model');

class ClassificacaoTarefaService {
    
    public $ClassificacaoTarefa;
    
    public function __construct() {
        $this->ClassificacaoTarefa = new ClassificacaoTarefa();
    }
    
    /*
     * API
    */
    
    public function get($id) {
        $classificacaoTarefa = $this->ClassificacaoTarefa->find('first', array(
            'conditions' => array(
                'ClassificacaoTarefa.id' => $id
            ) ,
            'contain' => $this->ClassificacaoTarefa->contains['default']
        ));
        
        return $classificacaoTarefa;
    }
    
    public function query($options = null, $paginate = null) {
        
        $options['contain'] = $this->ClassificacaoTarefa->contains['default'];
        
        $optionsConditions = isset($options['conditions']) ? $options['conditions'] : array();                
        
        $data = $this->ClassificacaoTarefa->find('all', $options);
        
        if ($paginate) {
            $countPagesOpt = $options;
            unset($countPagesOpt['limit']);
            unset($countPagesOpt['page']);
            $data = array(
                'data' => $data,
                'page' => $this->servicePaginate['page'],
                'totalPages' => ceil($this->ClassificacaoTarefa->find('count', $countPagesOpt) / $this->serviceOptions['limit']) ,
            );
        }
        
        return $data;
    }
    
    public function save($data) {        

        // salva classificação tarefa       
        $dataSaved = $this->ClassificacaoTarefa->save($data);

        /*
         * Retorna a dado salvo
        */
        $classificacaoTarefa = $this->get($this->ClassificacaoTarefa->id);
        
        return $classificacaoTarefa;
    }    
    
}
