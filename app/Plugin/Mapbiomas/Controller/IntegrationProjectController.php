<?php
App::uses('IntegrationProjectService', 'Lib/Mapbiomas/Service/IntegrationProject');

class IntegrationProjectController extends MapbiomasAppController {

    public $IntegrationProjectService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->IntegrationProjectService = new IntegrationProjectService();
    }

    /*
     * Service API
     */
    public function service_get($id = null) {
        try {
            $responseData = null;
            if ($id) {
                $responseData = $this->IntegrationProjectService->get($id);
            } else {
                $responseData = $this->IntegrationProjectService->query($this->serviceOptions, $this->servicePaginate);
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

            $responseData = $this->IntegrationProjectService->save($postData);

            $this->response->body(json_encode($responseData));
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }

    public function service_activate()
    {
        try {
            $postData = json_decode($this->request->input(), true);

            $responseData = $this->IntegrationProjectService->activateProject($postData);

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

            $responseData = $this->IntegrationProjectService->delete($id);

            $this->response->body(json_encode($responseData));
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }
}
