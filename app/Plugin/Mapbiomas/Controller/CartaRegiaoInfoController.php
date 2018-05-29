<?php
App::uses('CartaRegiaoInfoService', 'Lib/Mapbiomas/Service/CartaRegiaoInfo');

class CartaRegiaoInfoController extends MapbiomasAppController {

    public $CartaRegiaoInfoService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->CartaRegiaoInfoService = new CartaRegiaoInfoService();
    }

    /*
     * Service API
     */
    public function service_get($id = null) {
        try {
            $responseData = null;
            if ($id) {
                $responseData = $this->CartaRegiaoInfoService->get($id);
            } else {
                $responseData = $this->CartaRegiaoInfoService->query($this->serviceOptions, $this->servicePaginate);
            }

            $this->response->body(json_encode($responseData));
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }
}
