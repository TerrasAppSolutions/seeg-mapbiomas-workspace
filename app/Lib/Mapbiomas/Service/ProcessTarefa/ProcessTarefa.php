<?php
App::uses('ClassificacaoTarefa', 'Model');
App::uses('ProcessTarefaHttp', 'Lib/Mapbiomas/Service/ProcessTarefa');
App::uses('ProcessTarefaFaseStatus', 'Lib/Mapbiomas/Service/ProcessTarefa');

/**
 * Classe de listagem e envio de tarefas prontas para processamento do fluxo
 * de consolidação (mosaico, classificação, filtro temporal e integração)
 */
class ProcessTarefa
{

    /**
     * Model de ClassificacaoTarefa
     * @var Cake.Model
     */
    public $ClassificacaoTarefa;

    /**
     * Clinte da api de processamento de tarefas
     *
     * @var ProcessTarefaHttp
     */
    public $ProcessTarefaHttp;

    /**
     * Classe de atualizacao de fase e status tarefas de processamento do fluxo
     * de consolidação
     *
     * @var ProcessTarefaFaseStatus
     */
    public $ProcessTarefaFaseStatus;


    public function __construct()
    {
        $this->ClassificacaoTarefa = new ClassificacaoTarefa();
        $this->ProcessTarefaHttp = new ProcessTarefaHttp();
        $this->ProcessTarefaFaseStatus = new ProcessTarefaFaseStatus();
    }
    

    /**
     * Lista e envia as tarefas de mosaicos prontas para processamento
     *
     * @return void
     */
    public function mosaic()
    {
        // lista tarefas de mosaico com status "aguardando processamento"
        $tarefas = $this->listFaseAwaiting(0, 10);

        foreach ($tarefas as $key => $tarefa) {
            // envia tarefa para processamento
            $response = $this->ProcessTarefaHttp->mosaic($tarefa);

            if ($response && $response->code == 200) {
                // se envio de para processamento ocorreu com sucesso
                // atualiza tarefa para status "processando"
                $this->ProcessTarefaFaseStatus->updateToProcessing($tarefa);
            } else {
                // se envio de para processamento ocorreu com erro
                // remove tarefa da lista de tarefas enviadas
                unset($tarefas[$key]);
                $tarefaId = $tarefa['ClassificacaoTarefa']['id'];
                echo "tarefa $tarefaId nao enviada. \n";
            }

            sleep(1);
        }

        return $tarefas;
    }

    /**
     * Lista e envia para processamento as tarefas de classificação
     *
     * @return array lista de tarefas enviadas para processamento
     */
    public function classification()
    {
        // lista tarefas de classificação com status "aguardando processamento"
        $tarefas = $this->listFaseAwaiting(1, 10);

        foreach ($tarefas as $key => $tarefa) {
            // envia tarefa para processamento
            $response = $this->ProcessTarefaHttp->classification($tarefa);

            if ($response && $response->code == 200) {
                // se envio de para processamento ocorreu com sucesso
                // atualiza tarefa para status "processando"
                $this->ProcessTarefaFaseStatus->updateToProcessing($tarefa);
            } else {
                // se envio de para processamento ocorreu com erro
                // remove tarefa da lista de tarefas enviadas
                unset($tarefas[$key]);
            }

            sleep(1);
        }

        return $tarefas;
    }
    

    /**
     * Lista tarefas de status 0 (aguardando processamento) por fase de consoli
     *
     * @param int $fase fase de processamento da consolidação
     * @param int $limit quantidade de tarefas a ser listada
     * @return array lista de taretas
     */
    private function listFaseAwaiting($fase, $limit = null)
    {

        $tarefas = [];

        if ($limit == null) {
            $limit = 10;
        }
        
        $tarefasAwaiting = $this->ClassificacaoTarefa->find('count', array(
            'conditions' => array(
                'ClassificacaoTarefa.fase' => $fase,
                'ClassificacaoTarefa.status' => 1,
                'ClassificacaoTarefa.ativo' => true,
            )
        ));

        
        $limit = $limit - $tarefasAwaiting;

        $limit = ($limit < 0) ? 0:$limit;
          
        if ($limit > 0) {
            $tarefas = $this->ClassificacaoTarefa->find('all', array(
                'conditions' => array(
                    'ClassificacaoTarefa.fase' => $fase,
                    'ClassificacaoTarefa.status' => 0,
                    'ClassificacaoTarefa.ativo' => true,
                ),
                'order' => array(
                    'ClassificacaoTarefa.created DESC'
                ),
                'limit' => $limit,
                'contain' => $this->ClassificacaoTarefa->contains['tarefaProcess'],
            ));
        }

        return $tarefas;
    }
}
