<?php
App::uses('EstatisticaService', 'Lib/Dashboard/Service/Estatistica');

class StatisticsController extends DashboardAppController {

    public $EstatisticaService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('service_coverage','service_transitions');
        $this->EstatisticaService = new EstatisticaService();
    }    

    /*
     * Service API
    */
    public function service_coverage() {
        try {
            $responseData = null;

            $responseData = $this->EstatisticaService->coverage($this->request->query);

            echo json_encode($responseData);
        }
        catch(Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }

    /*
     * Service API
    */
    public function service_transitions() {
        try {
            $responseData = null;
            
            $responseData = $this->EstatisticaService->transitions($this->request->query);

            echo json_encode($responseData);
        }
        catch(Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }

}
