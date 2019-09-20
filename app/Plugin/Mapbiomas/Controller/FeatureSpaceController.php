<?php
App::uses('FeatureSpaceService', 'Lib/Mapbiomas/Service/FeatureSpace');

class FeatureSpaceController extends MapbiomasAppController {

    public $FeatureSpaceService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->FeatureSpaceService = new FeatureSpaceService();
    }

    /*
     * Service API
     */
    public function service_get($id = null) {
        try {
            $responseData = null;
            if ($id) {
                $responseData = $this->FeatureSpaceService->get($id);
            } else {
                $responseData = $this->FeatureSpaceService->query($this->serviceOptions, $this->servicePaginate);
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

            $responseData = $this->FeatureSpaceService->save($postData);

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

            $responseData = $this->FeatureSpace->delete($id);

            $this->response->body(json_encode($responseData));
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }
}
