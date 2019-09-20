<?php
App::uses('ClasseAssetService', 'Lib/Mapbiomas/Service/ClasseAsset');

class ClasseAssetController extends MapbiomasAppController {

    public $ClasseAssetService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->ClasseAssetService = new ClasseAssetService();
    }

    /*
     * Service API
     */
    public function service_get($id = null) {
        try {
            $responseData = null;
            if ($id) {
                $responseData = $this->ClasseAssetService->get($id);
            } else {
                $responseData = $this->ClasseAssetService->query($this->serviceOptions, $this->servicePaginate);
            }

            $this->response->body(json_encode($responseData));
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }
}
