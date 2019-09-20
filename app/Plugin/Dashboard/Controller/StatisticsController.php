<?php
App::uses('EstatisticaService', 'Lib/Dashboard/Service/Estatistica');

class StatisticsController extends DashboardAppController {

    public $EstatisticaService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('service_coverage', 'service_transitions', 'service_groupedcover', 'service_inspector', 'service_infrastructure', 'service_infra_levels', 'service_infra_buffer', 'service_infra_hierarchy', 'service_coverage_infra', 'service_groupedcover_infra');
        
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

    /*
     * Service API
    */
    public function service_inspector() {
        try {
            $responseData = null;

            $responseData = $this->EstatisticaService->inspector($this->request->query);

            $this->response->body(json_encode($responseData));
            return $this->response;

        }
        catch(Exception $exc) {
            $this->response->statusCode("403");

        }
    }

    public function service_infrastructure() {
        try {
            $responseData = null;

            $responseData = $this->EstatisticaService->infrastructure($this->request->query);

            $this->response->body(json_encode($responseData));
            return $this->response;

        }
        catch(Exception $exc) {
            $this->response->statusCode("403");
        }
    }

    public function service_infra_levels() {
        try {
            $responseData = null;

            $responseData = $this->EstatisticaService->infra_levels($this->request->query);

            $this->response->body(json_encode($responseData));
            return $this->response;

        }
        catch(Exception $exc) {
            $this->response->statusCode("403");
        }
    }

    public function service_infra_hierarchy() {
        try {
            $responseData = null;

            $responseData = $this->EstatisticaService->infra_hierarchy($this->request->query);

            $this->response->body(json_encode($responseData));
            return $this->response;

        }
        catch(Exception $exc) {
            $this->response->statusCode("403");
        }
    }

    public function service_infra_buffer() {
        try {
            $responseData = null;

            $responseData = $this->EstatisticaService->infra_buffer($this->request->query);

            $this->response->body(json_encode($responseData));
            return $this->response;

        }
        catch(Exception $exc) {
            $this->response->statusCode("403");
        }
    }

    public function service_coverage_infra() {
        try {
            $responseData = null;

            $responseData = $this->EstatisticaService->coverage_infra($this->request->query);

            $this->response->body(json_encode($responseData));
            return $this->response;

        }
        catch(Exception $exc) {
            $this->response->statusCode("403");
        }
    }

    public function service_groupedcover_infra() {
        try {
            $responseData = null;

            $responseData = $this->EstatisticaService->groupedcover_infra($this->request->query);

            $this->response->body(json_encode($responseData));
            return $this->response;

        }
        catch(Exception $exc) {
            $this->response->statusCode("403");
        }
    }
}
