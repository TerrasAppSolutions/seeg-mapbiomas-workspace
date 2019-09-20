<?php
App::uses('TerritorioService', 'Lib/Dashboard/Service/Territorio');
App::uses('TerritorioServiceChaco', 'Lib/Dashboard/Service/Territorio');
App::uses('TerritorioServiceRaisg', 'Lib/Dashboard/Service/Territorio');

class TerritoriesController extends DashboardAppController
{

    public $TerritorioService;

    public function beforeFilter()
    {
        parent::beforeFilter();

        $this->Auth->allow('service_get');

        $appConfig = Configure::read('CONFIG');

        $this->ApiService = $appConfig['API_SERVICE'];

        if ($this->ApiService === 'Chaco') {

            $this->TerritorioService = new TerritorioServiceChaco();

        } else if ($this->ApiService === 'Raisg') {
            
            $this->TerritorioService = new TerritorioServiceRaisg();

        } else {
            
            $this->TerritorioService = new TerritorioService();
        }

    }

    /*
     * Service API
     */

    public function service_get()
    {
        try {

            $responseData = null;

            $responseData = $this->TerritorioService->findAll($this->request->query);

            $this->response->body(json_encode($responseData));

            return $this->response;
        } catch (Exception $exc) {
            $this->response->statusCode("403");

        }

    }

}
