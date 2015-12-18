<?php
App::uses('ClasseService', 'Lib/Dashboard/Service/Classe');

class ClassificationsController extends DashboardAppController {

    public $ClasseService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('service_get');
        $this->ClasseService = new ClasseService();
    }

    /*
     * Service API
    */

    public function service_get() {
      try {
          $responseData = null;

          $responseData = $this->ClasseService->findAll($this->request->query);

          echo json_encode($responseData);
      }
      catch(Exception $exc) {
          $this->response->statusCode("403");
          echo $exc->getMessage();
      }
       
    } 

}