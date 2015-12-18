<?php
App::uses('ClassificacaoTarefaService', 'Lib/Mapbiomas/Service/ClassificacaoTarefa');

class ClassificacaoTarefasController extends ExportAppController{
    
    public $ClassificacaoTarefaService;
    
    public function beforeFilter() {
        parent::beforeFilter();     
        $this->ClassificacaoTarefaService = new ClassificacaoTarefaService();
    }
    
    /*
     * Service API
    */
    public function service_get($id = null) {
        try {
            $responseData = null;
            if ($id) {
                $responseData = $this->ClassificacaoTarefaService->get($id);
            } 
            else {
                $responseData = $this->ClassificacaoTarefaService->query($this->serviceOptions, $this->servicePaginate);
            }
            echo json_encode($responseData);
        }
        catch(Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }
    
    public function service_post() {
        try {
            $postData = json_decode($this->request->input() , true);
            
            $responseData = $this->ClassificacaoTarefaService->save($postData);
            
            echo json_encode($responseData);
        }
        catch(Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }   
    
}
