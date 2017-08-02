<?php
App::uses('HttpSocket', 'Network/Http');
App::uses('DecicionTreeParameter', 'Lib/Mapbiomas/Service/Classificacao');
App::uses('ExportacaoTarefaService', 'Lib/Mapbiomas/Service/ExportacaoTarefa');

/**
 * Classe de envios de tarefas de consolidação para o servidor de imgens
 */
class ImgServerConsolidateShell extends AppShell
{

    /**
     * ExportacaoTarefaService Model
     * @var App.Lib.Mapbiomas.Service.ClassificacaoTarefa.ExportacaoTarefaService
     */
    private $ExportacaoTarefaService;

    /**
     * Componente responsável por enviar requisições para o servidor de imagens
     * @var Cake.Network.Http
     */
    private $HttpSocket;

    /**
     * Configurações do sistema
     * @var Array
     */
    private $CONFIG;

    /**
     * Configura cache e instancia models e componentes
     */
    public function __construct()
    {
        parent::__construct();

        // configurações de cache necessarios para evitar conflitos
        // com o sistema web
        Cache::config('_cake_model_', array(
            'engine'    => 'File',
            'prefix'    => 'shell' . 'cake_model_',
            'path'      => CACHE . 'models' . DS,
            'serialize' => true,
            'duration'  => '+999 days',
        ));

        $this->CONFIG = Configure::read('CONFIG');

        // Instancia
        $this->ExportacaoTarefaService = new ExportacaoTarefaService();

        $this->HttpSocket = new HttpSocket();

    }

    /**
     * Função principal de execução
     */
    public function main($taskId = null)
    {
        $tasks = $this->getConsolidateTasks($taskId);
        foreach ($tasks as $key => &$task) {
            $this->sendTaskToImgServer($task);
        }
    }

    /**
     * Recupera lista de tarefas de consolidação fase 1 e status 0
     * @param Integer  id da tarefa de consolidação, caso informado, retorna uma lista com um elemento único
     * @return Array Lista tarefas de consolidação
     */
    private function getConsolidateTasks($taskId = null)
    {

        $option = array(
            'conditions' => array(
                'ClassificacaoTarefa.fase'   => '1',
                'ClassificacaoTarefa.status' => '0'                
            ),
            'order'      => array(
                'ClassificacaoTarefa.id ASC',
                'Classificacao.year DESC',
            ),
            'limit'      => '10',
        );

        if ($taskId) {
            $option['conditions'] = ['ClassificacaoTarefa.id' => $taskId];
        }

        $tasks = $this->ExportacaoTarefaService->query($option);        

        return $tasks;
    }

    /**
     * Envia tarefas para o servidor de processamento de imagem
     */
    private function sendTaskToImgServer($task)
    {        

        $exportChartApiUrl = $this->CONFIG['IMGSERVER']['host'] . '/api/export_chart';
        //$exportChartApiUrl = $this->CONFIG['IMGSERVER']['host'] . '/api/consolidate_chart';

        $dtreeParam = new DecicionTreeParameter();

        $classification = array('Classificacao' => $task['Classificacao']);

        $decisionTree = array('DecisionTree' => $task['Classificacao']['DecisionTree']);

        $task['Classificacao']['DecisionTree']['dtree'] = $dtreeParam->buildDtreeParam($classification, $decisionTree);

        $result = $this->HttpSocket->post($exportChartApiUrl, json_encode($task));

        echo $task['ClassificacaoTarefa']['id'] . " tarefa enviada \n";
    }

}
