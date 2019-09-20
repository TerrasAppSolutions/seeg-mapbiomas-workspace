<?php
App::uses('AssetSampleService', 'Lib/Mapbiomas/Service/AssetSample');

class AssetSampleController extends MapbiomasAppController {

    public $AssetSampleService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->AssetSampleService = new AssetSampleService();
    }

    /*
     * Service API
     */
    public function service_get($id = null) {
        try {
            $responseData = null;
            if ($id) {
                $responseData = $this->AssetSampleService->get($id);
            } else {
                $responseData = $this->AssetSampleService->query($this->serviceOptions, $this->servicePaginate);
            }

            $this->response->body(json_encode($responseData));
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }
}
