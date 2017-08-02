<?php
App::uses('ClasseAreaService', 'Lib/Mapbiomas/Service/ClasseArea');

class ClasseAreasController extends MapbiomasAppController
{

    public $ClasseAreaService;

    public function beforeFilter()
    {
        parent::beforeFilter();

        $this->ClasseAreaService = new ClasseAreaService();

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
                $responseData = $this->ClasseAreaService->get($id);
            } else {

                $this->serviceOptions['query'] = $this->request->query;

                $responseData = $this->ClasseAreaService->query($this->serviceOptions, $this->servicePaginate);
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

            $responseData = $this->ClasseAreaService->save($postData);

            $this->response->body(json_encode($responseData));
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }

    public function service_exportcsv($id = null)
    {
        if ($id == null) {
            try {
                $responseData = null;                

                $exportData = $this->ClasseAreaService->exportCSV($this->serviceOptions);

                $downloadId = uniqid(time());                

                Cache::write($downloadId, $exportData, 'downloadCache');

                $downloadUrl = $this->request->url . "/" . $downloadId;
                
                $this->response->type('html');    

                $this->response->body($downloadUrl);

                return $this->response;

            } catch (Exception $exc) {
                $this->response->statusCode("403");
                echo $exc->getMessage();
            }
        } else {
            $responseData = Cache::read($id, 'downloadCache');
            $this->response->body($responseData);
            $this->response->type('csv');
            $this->response->download('pixel_values.csv');
            return $this->response;
        }
    }

    public function service_delete($id)
    {
        try {

            $responseData = $this->ClasseAreaService->delete($id);

            $this->response->body(json_encode($responseData));
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }

}
