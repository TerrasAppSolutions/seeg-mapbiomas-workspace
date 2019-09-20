<?php
App::uses('CartaBiomaService', 'Lib/Mapbiomas/Service/CartaBioma');

class CartaBiomaController extends MapbiomasAppController {

    public $CartaBiomaService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->CartaBiomaService = new CartaBiomaService();
    }

    /*
     * Service API
     */
    public function service_get($id = null) {
        try {
            $responseData = null;
            if ($id) {
                $responseData = $this->CartaBiomaService->get($id);
            } else {
                $responseData = $this->CartaBiomaService->query($this->serviceOptions, $this->servicePaginate);
            }

            $this->response->body(json_encode($responseData));
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }
}
