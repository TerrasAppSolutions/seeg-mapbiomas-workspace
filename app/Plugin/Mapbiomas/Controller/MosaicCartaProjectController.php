<?php
App::uses('MosaicCartaProjectService', 'Lib/Mapbiomas/Service/MosaicCartaProject');

class MosaicCartaProjectController extends MapbiomasAppController {

    public $MosaicCartaProjectService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->MosaicCartaProjectService = new MosaicCartaProjectService();
    }

    /*
     * Service API
     */
    public function service_get($id = null) {
        try {
            $responseData = null;
            if ($id) {
                $responseData = $this->MosaicCartaProjectService->get($id);
            } else {
                $responseData = $this->MosaicCartaProjectService->query($this->serviceOptions, $this->servicePaginate);
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

            $responseData = $this->MosaicCartaProjectService->save($postData);

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

            $responseData = $this->MosaicCartaProjectService->delete($id);

            $this->response->body(json_encode($responseData));
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }
}