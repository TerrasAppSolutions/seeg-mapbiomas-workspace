<?php
App::uses('EstatisticaService', 'Lib/Dashboard/Service/Estatistica');

class StatisticsController extends DashboardAppController {

    public $EstatisticaService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('service_coverage','service_transitions','service_groupedcover');
        $this->EstatisticaService = new EstatisticaService();
    }    

    /*
     * Service API
    */
    public function service_coverage() {
        try {
            $responseData = null;

            $responseData = $this->EstatisticaService->coverage($this->request->query);

            $this->response->body(json_encode($responseData));
            return $this->response;
            
        }
        catch(Exception $exc) {
            $this->response->statusCode("403");
            
        }
    }

    public function service_groupedcover() {
        try {
            $responseData = null;

            $responseData = $this->EstatisticaService->groupedcover($this->request->query);

            $this->response->body(json_encode($responseData));
            return $this->response;
            
        }
        catch(Exception $exc) {
            $this->response->statusCode("403");
            
        }
    }

    /*
     * Service API
    */
    public function service_transitions() {
        try {
            $responseData = null;
            
            $responseData = $this->EstatisticaService->transitions($this->request->query);

            $this->response->body(json_encode($responseData));
            return $this->response;
            
        }
        catch(Exception $exc) {
            $this->response->statusCode("403");
            
        }
    }

}
