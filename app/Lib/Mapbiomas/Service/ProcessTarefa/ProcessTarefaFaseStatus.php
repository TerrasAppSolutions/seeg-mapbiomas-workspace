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
        try {
            // Recupera tarefa que sera atualizada
            $this->ClassificacaoTarefa->recursive = -1;
            $tarefa = $this->ClassificacaoTarefa->read(null, $data['task_id']);

            // salva dados da tarefa
            $tarefa['ClassificacaoTarefa']['status'] = isset($data['status_id']) ? $data['status_id'] : null;
            $tarefa['ClassificacaoTarefa']['geetask'] = isset($data['geetask_status']) ? $data['geetask_status'] : null;
            $tarefa['ClassificacaoTarefa']['gee_start'] = isset($data['gee_start']) ? $data['gee_start'] : null;
            $tarefa['ClassificacaoTarefa']['gee_end'] = isset($data['gee_end']) ? $data['gee_end'] : null;
            $tarefa['ClassificacaoTarefa']['completed'] = isset($data['completed']) ? $data['completed'] : null;
            $tarefa['ClassificacaoTarefa']['log'] = isset($data['log']) ? $data['log'] : null;
            $tarefa['ClassificacaoTarefa']['ativo'] = isset($data['ativo']) ? $data['ativo'] : null;
            $tarefa['ClassificacaoTarefa']['tarefa_id'] = isset($data['tarefa_id']) ? $data['tarefa_id'] : null;
            
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
        } catch (Exception $exc) {
            echo $exc;
            $tarefa = null;
        }

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
