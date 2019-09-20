<?php
App::uses('MosaicCartaService', 'Lib/Mapbiomas/Service/MosaicCarta');

class MosaicCartaController extends MapbiomasAppController {

    public $MosaicCartaService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->MosaicCartaService = new MosaicCartaService();
    }

    /*
     * Service API
     */
    public function service_get($id = null) {
        try {
            $responseData = null;
            if ($id) {
                $responseData = $this->MosaicCartaService->get($id);
            } else {
                $responseData = $this->MosaicCartaService->query($this->serviceOptions, $this->servicePaginate);
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

            $responseData = $this->MosaicCartaService->save($postData);

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
            $responseData = $this->MosaicCartaService->saveLot($postData);

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

            $responseData = $this->MosaicCartaService->delete($id);

            $this->response->body(json_encode($responseData));
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }
}