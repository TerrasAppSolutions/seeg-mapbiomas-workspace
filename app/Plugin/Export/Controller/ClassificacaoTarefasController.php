<?php
App::uses('ExportacaoTarefaService', 'Lib/Mapbiomas/Service/ExportacaoTarefa');
App::uses('ProcessTarefaFaseStatus', 'Lib/Mapbiomas/Service/ProcessTarefa');

class ClassificacaoTarefasController extends ExportAppController
{

    public $ExportacaoTarefaService;

    public function beforeFilter()
    {
        parent::beforeFilter();
        $this->Auth->allow('service_get', 'service_post', 'service_update_status', 'service_jsonft', 'service_process_tarefa');
        $this->ExportacaoTarefaService = new ExportacaoTarefaService();
    }

    /*
     * Service API
     */
    public function service_get($id = null)
    {
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

    public function service_post()
    {
        try {
            $postData = json_decode($this->request->input(), true);

            $responseData = $this->ExportacaoTarefaService->save($postData);

            echo json_encode($responseData);
        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }

    public function service_update_status()
    {

        $ProcessTarefaFaseStatus = new ProcessTarefaFaseStatus();

        try {

            $postData = json_decode($this->request->input(), true);

            $responseData = $ProcessTarefaFaseStatus->updateFaseStatus($postData);

            echo json_encode($responseData);

        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }
    

    public function service_jsonft($id = null)
    {
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

    public function service_process_tarefa()
    {
        App::uses('ProcessTarefa', 'Lib/Mapbiomas/Service/ProcessTarefa');

        $ProcessTarefa = new ProcessTarefa();

        $tarefas = $ProcessTarefa->classification();
        
        $tarefaIds = array_map(function ($tarefa) {
            return $tarefa['ClassificacaoTarefa']['id'];
        }, $tarefas);

        echo json_encode($tarefas);
    }
}
