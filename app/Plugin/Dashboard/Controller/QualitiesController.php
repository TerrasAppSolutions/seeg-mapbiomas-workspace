<?php
App::uses('QualidadeService', 'Lib/Dashboard/Service/Qualidade');

class QualitiesController extends DashboardAppController {

    public $QualidadeService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('service_get');
        $this->QualidadeService = new QualidadeService();
    }

    /*
     * Service API
    */

    public function service_get() {      
      try {
          $responseData = null;

          $responseData = $this->QualidadeService->query($this->request->query);

          $this->response->body(json_encode($responseData));
          return $this->response;
            
      }
      catch(Exception $exc) {
          $this->response->statusCode("403");
          
      }    

    }  

}
