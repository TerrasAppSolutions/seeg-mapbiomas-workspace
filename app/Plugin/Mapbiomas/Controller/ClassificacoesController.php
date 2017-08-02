<?php
App::uses('ClassificacaoService', 'Lib/Mapbiomas/Service/Classificacao');

class ClassificacoesController extends MapbiomasAppController {

    public $ClassificacaoService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->ClassificacaoService = new ClassificacaoService();
    }

    /*
     * Service API
     */
    public function service_get($id = null) {
        try {
            $responseData = null;
            if ($id) {
                $responseData = $this->ClassificacaoService->get($id);
            } else {
                $responseData = $this->ClassificacaoService->query($this->serviceOptions, $this->servicePaginate);
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

            $responseData = $this->ClassificacaoService->save($postData);

            $this->response->body(json_encode($responseData));
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }

    public function service_cartaregioes($biomaNome, $cartaCodigo) {
        try {
            $responseData = null;

            $responseData = $this->ClassificacaoService->getBiomaCartaRegioes($biomaNome, $cartaCodigo);

            $this->response->body(json_encode($responseData));
            return $this->response;

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }

    public function service_biomas() {
        try {
            $responseData = null;

            $responseData = $this->ClassificacaoService->getBiomas();

            $this->response->body(json_encode($responseData));
            return $this->response;
            
        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }

    public function service_colecoes() {
        try {
            $responseData = null;

            $responseData = $this->ClassificacaoService->getColecoes();

            $this->response->body(json_encode($responseData));
            return $this->response;
            
        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }

    public function service_groupcartas() {
        try {
            $responseData = null;

            $responseData = $this->ClassificacaoService->queryGroupCartas($this->serviceOptions);

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
                $responseData = null;                

                $exportData = $this->ClassificacaoService->exportCSV($this->serviceOptions);

                $downloadId = uniqid(time());                

                Cache::write($downloadId, $exportData, 'downloadCache');

                $downloadUrl = $this->request->url . "/" . $downloadId;
                
                $this->response->type('html');    

                $this->response->body($downloadUrl);

                return $this->response;

            try {
            } catch (Exception $exc) {
                $this->response->statusCode("403");
                echo $exc->getMessage();
            }
            
        } else {
            $responseData = Cache::read($id, 'downloadCache');
            $this->response->body($responseData);
            $this->response->type('csv');
            $this->response->download('params_export_'.$id.'.csv');
            return $this->response;
        }
    }
}
