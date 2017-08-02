<?php
App::uses('Folder', 'Utility');
App::uses('File', 'Utility');
App::uses('Classificacao', 'Model');
App::uses('Carta', 'Model');
App::uses('Bioma', 'Model');

class ImportarftparamsShell extends AppShell {
    
    private $Classificacao;
    private $Carta;
    private $Bioma;
    private $erros;
    
    public function main() {
        
        $this->Classificacao = new Classificacao();
        $this->Carta = new Carta();
        $this->Bioma = new Bioma();
        
        $this->erros = array();
        
        //proc_nice(20);
        ini_set('memory_limit', '1G');
        
        // configurações de cache necessarios para evitar conflitos
        // com o sistema web
        Cache::config('_cake_model_', array(
            'engine' => 'File',
            'prefix' => 'shell' . 'cake_model_',
            'path' => CACHE . 'models' . DS,
            'serialize' => true,
            'duration' => '+999 days'
        ));
        
        // verifica se os argumentos são validos
        $this->validaArgs($this->args);
        
        $this->importacaoLog('Importação de arquivo json fusion table', 'titulo', 2);
        $this->importacaoLog('Verificando arquivos de importação...', 'info', 0);
        
        $this->importaJson(new File($this->args[0]));
    }
    
    private function validaArgs($args) {
        if (!isset($args[0])) {
            $this->importacaoLog('O arquivo json deve ser informado.', 'error');
            exit;
        }
        
        $jsonFile = new File($this->args[0]);
        if ($jsonFile == null) {
            $this->importacaoLog('Arquivo inválido.', 'error');
            exit;
        }
    }
    
    private function importaJson($jsonFile) {
        
        $json = utf8_decode($jsonFile->read());
        $jsonDados = json_decode($json, true);

        //var_dump($jsonDados[0]);die;
        
        /*
         * Exibe numero total de itens a ser importado
        */
        $totalImportItens = count($jsonDados);
        $this->importacaoLog("$totalImportItens registros.", "info");
        
        // cada arquivo será carregado e convertido de json para array
        // e posteriormente salvo
        foreach ($jsonDados as $key => $dado) {
            
            // remapeia o registro no padrao model
            $classificacao = $this->remapmodel($dado);
            $classificacao['Classificacao']['carta_id'] = $this->getOrSaveCartaId($classificacao['Classificacao']['grid_name']);
            $classificacao['Classificacao']['bioma_id'] = $this->getOrSaveBiomaId($classificacao['Classificacao']['bioma']);
            
            // inicia a transação
            $dataSource = $this->Classificacao->getDataSource();
            $dataSource->begin();
            try {
                
                // salva dados da classificação
                $this->Classificacao->create();
                $this->Classificacao->save($classificacao);
                $dataSource->commit();
                
                /*
                 * mensagem de console para exibição
                 * de progresso da importação
                */
                
                // calculo de porcentagem de progresso
                $nImportados = $key + 1;
                $perc = intval(($nImportados / $totalImportItens) * 100);
                $saida = "<warning>[ $nImportados/$totalImportItens >> " . $perc . "% ]\t</warning>" . '<comment>' . 'registros importados.' . '</comment>';
                $this->importacaoLog($saida, null, 1);
            }
            catch(Exception $exc) {
                $saidaExc = "\t<error>" . "Erro ao importar </error>";
                $this->importacaoLog($saidaExc, null, 1);
                $dataSource->rollback();

                print($exc->getMessage());
                
                $dado['erro'] = $exc->getMessage();
                $this->erros[] = $dado;
            }
        }
        
        $countErros = count($this->erros);
        if ($countErros) {
            $saidaExc = "\t<error>" . "Total de erros $countErros </error>";
            $this->importacaoLog($saidaExc, null, 1);
            
            $fileErros = new File($jsonFile->Folder->path . DS . "importacao_erros.json");
            $fileErros->create();
            $fileErros->write(json_encode($this->erros));
        }
    }
    
    private function remapmodel($dado) {

        //var_dump($dado);die;
        
        $ndado = array(
            'Classificacao' => array()
        );
        
        $ndado['Classificacao']['grid_name'] = $dado['GRID_NAME'];
        $ndado['Classificacao']['bioma'] = $dado['BIOMA'];
        $ndado['Classificacao']['year'] = $dado['YEAR']; 

        $t0 = explode("/",$dado['T0']);
        //$ndado['Classificacao']['t0'] = $t0[2] . "-" .$t0[0] . "-" . $t0[1];
        $ndado['Classificacao']['t0'] = $t0[1] . "/" . $t0[0] . "/".$t0[2];
        
        $t1 = explode("/",$dado['T1']);
        //$ndado['Classificacao']['t1'] = $t1[2] . "-" .$t1[0] . "-" . $t1[1];
        $ndado['Classificacao']['t1'] = $t1[1] . "/" . $t1[0] . "/".$t1[2];
        
        $ndado['Classificacao']['cloudcover'] = $dado['CLOUD_COVER'];
        
        $ndado['Classificacao']['dtv'] = array(
            'dtv1' => $dado['DTV1'] ? $dado['DTV1'] : 0,
            'dtv2' => $dado['DTV2'] ? $dado['DTV2'] : 0,
            'dtv3' => $dado['DTV3'] ? $dado['DTV3'] : 0,
            'dtv4' => $dado['DTV4'] ? $dado['DTV4'] : 0,
        );
        
        $ndado['Classificacao']['sensor'] = $dado['SENSOR'];
        $ndado['Classificacao']['tag_on'] = $dado['TAG_ON'];
        $ndado['Classificacao']['ndfi'] = $dado['NDFI'];
        $ndado['Classificacao']['sma'] = $dado['SMA'];
        $ndado['Classificacao']['ref'] = $dado['REF'];
        $ndado['Classificacao']['dt'] = $dado['DT'];
        $ndado['Classificacao']['save'] = $dado['SAVE'];
        $ndado['Classificacao']['color'] = $dado['COLOR'];
        $ndado['Classificacao']['elevation_on'] = $dado['ELEVATION_ON'];
        $ndado['Classificacao']['elevation_min'] = $dado['ELEVATION_MIN'];
        $ndado['Classificacao']['elevation_max'] = $dado['ELEVATION_MAX'];
        $ndado['Classificacao']['versao'] = $dado['VERSION'];
        $ndado['Classificacao']['identificador'] = $dado['LABEL'];
        $ndado['Classificacao']['colecao_id'] = '3';
        $ndado['Classificacao']['elevation_max'] = $dado['ELEVATION_MAX'];
        $ndado['Classificacao']['region'] = isset($dado['REGION']) ? $dado['REGION'] : "";
        
        return $ndado;
    }
    
    private function getOrSaveCartaId($cartacod) {
        $carta = $this->Carta->find('first', array(
            'conditions' => array(
                'Carta.codigo' => $cartacod
            ) ,
            'recursive' => '-1'
        ));
        
        if (empty($carta)) {
            $carta = array(
                'Carta' => array(
                    'codigo' => $cartacod
                )
            );
            $this->Carta->create();
            $this->Carta->save($carta);
            $carta['Carta']['id'] = $this->Carta->id;
        }
        
        return $carta['Carta']['id'];
    }
    
    private function getOrSaveBiomaId($biomaNome) {
        $bioma = $this->Bioma->find('first', array(
            'conditions' => array(
                'Bioma.nome' => $biomaNome
            ) ,
            'recursive' => '-1'
        ));
        
        if (empty($bioma)) {
            $bioma = array(
                'Bioma' => array(
                    'nome' => $biomaNome
                )
            );
            $this->Bioma->create();
            $this->Bioma->save($bioma);
            $bioma['Bioma']['id'] = $this->Bioma->id;
        }
        
        return $bioma['Bioma']['id'];
    }
    
    private function importacaoLog($msg, $tipoLog, $lineEscape = 2) {        
        $this->stdout->styles('titulo', array(
            'text' => 'green'
        ));
        $this->stdout->styles('car', array(
            'text' => 'white'
        ));
        
        $log = "";
        if ($tipoLog == "info") {
            $log = "<info>$msg</info>";
        } 
        else if ($tipoLog == "warning") {
            $log = "<warning>$msg</warning>";
        } 
        else if ($tipoLog == "info") {
            $log = "<error>$msg</error>";
        } 
        else {
            $log = $msg;
        }
        $this->out($log, $lineEscape, Shell::NORMAL);
    }
}
