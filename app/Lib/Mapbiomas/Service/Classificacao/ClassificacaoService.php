<?php
App::uses('Classificacao', 'Model');

class ClassificacaoService {
    
    public $Classificacao;
    
    public function __construct() {
        $this->Classificacao = new Classificacao();
    }
    
    /*
     * API
    */
    
    public function get($id) {
        $classificacao = $this->Classificacao->find('first', array(
            'conditions' => array(
                'Classificacao.id' => $id
            ) ,
            'contain' => $this->Classificacao->contains['default']
        ));
        
        if ($classificacao) {
            $classificacao = $this->getAssociateData([$classificacao]) [0];
        }
        
        return $classificacao;
    }
    
    public function query($options = null, $paginate = null) {
        
        $options['contain'] = $this->Classificacao->contains['default'];
        
        $optionsConditions = isset($options['conditions']) ? $options['conditions'] : array();
        
        // se informado o codigo da carta, pesquisa o id da carta.
        if (isset($optionsConditions['Classificacao.carta'])) {
            $carta = $this->Classificacao->Carta->find('first', array(
                'conditions' => array(
                    'Carta.codigo' => $options['conditions']['Classificacao.carta']
                ) ,
                'recursive' => '-1'
            ));
            if ($carta) {
                $options['conditions']['Classificacao.carta_id'] = $carta['Carta']['id'];
            }
            unset($options['conditions']['Classificacao.carta']);
        }
        
        // se informado o nome do bioma, pesquisa o id do bioma.
        if (isset($optionsConditions['Classificacao.bioma'])) {
            $bioma = $this->Classificacao->Bioma->find('first', array(
                'conditions' => array(
                    'Bioma.nome' => $options['conditions']['Classificacao.bioma']
                ) ,
                'recursive' => '-1'
            ));
            if ($bioma) {
                $options['conditions']['Classificacao.bioma_id'] = $bioma['Bioma']['id'];
            }
            unset($options['conditions']['Classificacao.bioma']);
        }
        
        $data = $this->Classificacao->find('all', $options);
        
        $data = $this->getAssociateData($data);
        
        if ($paginate) {
            $countPagesOpt = $options;
            unset($countPagesOpt['limit']);
            unset($countPagesOpt['page']);
            $data = array(
                'data' => $data,
                'page' => $this->servicePaginate['page'],
                'totalPages' => ceil($this->Classificacao->find('count', $countPagesOpt) / $this->serviceOptions['limit']) ,
            );
        }
        
        return $data;
    }
    
    public function cadastrar($data) {

        $usuarioAuth = $this->Classificacao->authUser;

        $usuarioBioma = $usuarioAuth['UsuarioBioma']['Bioma']['nome'];        
        
        // se o nome da carta for informado, recupera o id da carta
        $carta = null;
        if (isset($data['Classificacao']['carta'])) {            
            $carta = $this->Classificacao->Carta->find('first', array(
                'conditions' => array(
                    'Carta.codigo' => $data['Classificacao']['carta']
                ) ,
                'recursive' => '-1'
            ));
            $data['Classificacao']['carta_id'] = $carta['Carta']['id'];
        }

        // se o nome do bioma for informado, recupera o id do bioma
        $bioma = null;
        if (isset($data['Classificacao']['bioma'])) {            
            $bioma = $this->Classificacao->Bioma->find('first', array(
                'conditions' => array(
                    'Bioma.nome' => $data['Classificacao']['bioma']
                ) ,
                'recursive' => '-1'
            ));
            $data['Classificacao']['bioma_id'] = $bioma['Bioma']['id'];
        }else{
           $bioma = $this->Classificacao->Bioma->read('nome',$data['Classificacao']['bioma_id']);
        }

        // verifica o bioma do usuario
        if($usuarioAuth['Usuario']['perfil_id'] != '1' && $usuarioBioma != $bioma['Bioma']['nome']){
            throw new Exception("Usuário não tem permissão para salvar neste bioma");            
        }

        // salva classificação        
        $dataSaved = $this->Classificacao->save($data);
        
        // registra usuario e a versão da classificação salva
        $classificacaoUsuario = array(
            'ClassificacaoUsuario' => array(
                'usuario_id' => $usuarioAuth['Usuario']['id'],
                'classificacao_id' => $this->Classificacao->id,
                'versao' => json_encode($data)
            )
        );
        
        $this->Classificacao->ClassificacaoUsuario->save($classificacaoUsuario);
        
        /*
         * Retorna a dado salvo
        */
        $classificacao = $this->get($this->Classificacao->id);
        
        return $classificacao;
    }
    
    /*
     * FIM API
    */
    
    private function getAssociateData($data) {
        foreach ($data as $key => & $value) {
            
            // carta
            $carta = $this->Classificacao->Carta->find('first', array(
                'conditions' => array(
                    'Carta.id' => $value['Classificacao']['carta_id']
                ) ,
                'recursive' => '-1'
            ));
            $value['Classificacao']['carta'] = $carta['Carta']['codigo'];
            
            // bioma
            $bioma = $this->Classificacao->Bioma->find('first', array(
                'conditions' => array(
                    'Bioma.id' => $value['Classificacao']['bioma_id']
                ) ,
                'recursive' => '-1'
            ));
            $value['Classificacao']['bioma'] = $bioma['Bioma']['nome'];
        }
        return $data;
    }
}
