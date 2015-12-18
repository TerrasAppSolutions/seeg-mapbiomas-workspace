<?php
App::uses('Estatistica', 'Model');
App::uses('EstatisticaTransicao', 'Model');
App::uses('File', 'Utility');

class StatsinputShell extends AppShell {
    
    public $Estatistica;
    public $EstatisticaTransicao;
    
    public function __construct() {
        parent::__construct();
        
        $this->Estatistica = new Estatistica();
        $this->EstatisticaTransicao = new EstatisticaTransicao();
        
        ini_set('memory_limit', '1G');
        
        Cache::config('_cake_model_', array(
            'engine' => 'File',
            'prefix' => 'shell' . 'cake_model_',
            'path' => CACHE . 'models' . DS,
            'serialize' => true,
            'duration' => '+999 days'
        ));
    }
    
    public function main() {
    }
    
    public function stats() {
        
        if (!isset($this->args[0])) {
            echo "parametro não informado";
            exit;
        }
        
        $fileJson = new File($this->args[0]);
        
        $data = json_decode($fileJson->read() , true);
        
        $countSave = 0;
        
        foreach ($data as $key => $value) {
            $estatistica = array(
                'Estatistica' => array(
                    'territorio' => $value['territorio_id'],
                    'classe' => $value['class'],
                    'ano' => $value['year'],
                    'area' => $value['area'],
                    'percentagem' => null,
                )
            );

            echo ++$countSave . " Salvo! \n";
            
            $this->Estatistica->create();
            $this->Estatistica->save($estatistica);
        }
    }
    
    public function transitions() {
        
        if (!isset($this->args[0])) {
            echo "parametro não informado";
            exit;
        }
        
        $fileJson = new File($this->args[0]);
        
        $data = json_decode($fileJson->read() , true);
        
        $countSave = 0;
        
        foreach ($data as $key => $value) {
            $estatisticaTransicao = array(
                'EstatisticaTransicao' => array(
                    'classe_inicial' => $value['from'],
                    'classe_final' => $value['to'],
                    'area' => $value['area'],
                    'ano_inicial' => $value['year_from'],
                    'ano_final' => $value['year_to'],
                    'territorio' => $value['territory_id'],
                    
                    //'porcentagem' => $value['percentage']
                    
                )
            );
            
            try {
                $this->EstatisticaTransicao->create();
                $this->EstatisticaTransicao->save($estatisticaTransicao);
                echo ++$countSave . " Salvo! \n";
            }
            catch(Exception $e) {
                echo "Erro ao salvar: \n";
                var_dump($value);
            }
        }
    }
}

/*
delete from estatistica_transicoes where classe_inicial = 0;
delete from estatistica_transicoes where classe_final = 0;
delete from estatistica_transicoes where area = 0;
*/
