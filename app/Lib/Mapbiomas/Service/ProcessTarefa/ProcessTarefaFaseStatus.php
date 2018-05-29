<?php
App::uses('ClassificacaoTarefa', 'Model');
App::uses('ProcessTarefaHttp', 'Lib/Mapbiomas/Service/ProcessTarefa');

/**
 * Classe de atualizacao de fase e status tarefas de processamento do fluxo
 * de consolidação (mosaico, classificação, filtro temporal e integração)
 */
class ProcessTarefaFaseStatus
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

    public function __construct()
    {
        $this->ClassificacaoTarefa = new ClassificacaoTarefa();
    }

   /**
     * Atualiza status da tarefa e dispara novas fases processamento
     *
     * @return void
     */
    public function updateFaseStatus($data)
    {

        // Recupera tarefa que sera atualizada
        $this->ClassificacaoTarefa->recursive = -1;
        $tarefa = $this->ClassificacaoTarefa->read(null, $data['task_id']);

        // salva dados da tarefa
        $tarefa['ClassificacaoTarefa']['status'] = $data['status_id'];
        $tarefa['ClassificacaoTarefa']['geetask'] = $data['geetask_status'];        
        
        $tarefa['ClassificacaoTarefa']['modified'] = null;

        $this->ClassificacaoTarefa->save($tarefa);

        $tarefaFase = $tarefa['ClassificacaoTarefa']['fase'];
        $tarefaStatus = $tarefa['ClassificacaoTarefa']['status'];

        // Cria proxima tarefa da fase seguinte
        $proximaTarefa = $tarefa;
        $proximaTarefa['ClassificacaoTarefa']['id'] = null;
        $proximaTarefa['ClassificacaoTarefa']['status'] = 0;
        unset($proximaTarefa['ClassificacaoTarefa']['created']);
        unset($proximaTarefa['ClassificacaoTarefa']['modified']);        

        // Mosaic Completed
        if ($tarefaFase == 0 && $tarefaStatus == 2) {
            $proximaTarefa['ClassificacaoTarefa']['fase'] = 1;
        }
        // Classification Completed
        if ($tarefaFase == 1 && $tarefaStatus == 2) {
            $proximaTarefa['ClassificacaoTarefa']['fase'] = 2;
        }
        // Temporal Filter Completed
        if ($tarefaFase == 2 && $tarefaStatus == 2) {
            $proximaTarefa['ClassificacaoTarefa']['fase'] = 3;
        }
        // Integration Completed
        if ($tarefaFase == 3 && $tarefaStatus == 2) {
            // estatistica ?
        }
        
        $this->ClassificacaoTarefa->create();
        $this->ClassificacaoTarefa->save($proximaTarefa);

        return $tarefa;
    }

    /**
     * Atualiza tarefa para status "processando"
     *
     * @return void
     */
    public function updateToProcessing($tarefa)
    {
        $this->ClassificacaoTarefa->create();
        $tarefa['ClassificacaoTarefa']['status'] = 1;
        $tarefa['ClassificacaoTarefa']['modified'] = null;        
        $this->ClassificacaoTarefa->save($tarefa);
    }
}
