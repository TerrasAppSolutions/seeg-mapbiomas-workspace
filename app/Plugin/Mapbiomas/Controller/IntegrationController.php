<?php
App::uses('IntegrationService', 'Lib/Mapbiomas/Service/Integration');

class IntegrationController extends MapbiomasAppController {

    public $IntegrationService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->IntegrationService = new IntegrationService();
    }

    /*
     * Service API
     */
    public function service_get($id = null) {
        try {
            $responseData = null;
            if ($id) {
                $responseData = $this->IntegrationService->get($id);
            } else {
                $responseData = $this->IntegrationService->query($this->serviceOptions, $this->servicePaginate);
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

            $responseData = $this->IntegrationService->save($postData);

            $this->response->body(json_encode($responseData));
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }

    public function service_save_lot()
    {
        try {
            $postData = json_decode($this->request->input(), true);
            $responseData = $this->IntegrationService->saveLot($postData);

            $this->response->body(json_encode($responseData));
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }
}
