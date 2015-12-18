<?php
App::uses('ClassificacaoService', 'Lib/Mapbiomas/Service/Classificacao');

class ClassificacoesController extends MapbiomasAppController {
    
    public $ClassificacaoService;
    
    public function beforeFilter() {      
        parent::beforeFilter();  
        $this->ClassificacaoService = new ClassificacaoService();
    }
    
    /*
     * Service API
    */
    public function service_get($id = null) {
        try {
            $responseData = null;
            if ($id) {
                $responseData = $this->ClassificacaoService->get($id);
            } 
            else {
                $responseData = $this->ClassificacaoService->query($this->serviceOptions, $this->servicePaginate);
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
            
            $responseData = $this->ClassificacaoService->cadastrar($postData);
            
            echo json_encode($responseData);
        }
        catch(Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }   
    
}
