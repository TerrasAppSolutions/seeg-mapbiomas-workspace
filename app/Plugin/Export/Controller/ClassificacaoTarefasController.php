<?php
App::uses('ExportacaoTarefaService', 'Lib/Mapbiomas/Service/ExportacaoTarefa');

class ClassificacaoTarefasController extends ExportAppController {

    public $ExportacaoTarefaService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('service_get', 'service_post','service_stats_save', 'service_isalive','isalive');
        $this->ExportacaoTarefaService = new ExportacaoTarefaService();
    }

    /*
     * Service API
     */
    public function service_get($id = null) {
        try {
            $responseData = null;
            if ($id) {
                $responseData = $this->ExportacaoTarefaService->get($id);
            } else {

                $this->serviceOptions['query'] = $this->request->query;

                $responseData = $this->ExportacaoTarefaService->query($this->serviceOptions, $this->servicePaginate);
            }
            echo json_encode($responseData);
        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }

    public function service_post() {
        try {
            $postData = json_decode($this->request->input(), true);

            $responseData = $this->ExportacaoTarefaService->save($postData);

            echo json_encode($responseData);
        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }

    public function service_stats_save() {
        try {

            $postData = json_decode($this->request->input(), true);

            $responseData = $this->ExportacaoTarefaService->statsSave($postData);            

            echo json_encode($responseData);

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }       
    }  

    # remover
    public function service_isalive() {
        try {

            $postData = json_decode($this->request->input(), true);

            if(!empty($postData)){
                $responseData = $this->ExportacaoTarefaService->isalive($postData);
            }else{
                $responseData = $this->ExportacaoTarefaService->isaliveRead();
            }

            echo json_encode($responseData);

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }       
    }  
    
    # remover
    public function isalive() {

        $this->layout = "html";

        $responseData = $this->ExportacaoTarefaService->isaliveRead();

        $this->set('data',$responseData);
        
    }  

    public function service_jsonft($id = null) {
        ini_set('memory_limit', '1G');
        try {
            $responseData = null;
            if ($id) {
                $responseData = $this->ExportacaoTarefaService->get($id);
            } else {
        
                $this->serviceOptions['query'] = $this->request->query;

                $responseData = $this->ExportacaoTarefaService->query($this->serviceOptions, $this->servicePaginate);

                $groupcarta = [];            

                foreach ($responseData as $key => &$value) {
                    $value = [    
                        "carta" => $value['Classificacao']['Carta']['codigo'], 
                        "region" =>  "0", 
                        "processed" => false, 
                        "bioma" => $value['Classificacao']['Bioma']['nome']
                    ];
                    $groupcarta[$value['carta']] = $value;
                }

                $responseData = [];

                foreach ($groupcarta as $key => $value) {
                   $responseData[] = $value;                    
                }
            }
            echo json_encode($responseData);
        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }
}
