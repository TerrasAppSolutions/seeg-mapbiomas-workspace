<?php

App::uses('Classificacao', 'Model');
App::uses('Bioma', 'Model');

class ExportAssetsStatusUpdateShell extends AppShell
{

    /**
     * Model de Classificação
     * @var Cake.Model
     */
    private $Classificacao;
   
    /**
     * Model de Bioma
     * @var Cake.Model
     */
    private $Bioma;


    /**
     * Datasource Model
     * @var Cake.Datasource
     */
    private $dataSource;
    

    /**
     * Função principal do módulo, instancimento de modelos e
     * configurações de cache
     */
    public function main()
    {
        $this->Classificacao = new Classificacao();
        
        $this->Bioma = new Bioma();

        $this->dataSource = $this->Classificacao->getDataSource();

        //proc_nice(20);
        ini_set('memory_limit', '1G'); 

        $appPath = APP_BASE_PATH;

        $biomas = ['AMAZONIA','CERRADO','CAATINGA','PAMPA','PANTANAL' ,'MATAATLANTICA'];

        foreach ($biomas as $bioma) {
            
            $output = shell_exec("python $appPath/Console/Scripts/export_gee_assets_status.py $bioma");

            $exportResults = json_decode($output,true);        

            //$this->updateClassification($exportResults['classificacao']);
            echo "$bioma classification tasks updated \n";

            $this->updateClassificationFt($exportResults['classificacao-ft']);
            echo "$bioma temporal filter tasks updated \n";
        }
    } 

    private function updateClassification($classificacaoIds){        

        $processed = implode(',',$classificacaoIds['processed']);

        /*
         * processed image
         */
        // count
        $sqlProcessedCount = 
        "WITH CTS AS " .
        "( ".
          "SELECT CT.id FROM classificacao_tarefas AS CT ".      
          "LEFT JOIN classificacoes AS C ON C.id = CT.classificacao_id ".
          "LEFT JOIN biomas AS B ON B.id = C.bioma_id ".      
          "WHERE ".            
            "CT.fase = 1 AND ".   // fase classification
            "CT.status <> 2 AND ". // status awating processing
            //"CT.modified < (now() - interval ' days') AND ".
            "CT.id IN ($processed) ".                  
        ") ".
        "SELECT COUNT(CTS.id) FROM CTS";          

        $processedCount = $this->runSql($sqlProcessedCount);

        echo "classification tasks to update: " .$processedCount[0]['count']."\n";                

        // update tasks
        $sqlProcessed = 
        "WITH CTS AS " .
        "( ".
          "SELECT CT.id FROM classificacao_tarefas AS CT ".      
          "LEFT JOIN classificacoes AS C ON C.id = CT.classificacao_id ".
          "LEFT JOIN biomas AS B ON B.id = C.bioma_id ".      
          "WHERE ".            
            "CT.fase = 1 AND ".   // fase classification
            "CT.status <> 2 AND ". // status not completed
            //"CT.modified < (now() - interval '1 days') AND ".
            "CT.id IN ($processed) ".                  
        ") ".
        "UPDATE classificacao_tarefas ".
        "SET ". 
           "status = 2, ".
           "log = 'updated by workspace', ".
           "modified = current_timestamp ".
        "WHERE id IN (SELECT CTS.id FROM CTS)";          

        $this->runSql($sqlProcessed);


        /*
         * Exceptions
         */

        $sqlExceptionCount = 
        "WITH CTS AS " .
        "( ".
          "SELECT CT.id FROM classificacao_tarefas AS CT ".      
          "LEFT JOIN classificacoes AS C ON C.id = CT.classificacao_id ".
          "LEFT JOIN biomas AS B ON B.id = C.bioma_id ".      
          "WHERE ".            
            "CT.fase = 1 AND ".   // fase classification 
            "CT.status = 1 AND ". // awating processing
            "CT.modified < (now() - interval '2 days') AND ".
            "CT.id NOT IN ($processed) ".                  
        ") ".
        "SELECT COUNT(CTS.id) FROM CTS";          

        $exceptionCount = $this->runSql($sqlExceptionCount);

        echo "classification exception tasks to update: " .$exceptionCount[0]['count']."\n";

        // update tasks to exception
        $sqlException = 
        "WITH CTS AS " .
        "( ".
          "SELECT CT.id FROM classificacao_tarefas AS CT ".      
          "LEFT JOIN classificacoes AS C ON C.id = CT.classificacao_id ".
          "LEFT JOIN biomas AS B ON B.id = C.bioma_id ".      
          "WHERE ".            
            "CT.fase = 1 AND ".   // fase classification 
            "CT.status = 1 AND ". // status awating processing
            "CT.modified < (now() - interval '2 days') AND ".
            "CT.id NOT IN ($processed) ".                  
        ") ".
        "UPDATE classificacao_tarefas ".
        "SET ". 
           "status = 3, ".
           "log = 'error status updated by workspace', ".
           "modified = current_timestamp ".
        "WHERE id IN (SELECT CTS.id FROM CTS)";          

        //$this->runSql($sqlException);
    }

    private function updateClassificationFt($classificacaoftIds){        

        $processed = implode(',',$classificacaoftIds['processed']);

        // update tasks to processed
        $sqlProcessed = 
        "WITH CTS AS " .
        "( ".
          "SELECT CT.id FROM classificacao_tarefas AS CT ".      
          "LEFT JOIN classificacoes AS C ON C.id = CT.classificacao_id ".
          "LEFT JOIN biomas AS B ON B.id = C.bioma_id ".      
          "WHERE ".            
            "CT.fase = 2 AND ".   // fase classification
            "CT.status <> 2 AND ". // status processed
            "CT.status <> 3 AND ". // status exception
            "CT.status <> 5 AND ". // status canceled
            "CT.modified < (now() - interval '1 days') AND ".
            "CT.tarefa_id IN ($processed) ".                  
        ") ".
        "UPDATE classificacao_tarefas ".
        "SET ". 
           "status = 2, ".
           "log = 'updated by workspace', ".
           "modified = current_timestamp ".
        "WHERE id IN (SELECT CTS.id FROM CTS)";          

        $this->runSql($sqlProcessed);        
    }

    private function runSql($sql) {  

        $dbHost = $this->dataSource->config['host'];
        $dbName = $this->dataSource->config['database'];
        $dbLogin = $this->dataSource->config['login'];
        $dbPassword = $this->dataSource->config['password'];
        
        $result = null;
        
        try {
            $db = new PDO("pgsql:host=$dbHost;dbname=$dbName", $dbLogin, $dbPassword);
            $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, 1);
            $stmt = $db->prepare($sql);
            $stmt->execute();            
            $result = $stmt->fetchAll();            
        }
        catch(Exception $e) {            
            echo $e;
        }
        
        return $result;
    }
   
}
