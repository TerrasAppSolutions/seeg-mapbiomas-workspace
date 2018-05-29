<?php
App::uses('Classificacao', 'Model');
App::uses('CartaRegiao', 'Model');
App::uses('CartaRegiaoInfo', 'Model');

class ClassificacaoService {

    public $Classificacao;

    public function __construct() {
        $this->Classificacao = new Classificacao();
        $this->CartaRegiaoInfo = new CartaRegiaoInfo();
    }

    /*
     * API
     */

    public function get($id) {
        $classificacao = $this->Classificacao->find('first', array(
            'conditions' => array(
                'Classificacao.id' => $id,
            ),
            'contain'    => $this->Classificacao->contains['default'],
        ));

        // http://workspace.localhost/mapbiomas/services/classificacoes/2661
        if ($classificacao) {
            $classificacao = $this->getAssociateData([$classificacao])[0];
        }

        /**
         * Verificação se possui dado de carta regiao info
         */
        if (isset($classificacao['Classificacao']['regiao_info_id'])) {
            if(isset($classificacao['CartaRegiaoInfo']) && !empty($classificacao['CartaRegiaoInfo'])) {
                $classificacao['Classificacao']['regiao_info'] = $classificacao['CartaRegiaoInfo'];
            }
        }

        return $classificacao;
    }

    public function query($options = null, $paginate = null) {

        $usuarioAuth = $this->Classificacao->authUser;

        $options['contain'] = $this->Classificacao->contains['default'];

        $optionsConditions = isset($options['conditions']) ? $options['conditions'] : array();

        // se informado o codigo da carta, pesquisa o id da carta.
        if (isset($optionsConditions['Classificacao.carta'])) {
            $carta = $this->Classificacao->Carta->find('first', array(
                'conditions' => array(
                    'Carta.codigo' => $options['conditions']['Classificacao.carta'],
                ),
                'recursive'  => '-1',
            ));
            if ($carta) {
                $options['conditions']['Classificacao.carta_id'] = $carta['Carta']['id'];
            } else {
                $options['conditions']['Classificacao.carta_id'] = null;
            }
            unset($options['conditions']['Classificacao.carta']);
        }

        // se informado o nome do bioma, pesquisa o id do bioma.
        if (isset($optionsConditions['Classificacao.bioma'])) {
            $bioma = $this->Classificacao->Bioma->find('first', array(
                'conditions' => array(
                    'Bioma.nome' => $options['conditions']['Classificacao.bioma'],
                ),
                'recursive'  => '-1',
            ));
            if ($bioma) {
                $options['conditions']['Classificacao.bioma_id'] = $bioma['Bioma']['id'];
            }
            unset($options['conditions']['Classificacao.bioma']);
        }

        // joins de dados associados
        $options['joins'] = array(
            array('table' => 'cartas',
                'alias'       => 'Carta_',
                'type'        => 'LEFT',
                'conditions'  => array(
                    'Classificacao.carta_id = Carta_.id',
                ),
            ),
            array('table' => 'biomas',
                'alias'       => 'Bioma_',
                'type'        => 'LEFT',
                'conditions'  => array(
                    'Classificacao.bioma_id = Bioma_.id',
                ),
            ),
            array('table' => 'classificacao_tarefas',
                'alias'       => 'ClassificacaoTarefa',
                'type'        => 'LEFT',
                'conditions'  => array(
                    'Classificacao.id = ClassificacaoTarefa.classificacao_id',
                )
            ),
        );

        $options['group'] = array(
            'Classificacao.id',
            'Carta.id',
            'Bioma.id',
            'Colecao.id',
            'CartaRegiao.id',
            'DecisionTree.id',
            'CartaRegiaoInfo.id'
        );    

        // se o usuarioAuth não for admin ou visitante, lista somente 
        // parametros do bioma associado ao usuario
        if ($usuarioAuth['Usuario']['perfil_id'] != '1' && $usuarioAuth['Usuario']['perfil_id'] != '10') {              
            $options['conditions']['Classificacao.bioma_id'] = $usuarioAuth['UsuarioBioma']['bioma_id'];
        }


        // recupera dados
        $data = $this->Classificacao->find('all', $options);

        $data = $this->getAssociateData($data);

        if ($paginate) {
            $countPagesOpt = $options;
            unset($countPagesOpt['limit']);
            unset($countPagesOpt['page']);
            $total = $this->Classificacao->find('count', $countPagesOpt);
            $data  = array(
                'data'       => $data,
                'page'       => $paginate['page'],
                'totalPages' => ceil($total / $options['limit']),
                'total'      => $total,
            );
        }

        return $data;
    }

    public function save($data) {

        $usuarioAuth = $this->Classificacao->authUser;

        $usuarioBioma = $usuarioAuth['UsuarioBioma']['Bioma']['nome'];

        // se o nome da carta for informado, recupera o id da carta
        $carta = null;
        if (isset($data['Classificacao']['carta'])) {
            $carta = $this->Classificacao->Carta->find('first', array(
                'conditions' => array(
                    'Carta.codigo' => $data['Classificacao']['carta'],
                ),
                'recursive'  => '-1',
            ));

            if (empty($carta)) {
                $carta = array('Carta' => array(
                    'codigo' => $data['Classificacao']['carta'],
                ),
                );
                $this->Classificacao->Carta->save($carta);
                $carta['Carta']['id'] = $this->Classificacao->Carta->id;
            }

            $data['Classificacao']['carta_id'] = $carta['Carta']['id'];
        }

        // se o nome do bioma for informado, recupera o id do bioma
        $bioma = null;
        if (isset($data['Classificacao']['bioma'])) {
            $bioma = $this->Classificacao->Bioma->find('first', array(
                'conditions' => array(
                    'Bioma.nome' => $data['Classificacao']['bioma'],
                ),
                'recursive'  => '-1',
            ));
            $data['Classificacao']['bioma_id'] = $bioma['Bioma']['id'];            
        } else {
            $bioma = $this->Classificacao->Bioma->read('nome', $data['Classificacao']['bioma_id']);
        }

        // verifica o bioma do usuario e perfil
        if ($usuarioAuth['Usuario']['perfil_id'] == '10') {
            throw new Exception("Usuário não tem permissão para salvar");
        }

        if ($usuarioBioma != $bioma['Bioma']['nome']) {
            throw new Exception("Usuário não tem permissão para salvar neste bioma");
        }
        
        // salva classificação                
        unset($data['Classificacao']['modified']);
        $dataSaved = $this->Classificacao->save($data);

        // registra usuario e a versão da classificação salva
        $classificacaoUsuario = array(
            'ClassificacaoUsuario' => array(
                'usuario_id'       => $usuarioAuth['Usuario']['id'],
                'classificacao_id' => $this->Classificacao->id,
                'versao'           => json_encode($data),
            ),
        );

        $this->Classificacao->ClassificacaoUsuario->save($classificacaoUsuario);

        /*
         * Retorna a dado salvo
         */
        $classificacao = $this->get($this->Classificacao->id);

        return $classificacao;
    }

    public function getBiomaCartaRegioes($biomaNome, $cartaCodigo) {
        
        $carta = $this->Classificacao->Carta->findByCodigo($cartaCodigo);

        $bioma = $this->Classificacao->Bioma->findByNome($biomaNome);

        $cartaRegiao = new CartaRegiao();

        if(empty($carta) || empty($bioma)){
            return [];
        }

        $regioes = $cartaRegiao->find('all', array(
            'conditions' => array(
                'CartaRegiao.carta_id' => $carta['Carta']['id'],
                'CartaRegiao.bioma_id' => $bioma['Bioma']['id'],
            ),
        ));

        return $regioes;
    }

    public function getColecoes() {
        
        $colecoes = $this->Classificacao->Colecao->find('all');       

        return $colecoes;
    }
    
    public function getBiomas() {
        
        $colecoes = $this->Classificacao->Bioma->find('all',array(
            'fields' => array(
                'Bioma.id',
                'Bioma.nome',
                'Bioma.colecao',
            ),
            'recursive' => '-1'
        ));       

        return $colecoes;
    }

    public function queryGroupCartas($options = null) {        

        // joins de dados associados
        $options['joins'] = array(
            array('table' => 'cartas',
                'alias'       => 'Carta',
                'type'        => 'LEFT',
                'conditions'  => array(
                    'Classificacao.carta_id = Carta.id',
                ),
            ),
            array('table' => 'biomas',
                'alias'       => 'Bioma',
                'type'        => 'LEFT',
                'conditions'  => array(
                    'Classificacao.bioma_id = Bioma.id',
                ),
            ),
            array('table' => 'classificacao_tarefas',
                'alias'       => 'ClassificacaoTarefa',
                'type'        => 'LEFT',
                'conditions'  => array(
                    'Classificacao.id = ClassificacaoTarefa.classificacao_id',
                )
            ),
        );

        $options['fields'] = array(
            'Classificacao.carta_codigo',            
            'Classificacao.biomas',            
            'Classificacao.bioma_colecoes',            
            'Classificacao.years',            
            'Classificacao.versoes',                                  
            'Classificacao.count',            
            'Classificacao.tarefas',
            //'Classificacao.tarefaspai'
        );

        $options['group'] = array(
            'Carta.codigo',
        );

        $options['order'] = array(
            'Carta.codigo ASC',
        );

        unset($options['contain']);
        $options['recursive'] = '-1';        

        // recupera dados
        $this->Classificacao->virtualFields = array(
            'carta_codigo' => "Carta.codigo",
            'biomas' => "STRING_AGG(DISTINCT Bioma.nome,', ')",
            'bioma_colecoes' => "STRING_AGG(DISTINCT Bioma.colecao,', ')",
            'years' => "STRING_AGG(DISTINCT Classificacao.year,', ')",
            'versoes' => "STRING_AGG(DISTINCT Classificacao.versao,', ')",            
            'count' => "COUNT(Classificacao.id)",
            'tarefas' => "STRING_AGG(CAST(ClassificacaoTarefa.id AS text) ||'-'|| CAST(ClassificacaoTarefa.fase AS text)||'-'|| CAST(ClassificacaoTarefa.status AS text),', ')"            
        );

         // nao exibe status 5 cancelado
        if(!isset($options['conditions']['ClassificacaoTarefa.status'])){
            //$options['conditions']['ClassificacaoTarefa.status <>'] = '5' ;
        }       

        $data = $this->Classificacao->find('all', $options);

        return $data;
    }

    public function exportCSV($options)
    {
         
        //ini_set('memory_limit', '1G');
        //ini_set('max_execution_time', 3000);
        //$options['limit'] = 10000;

        $options['contain'] = $this->Classificacao->contains['default'];

        $options['conditions'] = isset($options['conditions']) ? $options['conditions'] : array();

        // joins de dados associados
        $options['joins'] = array(
            array('table' => 'cartas',
                'alias'       => 'Carta_',
                'type'        => 'LEFT',
                'conditions'  => array(
                    'Classificacao.carta_id = Carta_.id',
                ),
            ),
            array('table' => 'biomas',
                'alias'       => 'Bioma_',
                'type'        => 'LEFT',
                'conditions'  => array(
                    'Classificacao.bioma_id = Bioma_.id',
                ),
            ),
            array('table' => 'classificacao_tarefas',
                'alias'       => 'ClassificacaoTarefa',
                'type'        => 'LEFT',
                'conditions'  => array(
                    'Classificacao.id = ClassificacaoTarefa.classificacao_id',
                )
            ),
        );

        $options['group'] = array(
            'Classificacao.id',
            'Carta.id',
            'Bioma.id',
            'Colecao.id',
            'CartaRegiao.id',
            'DecisionTree.id',
            'CartaRegiaoInfo.id'
        );

        $data = $this->Classificacao->find('all', $options);

        $exportDataCSV = "";

        if ($data) {            
             // colunas do csv   

             $exportDataCSV .= "ID;CHART;BIOMA;YEAR;T0;T1;CLOUD_COVER;DTV;DTID;SENSOR;TAG_ON;NDFI;SMA;REF;DT;SAVE;COLOR;ELEVATION_ON;ELEVATION_MIN;ELEVATION_MAX;REGION;VERSION;VERSION_FINAL;LABEL;COLLECTION \n";

             foreach ($data as $key => $classificacao) {

                $classificacao['Classificacao']['dtv'] = json_encode($classificacao['Classificacao']['dtv']);

                $patterns = [];
                $replacements = []; 

                $patterns[0] = '/[\"\{\}]/';
                $replacements[0] = '';
                $patterns[1] = '/\,/';
                $replacements[1] = ' / ';
                $classificacao['Classificacao']['dtv'] = preg_replace($patterns, $replacements, $classificacao['Classificacao']['dtv']);
                
                 $linha = "";
                 $linha .= $classificacao['Classificacao']['id'].";";
                 $linha .= $classificacao['Carta']['codigo'].";";
                 $linha .= $classificacao['Bioma']['nome'].";";
                 $linha .= $classificacao['Classificacao']['year'].";";                 
                 $linha .= $classificacao['Classificacao']['t0'].";";                 
                 $linha .= $classificacao['Classificacao']['t1'].";";                 
                 $linha .= $classificacao['Classificacao']['cloudcover'].";";                 
                 $linha .= $classificacao['Classificacao']['dtv'].";";                                  
                 $linha .= $classificacao['Classificacao']['decision_tree_id'].";";                                  
                 $linha .= $classificacao['Classificacao']['sensor'].";";                 
                 $linha .= $classificacao['Classificacao']['tag_on'].";";                 
                 $linha .= $classificacao['Classificacao']['ndfi'].";";                 
                 $linha .= $classificacao['Classificacao']['sma'].";";                 
                 $linha .= $classificacao['Classificacao']['ref'].";";                 
                 $linha .= $classificacao['Classificacao']['dt'].";";                 
                 $linha .= $classificacao['Classificacao']['save'].";";                 
                 $linha .= $classificacao['Classificacao']['color'].";";                 
                 $linha .= $classificacao['Classificacao']['elevation_on'].";";                 
                 $linha .= $classificacao['Classificacao']['elevation_min'].";";                 
                 $linha .= $classificacao['Classificacao']['elevation_max'].";";                 
                 $linha .= ($classificacao['CartaRegiao']['regiao'] ? $classificacao['CartaRegiao']['regiao']:"") .";";                 
                 $linha .= $classificacao['Classificacao']['versao'].";";                 
                 $linha .= ($classificacao['Classificacao']['versao_final'] ? "1":"0") .";";
                 $linha .= $classificacao['Classificacao']['identificador'].";";                 
                 $linha .= $classificacao['Colecao']['colecao'];

                 $exportDataCSV .= $linha."\n";
             }            
        }
       
        return $exportDataCSV;
    }
    

    /*
     * FIM API
     */

    private function getAssociateData($data) {
        foreach ($data as $key => &$value) {
            // carta           
            $value['Classificacao']['carta'] = $value['Carta']['codigo'];

            // bioma
            if(isset($value['Bioma'])){
                $value['Classificacao']['bioma'] = $value['Bioma']['nome'];                
            }

            // carta regiao           
            if (isset($value['CartaRegiao']) && $value['CartaRegiao']['id']) {
                $value['Classificacao']['regiao'] = $value['CartaRegiao']['regiao'];
            } else {
                $value['Classificacao']['regiao'] = "";
            }

            if (isset($value['Classificacao']['regiao_info_id'])) {
                if(isset($value['CartaRegiaoInfo']) && !empty($value['CartaRegiaoInfo'])) {
                    $value['Classificacao']['regiao_info'] = $value['CartaRegiaoInfo'];
                }
            }
        }
        return $data;
    }
      
}
