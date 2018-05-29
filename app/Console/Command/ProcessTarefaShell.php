<?php

App::uses('ProcessTarefa', 'Lib/Mapbiomas/Service/ProcessTarefa');

/**
 * Classe Shell de disparos de tarefas de consolidação
 * para o servidor de processamento de tarefas
 */
class ProcessTarefaShell extends AppShell
{
   
    private $ProcessTarefa;

    /**
     * Configura cache e instancia models e componentes
     */
    public function __construct()
    {
        parent::__construct();

        $this->ProcessTarefa = new ProcessTarefa();
    }

    /**
     * Função principal de execução
     */
    public function main()
    {
        $date = date("Y-m-d H:i:s");
        echo "\n$date \n";
        echo "\nProcessing consolidation tasks...\n\n";
        $this->mosaic();
        //$this->classification();
        echo "Consolidation tasks submitted.\n\n";
    }

    /**
     * Dispara o processamento das tarefas de mosaico
     *
     * @return void
     */
    public function mosaic()
    {
         // Shell Logs styles
         $this->stdout->styles('mosaic', array(
            'text' => 'green',
        ));

        $this->out('<mosaic>Mosaic tasks...</mosaic>', 1, Shell::NORMAL);
        
        $tarefas = $this->ProcessTarefa->mosaic();

        $tarefasCount = count($tarefas);
        
        $tarefaIds = array_map(function ($tarefa) {
            return $tarefa['ClassificacaoTarefa']['id'];
        }, $tarefas);
        $tarefaIds = implode(', ',$tarefaIds);
        
        $this->out("<mosaic>Mosaic tasks submitted : [$tarefasCount] $tarefaIds.</mosaic>", 2, Shell::NORMAL);    
    }

    /**
     * Dispara o processamento das tarefas de classificação
     *
     * @return void
     */
    public function classification()
    {
        // Shell Logs styles
        $this->stdout->styles('classification', array(
            'text' => 'green',
        ));

        $this->out('<classification>Classification tasks...</classification>', 1, Shell::NORMAL);
        
        $tarefas = $this->ProcessTarefa->classification();

        $tarefasCount = count($tarefas);
        
        $tarefaIds = array_map(function ($tarefa) {
            return $tarefa['ClassificacaoTarefa']['id'];
        }, $tarefas);
        $tarefaIds = implode(', ',$tarefaIds);
        
        $this->out("<classification>Classification tasks submitted : [$tarefasCount] $tarefaIds.</classification>", 2, Shell::NORMAL);
    }   

    /**
     * Dispara o processamento das tarefas de filtro temporal
     *
     * @return void
     */
    public function temporalfilter()
    {
        $this->ProcessTarefa->temporalfilter();
    }

    /**
     * Dispara o processamento das tarefas de integrarção
     *
     * @return void
     */
    public function integration()
    {
        $this->ProcessTarefa->integration();
    }
}
