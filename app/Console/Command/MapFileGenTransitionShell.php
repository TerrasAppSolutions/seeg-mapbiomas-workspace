<?php

App::uses('Classe', 'Model');
App::uses('File', 'Utility');

class MapFileGenTransitionShell extends AppShell
{

    /**
     * Model de Classe
     * @var Cake.Model
     */
    private $Classe; 


    private $mapfileStr = "";
    

    /**
     * Função principal do módulo, instancimento de modelos e
     * configurações de cache
     */
    public function main()
    {        
        //$fileJson  = new File($this->args[0]);
        //$json      = utf8_decode($fileJson->read());
        //$jsonDados = json_decode($json, true);

        $this->transition();
    }


    public function groups_transitions(){  

        $pixelValueColor = [];

        $colors = [
            '1' => '6 255 0', 
            '2' => '30 144 255', 
            '3' => '165 92 214',
            '4' => '255 0 0',
            '5' => '206 206 206'
        ];


        $clazz = [
            [
                "name" => "1. Floresta",
                "noChange" => [1,2,3,4,5,6,7,8,10,11,12,13], // Sem mudança - cor cinza
                "upVeg" => [], // Aumento da cobertura vegetal - cor verde
                "downVeg" => [14,15,16,17,18,19,20,21,28,22,23,24,25], // Diminuição da cobertura vegetal - cor vermelha
                "silvicultura" => [9],
                "agua" => [26], // classe que virou água
                "ignored" => [27] // Ignoradas - cor cinza
            ],
            [
                "name" => "2. Formações Naturais não Florestais",
                "noChange" => [10,11,12,13], // Sem mudança - cor cinza
                "upVeg" => [1,2,3,4,5,6,7,8], // Aumento da cobertura vegetal - cor verde
                "downVeg" => [14,15,16,17,18,19,20,21,28,22,23,24,25], // Diminuição da cobertura vegetal - cor vermelha
                "silvicultura" => [9],
                "agua" => [26], // classe que virou água
                "ignored" => [27] // Ignoradas - cor cinza
            ],
            [
                "name" => "3. Uso Agropecuário",
                "noChange" => [14,15,16,17,18,19,20,21,28,22,23,25], // Sem mudança - cor cinza
                "upVeg" => [1,2,3,4,5,6,7,8,10,11,12,13], // Aumento da cobertura vegetal - cor verde
                "downVeg" => [24], // Diminuição da cobertura vegetal - cor vermelha
                "silvicultura" => [9],
                "agua" => [26], // classe que virou água
                "ignored" => [27] // Ignoradas - cor cinza
            ],
            [
                "name" => "4.Áreas não vegetadas",
                "noChange" => [14,15,16,17,18,19,20,21,28,22,23,24,25], // Sem mudança - cor cinza
                "upVeg" => [1,2,3,4,5,6,7,8,10,11,12,13], // Aumento da cobertura vegetal - cor verde
                "downVeg" => [], // Diminuição da cobertura vegetal - cor vermelha
                "silvicultura" => [9],
                "agua" => [26], // classe que virou água
                "ignored" => [27], // Ignoradas - cor cinza
            ],
            [
                "name" => "9. Silvicultura",
                "noChange" => [9], // Sem mudança - cor cinza
                "upVeg" => [], // Aumento da cobertura vegetal - cor verde
                "downVeg" => [], // Diminuição da cobertura vegetal - cor vermelha
                "silvicultura" => [],
                "agua" => [], // classe que virou água
                "ignored" => [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,28,22,23,24,25,26,27] // Ignoradas - cor cinza
            ],
            [
                "name" => "5. Corpos Dágua",
                "noChange" => [26], // Sem mudança - cor cinza
                "upVeg" => [], // Aumento da cobertura vegetal - cor verde
                "downVeg" => [], // Diminuição da cobertura vegetal - cor vermelha
                "silvicultura" => [],
                "agua" => [], // classe que virou água
                "ignored" => [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,28,22,23,24,25,27] // Ignoradas - cor cinza
            ],
            [
                "name" => "6. Não observado",
                "noChange" => [27], // Sem mudança - cor cinza
                "upVeg" => [], // Aumento da cobertura vegetal - cor verde
                "downVeg" => [], // Diminuição da cobertura vegetal - cor vermelha
                "silvicultura" => [],
                "agua" => [], // classe que virou água
                "ignored" => [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,28,22,23,24,25,26] // Ignoradas - cor cinza
            ]
        ];

        

        foreach ($clazz as $c1) {    
        
            foreach ($c1["noChange"] as $noChange1) {    
                
                foreach ($c1["noChange"] as $noChange2) {                      
                    $oldValue = $this->pixelValue($noChange1,$noChange2);
                    $pixelValueColor[] = [
                                            "oldValue" => $oldValue,
                                            "color" => $colors['5'],                                            
                                            "groupId" => "5"
                                          ];
                }  
        
                foreach ($c1["upVeg"] as $upVeg2) {                      
                    $oldValue = $this->pixelValue($noChange1,$upVeg2);
                    $pixelValueColor[] = [
                                            "oldValue" => $oldValue,
                                            "color" => $colors['1'],
                                            "groupId" => "1"
                                          ];
                }  
                
                foreach ($c1["downVeg"] as $downVeg2) {                      
                    $oldValue = $this->pixelValue($noChange1,$downVeg2);
                    $pixelValueColor[] = [
                                            "oldValue" => $oldValue,
                                            "color" => $colors['4'],
                                            "groupId" => "4"
                                          ];
                }  

                foreach ($c1["silvicultura"] as $silvicultura2) {                      
                    $oldValue = $this->pixelValue($noChange1,$silvicultura2);
                    $pixelValueColor[] = [
                                            "oldValue" => $oldValue,
                                            "color" => $colors['3'],
                                            "groupId" => "3"
                                          ];
                } 

                foreach ($c1["agua"] as $agua2) {                      
                    $oldValue = $this->pixelValue($noChange1,$agua2);
                    $pixelValueColor[] = [
                                            "oldValue" => $oldValue,
                                            "color" => $colors['2'],
                                            "groupId" => "2"
                                          ];
                } 

                foreach ($c1["ignored"] as $ignored2) {                      
                    $oldValue = $this->pixelValue($noChange1,$ignored2);
                    $pixelValueColor[] = [
                                            "oldValue" => $oldValue,
                                            "color" => $colors['5'],                                            
                                            "groupId" => "5"
                                          ];
                }
            };
        };
              
        foreach ($pixelValueColor as $pvc) {
            $pv = $pvc['oldValue'];
            $rgb = $pvc['color'];
            $groupId = $pvc['groupId'];

            $mapclass = "";                            
            $mapclass .= 
            "CLASS \n".
            "   EXPRESSION ([pixel] = $pv AND (\"$groupId\" IN '%transitions_group%')) \n".            
            "   STYLE \n".                        
            "       COLOR $rgb \n".
            "   END \n".
            "END \n\n";   
            $this->mapfileStr .= $mapclass;
        }
        

        echo $this->mapfileStr;

        $mapfile = new File('../Vendor/MapServer/v/2.3/includes/style_bioma_transition_groups.map');

        $mapfile->write($this->mapfileStr);        

    } 


    
    public function transition(){    
        
        $this->Classe = new Classe();                

        $classes = $this->Classe->find('all',array(
            'order' => array(
                'Classe.valor ASC'
            )
        ));

        $transtions  = [];

        foreach ($classes as $classe0) {            
            foreach ($classes as $classe1) {                
                $transtions[] = [
                    'c0' => $classe0['Classe']['valor'],
                    'c0_l1' => $classe0['Classe']['valor_l1'],
                    'c1' => $classe1['Classe']['valor'],
                    'c1_l1' => $classe1['Classe']['valor_l1'],
                    'pv' => $this->pixelValue($classe0['Classe']['valor'],$classe1['Classe']['valor']),
                ];                
            }
        }

        foreach ($transtions as $key => $transtion) {
            $c0 = $transtion['c0'];
            $c0_l1 = $transtion['c0_l1'];
            $c1 = $transtion['c1'];
            $c1_l1 = $transtion['c1_l1'];
            $pv = $transtion['pv'];

            $rgb = ($c0 == $c1 ? "118 118 118":"255 0 0");            
            $rgb_l1 = ($c0_l1 == $c1_l1 ? "118 118 118":"255 0 0");            

            $mapclass = "";
                            
            $mapclass .= 
            "CLASS \n".
            "   EXPRESSION ([pixel] = $pv AND ((%transition_c0%) = $c0_l1 AND (%transition_c1%) = $c1_l1)) \n".
            "   STYLE \n".
            "       COLOR $rgb_l1 \n".
            "   END \n".
            "END \n\n";   
            
            $mapclass .= 
            "CLASS \n".
            "   EXPRESSION ([pixel] = $pv AND ((%transition_c0%) = $c0 AND (%transition_c1%) = $c1)) \n".
            "   STYLE \n".
            "       COLOR $rgb \n".
            "   END \n".
            "END \n\n";


            $this->mapfileStr .= $mapclass;                 

        }

        echo $this->mapfileStr;

        $mapfile = new File('../Vendor/MapServer/v/2.3/includes/style_bioma_transition_combinations.map');

        $mapfile->write($this->mapfileStr);        

    } 



    private function pixelValue($c0,$c1){
        return ($c0*100)+$c1;
    }
}
