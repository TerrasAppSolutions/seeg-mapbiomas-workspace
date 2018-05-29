<?php

App::uses('ClassificacaoService', 'Lib/Dashboard/Service/Classificacao');

class ParametersController extends DashboardAppController {

    public $ClassificacaoService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('service_get');
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
            } else {
                $responseData = $this->ClassificacaoService->query($this->request->query);
            }

            $this->response->body(json_encode($responseData));
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }

}
