<?php

App::uses('Classificacao', 'Model');
App::uses('ClassificacaoTarefa', 'Model');

class ExportTasksShell extends AppShell {

    private $Classificacao;
    private $ClassificacaoTarefa;

    public function __construct() {
        parent::__construct();

        //proc_nice(20);
        ini_set('memory_limit', '1G');

        // configurações de cache necessarios para evitar conflitos
        // com o sistema web
        Cache::config('_cake_model_', array(
            'engine'    => 'File',
            'prefix'    => 'shell' . 'cake_model_',
            'path'      => CACHE . 'models' . DS,
            'serialize' => true,
            'duration'  => '+999 days',
        ));

        $this->Classificacao       = new Classificacao();
        $this->ClassificacaoTarefa = new ClassificacaoTarefa();
    }

    public function main() {

    }

    public function finalparams() {

        // arguments

        $argLimit = isset($this->args[0]) ? $this->args[0] : 1;
        $argPage  = isset($this->args[1]) ? $this->args[0] : null;

        $conditions = array(
            'Classificacao.versao_final' => 'TRUE',
        );

        $tasksTotal = $this->Classificacao->find('count', array(
            'conditions' => $conditions,
        ));

        $pagesTotal = ceil($tasksTotal / $argLimit);

        $this->importacaoLog("Total de tarefas: $tasksTotal", "info");

        if ($argPage == null) {
            $page = 1;
            while ($page <= $pagesTotal) {
                $this->importacaoLog("parte $page de $pagesTotal", "info");
                $this->finalparamsPagination($page, $argLimit, $conditions);
                $page++;
            }
        } else {
            $this->finalparamsPagination($argPage, $argLimit, $conditions);
        }

    }

    private function finalparamsPagination($page, $argLimit, $conditions) {

        $classificacoes = $this->Classificacao->find('all', array(
            'conditions' => $conditions,
            'order'      => array(
                'Classificacao.bioma_id ASC',
                'Classificacao.year DESC',
                'Classificacao.id ASC',
            ),
            'limit'      => $argLimit,
            'page'       => $page,
        ));

        foreach ($classificacoes as $classificacao) {
            $classificacaoParamsId    = $classificacao['Classificacao']['id'];
            $classificacaoVersaoFinal = $classificacao['Classificacao']['versao_final'];
            $classificacaoCarta       = $classificacao['Carta']['codigo'];
            $classificacaoYear        = $classificacao['Classificacao']['year'];

            $this->importacaoLog("Tarefa de exportação >> id: $classificacaoParamsId | carta: $classificacaoCarta | ano: $classificacaoYear", "info");

            $classificacaoTarefa = array(
                'ClassificacaoTarefa' => array(
                    'classificacao_id' => $classificacao['Classificacao']['id'],
                    'fase'             => '1',
                    'status'           => '0',
                ),
            );
            $this->ClassificacaoTarefa->create();
            $this->ClassificacaoTarefa->save($classificacaoTarefa);
        }
    }

    public function finalparams2() {

        // arguments
        $argLimit = isset($this->args[0]) ? $this->args[0] : 1;
        $argPage  = isset($this->args[1]) ? $this->args[0] : null;

        $conditions = array(
            'Classificacao.versao_final' => 'TRUE',
            'Classificacao.bioma_id'     => ['2','3','4','5','6'],
        );

        /*
        $conditions2 = array(
        'Classificacao.versao_final' => 'FALSE',
        'Classificacao.bioma_id'     => '1',
        'Carta.codigo'               => ["SA-19-X-C", "SA-19-X-A", "NA-19-Z-D", "NA-19-Z-B", "NA-19-Z-C", "NA-19-Z-A", "NA-19-X-D", "NA-19-X-C", "SA-22-V-B", "SA-22-V-A", "NA-22-Y-B", "NA-22-Y-A", "NA-22-V-D", "NA-22-V-B", "NA-22-V-C", "NB-22-Y-D", "NB-21-Y-A", "NA-20-V-D", "NA-20-V-B", "SA-23-X-C", "SA-23-V-D", "SA-23-V-B", "SA-23-V-C", "SA-22-X-B", "SA-22-X-A", "SA-21-Z-C", "SA-21-Z-A", "SA-21-Y-D", "SA-21-Y-B", "SA-21-Y-C", "SA-21-V-A", "NA-21-Z-C", "NA-21-Y-D", "NA-21-Y-B", "NA-21-Y-C", "NA-21-Y-A", "SB-19-X-B", "SA-20-Y-C", "SA-20-Y-A", "SA-19-Z-B", "SA-19-Z-C", "SA-19-Z-A", "SA-19-X-D", "SA-19-X-B", "NA-20-Y-C", "NA-20-Y-A", "NA-20-V-A", "NB-20-Y-C", "SB-19-V-D", "SA-19-Y-B", "SA-19-V-D", "SA-19-V-B", "NA-19-Y-D", "NA-19-Y-B", "SB-22-V-A", "SA-22-Y-D", "SA-22-Y-B", "SA-22-Y-C", "SA-22-Y-A", "SA-22-V-D", "SA-21-X-B", "NA-22-Y-D", "NA-22-Y-C", "NA-21-Z-B", "NA-21-X-D", "NA-21-X-C", "NA-21-V-D", "NA-21-V-C", "NA-21-V-A", "NB-21-Y-C", "SB-20-Z-A", "SB-20-X-C", "SB-20-Y-B", "SB-20-V-D", "SA-20-Z-C", "SA-20-Z-A", "SA-20-X-B", "SA-20-X-C", "SA-20-X-A", "SA-20-V-D", "NA-20-Z-C", "NA-20-X-C", "NA-20-Y-B", "NB-20-Z-B", "NB-20-Z-C", "NB-20-Y-D", "SB-23-V-B", "SA-23-Z-C", "SA-23-Z-A", "SA-23-Y-D", "SA-23-Y-B", "SA-23-Y-C", "SA-23-Y-A", "SA-23-V-A", "SA-22-Z-C", "SA-22-Z-A", "SA-22-X-D", "SA-22-X-C", "NA-22-Z-C", "NA-22-Z-A", "NA-22-X-C"],
        );
         */

        $tasksTotal = $this->Classificacao->find('count', array(
            'conditions' => $conditions,
        ));

        //var_dump($tasksTotal);die;

        $pagesTotal = ceil($tasksTotal / $argLimit);

        $this->importacaoLog("Total de tarefas: $tasksTotal", "info");

        if ($argPage == null) {
            $page = 1;
            while ($page <= $pagesTotal) {
                $this->importacaoLog("parte $page de $pagesTotal", "info");
                $this->finalparamsPagination2($page, $argLimit, $conditions);
                $page++;
            }
        } else {
            $this->finalparamsPagination2($argPage, $argLimit, $conditions);
        }

    }

    private function finalparamsPagination2($page, $argLimit, $conditions) {

        $classificacoes = $this->Classificacao->find('all', array(
            'conditions' => $conditions,
            'order'      => array(
                'Classificacao.bioma_id ASC',
                'Classificacao.year DESC',
                'Classificacao.id ASC',
            ),
            'limit'      => $argLimit,
            'page'       => $page,
        ));

        $count = 0;

        foreach ($classificacoes as $classificacao) {
            $classificacaoParamsId    = $classificacao['Classificacao']['id'];
            $classificacaoVersaoFinal = $classificacao['Classificacao']['versao_final'];
            $classificacaoCarta       = $classificacao['Carta']['codigo'];
            $classificacaoYear        = $classificacao['Classificacao']['year'];

            $classificacaoTarefa1 = array(
                'ClassificacaoTarefa' => array(
                    'classificacao_id' => $classificacao['Classificacao']['id'],
                    'fase'             => '1',
                    'status'           => '2',
                    'created'          => '2016-03-01',
                ),
            );

            $classificacaoTarefa2 = array(
                'ClassificacaoTarefa' => array(
                    'classificacao_id' => $classificacao['Classificacao']['id'],
                    'tarefa_id'        => '',
                    'fase'             => '2',
                    'status'           => '0',
                    'created'          => '2016-03-01',
                ),
            );

            $exist = $this->ClassificacaoTarefa->find('count', array(
                'conditions' => array(
                    'ClassificacaoTarefa.classificacao_id' => $classificacao['Classificacao']['id'],
                    'ClassificacaoTarefa.fase'             => '1',
                ),
            ));

            if ($exist == '0') {                
                $this->importacaoLog("Tarefa de exportação >> id: $classificacaoParamsId | carta: $classificacaoCarta | ano: $classificacaoYear", "warning");
                $this->ClassificacaoTarefa->create();
                $this->ClassificacaoTarefa->save($classificacaoTarefa1);

                $classificacaoTarefa2['ClassificacaoTarefa']['tarefa_id'] = $this->ClassificacaoTarefa->id;

                $this->ClassificacaoTarefa->create();
                $this->ClassificacaoTarefa->save($classificacaoTarefa2);
                $count++;
            }
        }

    }

    public function fase2to3() {

        // arguments

        $argLimit = isset($this->args[0]) ? $this->args[0] : 1;
        $argPage  = isset($this->args[1]) ? $this->args[0] : null;

        $conditions = array(
            'ClassificacaoTarefa.fase'   => '2',
            'ClassificacaoTarefa.status' => '0',
            'Classificacao.bioma_id'     => ['1'],
        );

        $tasksTotal = $this->ClassificacaoTarefa->find('count', array(
            'conditions' => $conditions,
        ));

        $pagesTotal = ceil($tasksTotal / $argLimit);

        $this->importacaoLog("Total de tarefas: $tasksTotal", "info");

        if ($argPage == null) {
            $page = 1;
            while ($page <= $pagesTotal) {
                $this->importacaoLog("parte $page de $pagesTotal", "info");
                $this->fase2to3Pagination($page, $argLimit, $conditions);
                $page++;
            }
        } else {
            $this->fase2to3Pagination($argPage, $argLimit, $conditions);
        }

        $this->ClassificacaoTarefa->query('update classificacao_tarefas set status = 2 where fase = 2 and status = 0 and completed is not null');
    }

    private function fase2to3Pagination($page, $argLimit, $conditions) {

        $classificacaoTarefas = $this->ClassificacaoTarefa->find('all', array(
            'conditions' => $conditions,
            'order'      => array(
                'Classificacao.bioma_id ASC',
                'Classificacao.year DESC',
                'Classificacao.id ASC',
            ),
            'limit'      => $argLimit,
            'page'       => $page,
            'contain'    => array(
                'Classificacao' => array(
                    'Carta',
                    'Bioma',
                ),
            ),
        ));

        foreach ($classificacaoTarefas as $tarefa) {
            $classificacaoParamsId    = $tarefa['Classificacao']['id'];
            $classificacaoVersaoFinal = $tarefa['Classificacao']['versao_final'];
            $classificacaoCarta       = $tarefa['Classificacao']['Carta']['codigo'];
            $classificacaoYear        = $tarefa['Classificacao']['year'];

            $this->importacaoLog("Tarefa de exportação >> id: $classificacaoParamsId | carta: $classificacaoCarta | ano: $classificacaoYear", "info");

            $this->ClassificacaoTarefa->create();
            $this->ClassificacaoTarefa->id = $tarefa['ClassificacaoTarefa']['id'];
            $this->ClassificacaoTarefa->saveField('completed', date('Y-m-d H:i:s'));

            $classificacaoTarefa = array(
                'ClassificacaoTarefa' => array(
                    'classificacao_id' => $tarefa['ClassificacaoTarefa']['classificacao_id'],
                    'fase'             => '3',
                    'status'           => '0',
                ),
            );

            $this->ClassificacaoTarefa->create();
            $this->ClassificacaoTarefa->save($classificacaoTarefa);
        }
    }

    private function importacaoLog($msg, $tipoLog, $lineEscape = 2) {

        $this->stdout->styles('titulo', array(
            'text' => 'green',
        ));
        $this->stdout->styles('car', array(
            'text' => 'white',
        ));

        $log = "";
        if ($tipoLog == "info") {
            $log = "<info>$msg</info>";
        } else if ($tipoLog == "warning") {
            $log = "<warning>$msg</warning>";
        } else if ($tipoLog == "info") {
            $log = "<error>$msg</error>";
        } else {
            $log = $msg;
        }
        $this->out($log, $lineEscape, Shell::NORMAL);
    }
}
