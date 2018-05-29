<?php
App::uses('AmostraService', 'Lib/Mapbiomas/Service/Amostra');

class AmostrasController extends MapbiomasAppController
{

    public $AmostraService;

    public function beforeFilter()
    {
        parent::beforeFilter();

        $this->AmostraService = new AmostraService();

        $this->Auth->allow('service_get', 'service_post');
    }

    /*
     * Service API
     */
    public function service_get($id = null)
    {
        try {
            $responseData = null;
            if ($id) {
                $responseData = $this->AmostraService->get($id);
            } else {

                $this->serviceOptions['query'] = $this->request->query;

                $responseData = $this->AmostraService->query($this->serviceOptions, $this->servicePaginate);
            }

            $this->response->body(json_encode($responseData));
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }

    public function service_post()
    {
        try {
            $postData = json_decode($this->request->input(), true);

            $responseData = $this->AmostraService->save($postData);

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

            $responseData = $this->AmostraService->delete($id);

            $this->response->body(json_encode($responseData));
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }

}
