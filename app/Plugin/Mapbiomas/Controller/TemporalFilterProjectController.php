<?php
App::uses('TemporalFilterProjectService', 'Lib/Mapbiomas/Service/TemporalFilterProject');

class TemporalFilterProjectController extends MapbiomasAppController {

    public $TemporalFilterProjectService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->TemporalFilterProjectService = new TemporalFilterProjectService();
    }

    /*
     * Service API
     */
    public function service_get($id = null) {
        try {
            $responseData = null;
            if ($id) {
                $responseData = $this->TemporalFilterProjectService->get($id);
            } else {
                $responseData = $this->TemporalFilterProjectService->query($this->serviceOptions, $this->servicePaginate);
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

            $responseData = $this->TemporalFilterProjectService->save($postData);

            $this->response->body(json_encode($responseData));
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }

    public function service_clone()
    {
        try {
            $postData = json_decode($this->request->input(), true);

            $responseData = $this->TemporalFilterProjectService->cloneProject($postData);

            $this->response->body(json_encode($responseData));
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }
}
