<?php
App::uses('ClassesService', 'Lib/Mapbiomas/Service/Classes');

class ClassesController extends MapbiomasAppController {

    public $ClassesService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->ClassesService = new ClassesService();
    }

    /*
     * Service API
     */
    public function service_get($id = null) {
        try {
            $responseData = null;
            if ($id) {
                $responseData = $this->ClassesService->get($id);
            } else {
                $responseData = $this->ClassesService->query($this->serviceOptions, $this->servicePaginate);
            }

            $this->response->body(json_encode($responseData));
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }
}
