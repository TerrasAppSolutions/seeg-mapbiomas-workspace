<?php

App::uses('Classificacao', 'Model');
App::uses('Bioma', 'Model');

class ExportAssetsStatusUpdateJsonShell extends AppShell
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

        $this->dataSource = $this->Classificacao->getDataSource();

        $fileJson = new File($this->args[0]);
        $json      = utf8_decode($fileJson->read());
        $jsonDados = json_decode($json, true);        

        $mosaicTaskIds = [
            'classificacao-ft' => [],
            'classificacao' => [],
            'mosaico' => [],
            'integracao' => []
        ];

        foreach ($jsonDados as $data) {            
            $mosaicTaskIds[$data['fase']][] = $data;            
        }

        $this->resetAssetVerification();
        echo "Reset Assets verification \n";

        if(isset($this->args[1]) && $this->args[1] == '1'){
            $this->updateMosaicByParams($mosaicTaskIds['mosaico']);
            echo "Mosaic tasks updated \n";
        }
        
        if(isset($this->args[2]) && $this->args[2] == '1'){
            $this->updateClassificationByParams($mosaicTaskIds['classificacao']);
            echo "$bioma classification tasks updated \n";
        }

        if(isset($this->args[3]) && $this->args[3] == '1'){            
            $this->updateClassificationFtByParams($mosaicTaskIds['classificacao-ft']);
            echo "$bioma temporal filter tasks updated \n";       
        }
        
        $this->updateIntegrationByParams($mosaicTaskIds['integracao']);
        echo "$bioma integration tasks updated \n";       
    } 

     private function updateMosaicByParams($taskIds){                    
        
        // update tasks        

        $sqlParams = [];

        foreach ($taskIds as $value) {

            $carta = $value['grid_name'];
            $year = str_replace(".0","",$value['year']);
            $bioma = $value['biome'];
            $sqlParam = "(CA.codigo = '$carta' AND C.year = '$year' AND B.nome = '$bioma')";
            
            $sqlParam = 
            "WITH CTS AS " .
            "( ".
            "SELECT CT.id FROM classificacao_tarefas AS CT ".      
            "LEFT JOIN classificacoes AS C ON C.id = CT.classificacao_id ".
            "LEFT JOIN biomas AS B ON B.id = C.bioma_id ".      
            "LEFT JOIN cartas AS CA ON CA.id = C.carta_id ".      
            "WHERE ".            
                "C.colecao_id = 4 AND ".   // colecao 2.1
                "CT.fase = 0 AND ".   // fase mosaic
                "CT.status <> 0 AND ". // status awating processing                  
                "CT.status <> 5 AND ". // status cancel           
                "$sqlParam ".                  
            ") ".
            "UPDATE classificacao_tarefas ".
            "SET ". 
            "status = 2, ".
            "gee_asset_verificacao = 1, ".
            "log = 'updated by workspace', ".
            "modified = current_timestamp ".
            "WHERE id IN (SELECT CTS.id FROM CTS)";        
            
            $sqlParams[] = $sqlParam;
        }

        $countAll = count($sqlParams);
        foreach ($sqlParams as $key => $sql) {
            echo "Mosaic updated: ".($key+1) . "/" .$countAll."\n";
            $this->runSql($sql);                    
        }  

        // update tasks to exception
        $sqlException = 
        "WITH CTS AS " .
        "( ".
          "SELECT CT.id FROM classificacao_tarefas AS CT ".      
          "LEFT JOIN classificacoes AS C ON C.id = CT.classificacao_id ".
          "LEFT JOIN biomas AS B ON B.id = C.bioma_id ".      
          "WHERE ".            
            "CT.fase = 0 AND ".   // fase classification 
            "CT.status = 1 AND ". // status awating processing
            "CT.modified < (now() - interval '2 days')".                             
        ") ".
        "UPDATE classificacao_tarefas ".
        "SET ". 
           "status = 3, ".
           "gee_asset_verificacao = 0, ".
           "log = 'error status updated by workspace', ".
           "modified = current_timestamp ".
        "WHERE id IN (SELECT CTS.id FROM CTS)";          

        $this->runSql($sqlException);         
    }

     private function updateClassificationByParams($taskIds){                    
        
        // update tasks        

        $sqlParams = [];

        foreach ($taskIds as $value) {

            $carta = $value['grid_name'];
            $year = str_replace(".0","",$value['year']);
            $bioma = $value['biome'];
            $sqlParam = "(CA.codigo = '$carta' AND C.year = '$year' AND B.nome = '$bioma')";
            
            $sqlParam = 
            "WITH CTS AS " .
            "( ".
            "SELECT CT.id FROM classificacao_tarefas AS CT ".      
            "LEFT JOIN classificacoes AS C ON C.id = CT.classificacao_id ".
            "LEFT JOIN biomas AS B ON B.id = C.bioma_id ".      
            "LEFT JOIN cartas AS CA ON CA.id = C.carta_id ".      
            "WHERE ".            
                "C.colecao_id = 4 AND ".   // colecao 2.1
                "CT.fase = 1 AND ".   // fase classification
                "CT.status <> 0 AND ". // status awating processing                  
                "CT.status <> 5 AND ". // status cancel           
                "$sqlParam ".                  
            ") ".
            "UPDATE classificacao_tarefas ".
            "SET ". 
            "status = 2, ".
            "gee_asset_verificacao = 1, ".
            "log = 'updated by workspace', ".
            "modified = current_timestamp ".
            "WHERE id IN (SELECT CTS.id FROM CTS)";        
            
            $sqlParams[] = $sqlParam;
        }
        
        $countAll = count($sqlParams);
        foreach ($sqlParams as $key => $sql) {
            echo "Classification updated: ".($key+1) . "/" .$countAll."\n";
            $this->runSql($sql);                    
        }  

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
            "CT.modified < (now() - interval '2 days')".                             
        ") ".
        "UPDATE classificacao_tarefas ".
        "SET ". 
           "status = 3, ".
           "gee_asset_verificacao = 0, ".
           "log = 'error status updated by workspace', ".
           "modified = current_timestamp ".
        "WHERE id IN (SELECT CTS.id FROM CTS)";          

        $this->runSql($sqlException);
    }

    private function updateClassificationFtByParams($taskIds){                    
        
        // update tasks        

        $sqlParams = [];

        foreach ($taskIds as $value) {

            $carta = $value['grid_name'];
            $year = str_replace(".0","",$value['year']);
            $bioma = $value['biome'];
            $sqlParam = "(CA.codigo = '$carta' AND C.year = '$year' AND B.nome = '$bioma')";
            
            $sqlParam = 
            "WITH CTS AS " .
            "( ".
            "SELECT CT.id FROM classificacao_tarefas AS CT ".      
            "LEFT JOIN classificacoes AS C ON C.id = CT.classificacao_id ".
            "LEFT JOIN biomas AS B ON B.id = C.bioma_id ".      
            "LEFT JOIN cartas AS CA ON CA.id = C.carta_id ".      
            "WHERE ".            
                "C.colecao_id = 4 AND ".   // colecao 2.1
                "CT.fase = 2 AND ".   // fase temporal filter                
                "CT.status <> 5 AND ". // status cancel           
                "$sqlParam ".                  
            ") ".
            "UPDATE classificacao_tarefas ".
            "SET ". 
            "status = 2, ".
            "gee_asset_verificacao = 1, ".
            "log = 'updated by workspace', ".
            "modified = current_timestamp ".
            "WHERE id IN (SELECT CTS.id FROM CTS)";        
            
            $sqlParams[] = $sqlParam;
        }
        
        $countAll = count($sqlParams);
        foreach ($sqlParams as $key => $sql) {
            echo "Temporal Filter updated: ".($key+1) . "/" .$countAll."\n";
            $this->runSql($sql);                    
        }        

    }
    
    private function updateIntegrationByParams($taskIds){                    
        
        // update tasks        

        $sqlParams = [];

        foreach ($taskIds as $value) {

            $carta = $value['grid_name'];            
            $year = str_replace(".0","",$value['year']);
            $bioma = $value['biome'];
            $sqlParam = "(CA.codigo = '$carta' AND C.year = '$year' AND B.nome = '$bioma')";
            
            $sqlParam = 
            "WITH CTS AS " .
            "( ".
            "SELECT CT.id FROM classificacao_tarefas AS CT ".      
            "LEFT JOIN classificacoes AS C ON C.id = CT.classificacao_id ".
            "LEFT JOIN biomas AS B ON B.id = C.bioma_id ".      
            "LEFT JOIN cartas AS CA ON CA.id = C.carta_id ".      
            "WHERE ".            
                "C.colecao_id = 4 AND ".   // colecao 2.1
                "CT.fase = 3 AND ".   // fase integracao
                "CT.status <> 0 AND ". // status awating processing                 
                "CT.status <> 5 AND ". // status cancel           
                "$sqlParam ".                  
            ") ".
            "UPDATE classificacao_tarefas ".
            "SET ". 
            "status = 2, ".
            "gee_asset_verificacao = 1, ".
            "log = 'updated by workspace', ".
            "modified = current_timestamp ".
            "WHERE id IN (SELECT CTS.id FROM CTS)";        
            
            $sqlParams[] = $sqlParam;
        }
        
        $countAll = count($sqlParams);
        foreach ($sqlParams as $key => $sql) {
            echo "Integration updated: ".($key+1) . "/" .$countAll."\n";
            $this->runSql($sql);                    
        }  

        // update tasks to exception
        $sqlException = 
        "WITH CTS AS " .
        "( ".
          "SELECT CT.id FROM classificacao_tarefas AS CT ".      
          "LEFT JOIN classificacoes AS C ON C.id = CT.classificacao_id ".
          "LEFT JOIN biomas AS B ON B.id = C.bioma_id ".      
          "WHERE ".            
            "CT.fase = 3 AND ".   // fase integration 
            "CT.status = 1 AND ". // status awating processing
            "CT.modified < (now() - interval '1 days')".                             
        ") ".
        "UPDATE classificacao_tarefas ".
        "SET ". 
           "status = 3, ".
           "gee_asset_verificacao = 0, ".
           "log = 'error status updated by workspace', ".
           "modified = current_timestamp ".
        "WHERE id IN (SELECT CTS.id FROM CTS)";          

        $this->runSql($sqlException);
        
        // update completed not verify
        $sqlCompletedNotAsset = 
        "WITH CTS AS " .
        "( ".
          "SELECT CT.id FROM classificacao_tarefas AS CT ".      
          "LEFT JOIN classificacoes AS C ON C.id = CT.classificacao_id ".
          "LEFT JOIN biomas AS B ON B.id = C.bioma_id ".      
          "WHERE ".            
            "CT.fase = 3 AND ".   // fase integration 
            "CT.status = 2 AND ". // status awating processing
            " daerro CT.gee_asset_verificacao = 0 ". // status awating processing            
        ") ".
        "UPDATE classificacao_tarefas ".
        "SET ". 
           "status = 0, ".
           "gee_asset_verificacao = 0, ".
           "log = 'updated by workspace - completed without asset', ".
           "modified = current_timestamp ".
        "WHERE id IN (SELECT CTS.id FROM CTS)";          
        
        // EM TESTE, NAO EXECUTAR
        //$this->runSql($sqlCompletedNotAsset);
    }

    private function resetAssetVerification(){                    
        
        $sql = 
        "WITH CTS AS " .
        "( ".
          "SELECT CT.id FROM classificacao_tarefas AS CT ".      
          "LEFT JOIN classificacoes AS C ON C.id = CT.classificacao_id ".
          "LEFT JOIN biomas AS B ON B.id = C.bioma_id ".      
          "WHERE ". 
            "C.colecao_id = 4".                              
        ") ".
        "UPDATE classificacao_tarefas ".
        "SET ". 
           "gee_asset_verificacao = 0 ".                                 
        "WHERE id IN (SELECT CTS.id FROM CTS)";          

        $this->runSql($sql);
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
