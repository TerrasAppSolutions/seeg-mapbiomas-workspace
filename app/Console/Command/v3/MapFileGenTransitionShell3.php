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
        $this->Classe = new Classe();        

        //$fileJson  = new File($this->args[0]);
        //$json      = utf8_decode($fileJson->read());
        //$jsonDados = json_decode($json, true);

        $this->transition();
    }


    public function groups_transitions(){  

        $this->Classe = new Classe();        

        $classes = $this->Classe->find('all',array(
            'order' => array(
                'Classe.valor ASC'
            )
        ));


        // Combinações possiveis de transição

        $transtions  = [];

        foreach ($classes as $classe0) {            
            foreach ($classes as $classe1) {                
                $transtions[] = [
                    'c0' => $classe0['Classe']['valor'],
                    'c0_l1' => $classe0['Classe']['valor_l1'],
                    'c0_l2' => $classe0['Classe']['valor_l2'],
                    'c0_l3' => $classe0['Classe']['valor_l3'],
                    'c1' => $classe1['Classe']['valor'],
                    'c1_l1' => $classe1['Classe']['valor_l1'],
                    'c1_l2' => $classe1['Classe']['valor_l2'],
                    'c1_l3' => $classe1['Classe']['valor_l3'],
                    'pv' => $this->pixelValue($classe0['Classe']['valor'],$classe1['Classe']['valor']),
                ];                
            }
        }


        foreach ($transtions as $key => $transtion) {
            $c0 = $transtion['c0'];
            $c0_l1 = $transtion['c0_l1'];
            $c0_l2 = $transtion['c0_l2'];
            $c0_l3 = $transtion['c0_l3'];
            $c1 = $transtion['c1'];
            $c1_l1 = $transtion['c1_l1'];
            $c1_l2 = $transtion['c1_l2'];
            $c1_l3 = $transtion['c1_l3'];
            $pv = $transtion['pv'];

            $rgb = "118 118 118"; 


            // Regra de Transição

            $perdaVegetacao =  
                        ($c0_l1 == '1' && $c1_l1 != '1') || 
                        ($c0_l1 == '10' && $c1_l1 != '10');
                        
            
            $semMudanca = 
                        ($c0_l1 == $c1_l1) || 
                        ($c0_l1 == '10' && $c1_l1 == '1') ||
                        ($c0 == '4' && $c1 == '12') ||
                        ($c0_l1 == '14' && $c1_l1 == '22') 
                        ;               

            $regeneracaoVegetacao = 
                        ((
                            $c0_l1 == '14' ||  
                            $c0_l1 == '22' ||
                            $c0_l1 == '26' ||
                            $c0_l1 == '27' 
                        ) &&
                        $c1_l1 == '1') ||
                        ($c0_l1 == '14' && $c1_l1 == '10') ||
                        ($c0 == '12' && $c1 == '4') 
                        ;            
            
            $aumentoAgua = 
                        (
                            $c0_l1 == '1' ||  
                            $c0_l1 == '10' ||  
                            $c0_l1 == '14' ||  
                            $c0_l1 == '22' ||                            
                            $c0_l1 == '27' 
                        ) &&
                        $c1_l1 == '26';

            $mudancaSilvicultura =                         
                        $c1_l2 == '9';;


            // Regra de Transição   

            if($perdaVegetacao){
                $rgb = "255 0 0";
            }

            if($semMudanca){
                $rgb = "206 206 206";
            }

            if($regeneracaoVegetacao){
                $rgb = "6 255 0";
            }           

            if($aumentoAgua){
                $rgb = "22 125 240";
            }

            if($mudancaSilvicultura){
                $rgb = "165 92 214";
            }
                    

            $mapclass = "";
                            
            $mapclass .= 
            "CLASS \n".
            "   EXPRESSION ([pixel] = $pv) \n".
            "   STYLE \n".
            "       COLOR $rgb \n".
            "   END \n".
            "END \n\n";   

            $this->mapfileStr .= $mapclass;                 

        }

        echo $this->mapfileStr;

        $mapfile = new File('style_bioma_transition_groups.map');

        $mapfile->write($this->mapfileStr);        

    } 


    
    public function transition(){       

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

        $mapfile = new File('style_bioma_transition_combinations.map');

        $mapfile->write($this->mapfileStr);        

    } 



    private function pixelValue($c0,$c1){
        return ($c0*30)+$c1;
    }
}
