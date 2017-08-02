<?php
App::uses('EstatisticaService', 'Lib/Dashboard/Service/Estatistica');

class TransitionsController extends StatisticsAppController {

    public $EstatisticaService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('service_coverage','service_transitions');
        $this->EstatisticaService = new EstatisticaService();
    }    

    /*
     * Service API
    */   
     public function service_post() {        
        try {
            $postData = json_decode($this->request->input(), true);

            $responseData = $this->EstatisticaService->saveTransition($postData);

            echo json_encode($responseData);
        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }

}
