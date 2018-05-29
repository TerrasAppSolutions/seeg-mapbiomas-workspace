<?php
App::uses('TemporalFilterService', 'Lib/Mapbiomas/Service/TemporalFilter');

class TemporalFilterController extends MapbiomasAppController {

    public $TemporalFilterService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->TemporalFilterService = new TemporalFilterService();
    }

    /*
     * Service API
     */
    public function service_get($id = null) {
        try {
            $responseData = null;
            if ($id) {
                $responseData = $this->TemporalFilterService->get($id);
            } else {
                $responseData = $this->TemporalFilterService->query($this->serviceOptions, $this->servicePaginate);
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

            $responseData = $this->TemporalFilterService->save($postData);

            $this->response->body(json_encode($responseData));
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }

    public function service_delete($id)
    {
        try {

            $responseData = $this->TemporalFilter->delete($id);

            $this->response->body(json_encode($responseData));
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }
}
