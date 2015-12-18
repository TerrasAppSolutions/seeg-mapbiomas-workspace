<?php
App::uses('TerritorioService', 'Lib/Dashboard/Service/Territorio');

class TerritoriesController extends DashboardAppController {

    public $TerritorioService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('service_get');
        $this->TerritorioService = new TerritorioService();
    }

    /*
     * Service API
    */

    public function service_get() {
      try {
          $responseData = null;

          $responseData = $this->TerritorioService->findAll($this->request->query);

          echo json_encode($responseData);
      }
      catch(Exception $exc) {
          $this->response->statusCode("403");
          echo $exc->getMessage();
      }    

    }  

}
