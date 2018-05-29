<?php
App::uses('DecisionTreeService', 'Lib/Mapbiomas/Service/DecisionTree');

class DecisionTreesController extends MapbiomasAppController {

    public $DecisionTreeService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->DecisionTreeService = new DecisionTreeService();
    }

    /*
     * Service API
     */
    public function service_get($id = null) {
        try {
            $responseData = null;
            if ($id) {
                $responseData = $this->DecisionTreeService->get($id);
            } else {
                $responseData = $this->DecisionTreeService->query($this->serviceOptions, $this->servicePaginate);
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

            $responseData = $this->DecisionTreeService->save($postData);

            $this->response->body(json_encode($responseData));
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    } 

    public function service_delete($id) {
        try {            

            $responseData = $this->DecisionTreeService->delete($id);

            $this->response->body(json_encode($responseData));
            
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }    
}
