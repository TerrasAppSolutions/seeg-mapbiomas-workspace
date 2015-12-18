<?php
App::uses('Folder', 'Utility');
App::uses('File', 'Utility');
App::uses('Classificacao', 'Model');
App::uses('ClassificacaoImagem', 'Model');
App::uses('Carta', 'Model');
App::uses('Bioma', 'Model');

class SincclassimagemShell extends AppShell {
    
    private $Classificacao;
    private $Carta;
    private $Bioma;
    
    public function main() {
        
        $this->Classificacao = new Classificacao();
        $this->Carta = new Carta();
        $this->Bioma = new Bioma();
        $this->ClassificacaoImagem = new ClassificacaoImagem();
        
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

        $cartas = $this->Carta->find('all', array(
            'order' => 'Carta.codigo ASC'
        ));
        $biomas = $this->Bioma->find('all', array(
            'order' => 'Bioma.nome ASC'
        ));
        
        foreach ($biomas as $bioma) {
            foreach ($cartas as $carta) {
                for ($ano = 2008;$ano <= 2015;$ano++) {                    
                    $this->ClassificacaoImagem->create();
                    $classifImagem = $this->ClassificacaoImagem->find('first', array(
                        'conditions' => array(
                            'ClassificacaoImagem.bioma_id' => $bioma['Bioma']['id'],
                            'ClassificacaoImagem.carta_id' => $carta['Carta']['id'],
                            'ClassificacaoImagem.ano' => $ano
                        )
                    ));                    
                    
                    $imagem = $bioma['Bioma']['nome'];
                    $imagem.= "/" . $carta['Carta']['codigo'];
                    $imagem.= "/" . $bioma['Bioma']['nome'];
                    $imagem.= "_" . $carta['Carta']['codigo'];
                    $imagem.= "_" . $ano . ".tif";

                    if (!empty($classifImagem)) {
                        $classifImagem['ClassificacaoImagem']['imagem'] = $imagem;
                    } 
                    else {                        
                        $classifImagem = array(
                            'ClassificacaoImagem' => array(
                                'bioma_id' => $bioma['Bioma']['id'],
                                'carta_id' => $carta['Carta']['id'],
                                'ano' => "$ano",
                                'imagem' => $imagem
                            )
                        );                        
                    }
                    
                    $file = new File("/data/imagens/classificacao/BIOMA/" . $imagem);
                    
                    $classifImagem['ClassificacaoImagem']['exist'] = $file->exists();
                    
                    $this->ClassificacaoImagem->save($classifImagem);
                    
                    echo $imagem . "\n";
                }
            }
        }
    }
}
