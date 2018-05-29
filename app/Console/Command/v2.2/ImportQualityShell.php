<?php
App::uses('Folder', 'Utility');
App::uses('File', 'Utility');
App::uses('Qualidade', 'Model');
App::uses('Carta', 'Model');
App::uses('Bioma', 'Model');

class ImportQualityShell extends AppShell {
    
    private $Qualidade;
    private $Carta;
    private $Bioma;
    private $erros;
    
    public function main() {
        
        $this->Qualidade = new Qualidade();
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
        
        $this->importacaoLog('Importação de arquivo json de qualidade', 'titulo', 2);
        $this->importacaoLog('Verificando arquivos de importação...', 'info', 2);        
        
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

        $qualidades = [];

        foreach ($jsonDados as $key => $q) {
            $qualidade = array(
                "Qualidade" => array(
                    'bioma_id' => $q['bioma_id'],
                    'carta_id' => intval($this->getOrSaveCartaId($q['codigo'])),                    
                    'ano' => $q['ano'],
                    'qualidade' => $q['qualidade'],
                    
                )
            );
            $this->Qualidade->create();
            $this->Qualidade->save($qualidade); 
            $this->importacaoLog('Salvando qualidade bioma '.$q['bioma_id'], 'info', 2);
        }
       
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
