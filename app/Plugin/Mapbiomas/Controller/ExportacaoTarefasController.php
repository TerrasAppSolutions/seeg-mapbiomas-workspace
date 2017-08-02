<?php
App::uses('ExportacaoTarefaService', 'Lib/Mapbiomas/Service/ExportacaoTarefa');

class ExportacaoTarefasController extends MapbiomasAppController {

    public $ExportacaoTarefaService;

    public function beforeFilter() {
        parent::beforeFilter(); 

        // $this->Auth->allow(array(
        //     'service_post'            
        // ));

        $this->ExportacaoTarefaService = new ExportacaoTarefaService();
    }

    /*
     * Service API
     */
    public function service_get($id = null) {
        try {
            $responseData = null;
            if ($id) {
                $responseData = $this->ExportacaoTarefaService->get($id);
            } else {

                $this->serviceOptions['query'] = $this->request->query;

                $responseData = $this->ExportacaoTarefaService->query($this->serviceOptions, $this->servicePaginate);
            }
            $this->response->body(json_encode($responseData));
            return $this->response;
            
        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }

    public function service_post() {
        try {
            $postData = json_decode($this->request->input(), true);

            $responseData = $this->ExportacaoTarefaService->save($postData);

            $this->response->body(json_encode($responseData));
            return $this->response;
            
        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }  

    public function service_groupcartas() {
        try {
            $responseData = null;

            $responseData = $this->ExportacaoTarefaService->queryGroupCartas($this->serviceOptions);

            $this->response->body(json_encode($responseData));
            return $this->response;
            
        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }  
}
