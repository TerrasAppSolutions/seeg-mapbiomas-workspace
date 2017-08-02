<?php
App::uses('ClassificacaoTarefa', 'Model');

App::uses('EstatisticaExportacao', 'Model');

App::uses('TransicaoClasse', 'Model');

class ExportacaoTarefaService
{

    public $ClassificacaoTarefa;

    public function __construct()
    {
        $this->ClassificacaoTarefa = new ClassificacaoTarefa();
    }

    /*
     * API
     */

    public function get($id)
    {
        $classificacaoTarefa = $this->ClassificacaoTarefa->find('first', array(
            'conditions' => array(
                'ClassificacaoTarefa.id'    => $id,
                'ClassificacaoTarefa.ativo' => true,
            ),
            'contain'    => $this->ClassificacaoTarefa->contains['default'],
        ));        

        return $classificacaoTarefa;
    }

    public function query($options = null, $paginate = null)
    {

        $options['contain'] = $this->ClassificacaoTarefa->contains['default'];

        $optionsConditions = isset($options['conditions']) ? $options['conditions'] : array();

        if (isset($options['query']['fase'])) {
            $options['conditions']['ClassificacaoTarefa.fase'] = $options['query']['fase'];
        }

        if (isset($options['query']['status'])) {
            $options['conditions']['ClassificacaoTarefa.status'] = $options['query']['status'];
        }

        if (isset($options['query']['tarefa_id'])) {
            $options['conditions']['ClassificacaoTarefa.tarefa_id'] = $options['query']['tarefa_id'];
        }

        if (isset($options['query']['carta'])) {
            $options['conditions']['Carta.codigo'] = $options['query']['carta'];
        }

        if (isset($options['query']['bioma'])) {
            $options['conditions']['Bioma.nome'] = $options['query']['bioma'];
        }

        if (isset($options['query']['ano'])) {
            if (strstr($options['query']['ano'], '-')) {

                $years = explode('-', $options['query']['ano']);

                $options['conditions']['Classificacao_.year BETWEEN ? AND ?'] = $years;

            } else {
                $options['conditions']['Classificacao_.year'] = $options['query']['ano'];
            }
        }

        if (isset($options['query']['limit'])) {
            $options['limit'] = $options['query']['limit'];
        }

        if (!isset($options['order'])) {
            $options['order'] = array('ClassificacaoTarefa.created ASC');
        }

        $options['joins'] = array(
            array('table' => 'classificacoes',
                'alias'       => 'Classificacao_',
                'type'        => 'LEFT',
                'conditions'  => array(
                    'ClassificacaoTarefa.classificacao_id = Classificacao_.id',
                ),
            ),
            array('table' => 'cartas',
                'alias'       => 'Carta',
                'type'        => 'LEFT',
                'conditions'  => array(
                    'Classificacao_.carta_id = Carta.id',
                ),
            ),
            array('table' => 'biomas',
                'alias'       => 'Bioma',
                'type'        => 'LEFT',
                'conditions'  => array(
                    'Classificacao_.bioma_id = Bioma.id',
                ),
            ),
        );

        unset($options['query']);

        $options['conditions']['ClassificacaoTarefa.ativo'] = true;

        if(!isset($options['conditions']['ClassificacaoTarefa.status'])){
            $options['conditions']['ClassificacaoTarefa.status <>'] = '5' ;
        }

        $data = $this->ClassificacaoTarefa->find('all', $options);

        if ($paginate) {
            $countPagesOpt = $options;
            unset($countPagesOpt['limit']);
            unset($countPagesOpt['page']);
            $total = $this->ClassificacaoTarefa->find('count', $countPagesOpt);
            $data  = array(
                'data'       => $data,
                'page'       => $paginate['page'],
                'totalPages' => ceil($total / $options['limit']),
                'total'      => $total,
            );
        }

        return $data;
    }

    public function save($data)
    {

        // registra data processamento no earth engine
        if ($data['ClassificacaoTarefa']['fase'] == '1') {
            if ($data['ClassificacaoTarefa']['status'] == '1') {
                $data['ClassificacaoTarefa']['gee_start'] = date('Y-m-d H:i:s');
            }

            if ($data['ClassificacaoTarefa']['status'] == '2') {
                $data['ClassificacaoTarefa']['gee_end'] = date('Y-m-d H:i:s');
                // deletar campo para nao sobreescrever valor em banco,
                // pq ainda enviado como nulo pelo modulo de exportacao,
                // a data deve ser setada pelo modulo de exportação
                unset($data['ClassificacaoTarefa']['gee_start']);
            }
        }

        // registra data de finalização da tarefa
        if ($data['ClassificacaoTarefa']['status'] == '2') {
            $data['ClassificacaoTarefa']['completed'] = date('Y-m-d H:i:s');
        }

        // remove valores modified para ser gerado um novo valor
        unset($data['ClassificacaoTarefa']['modified']);

        // verifica se existe alguma tarefa de fase ainda nao atendida,
        // nao pode haver mais de uma tarefa em espera para um mesmo params
        if ($data['ClassificacaoTarefa']['fase'] == '1' &&
            $data['ClassificacaoTarefa']['status'] == '0'
        ) {
            $countFase1Status0 = $this->ClassificacaoTarefa->find('first', array(
                'conditions' => array(
                    'ClassificacaoTarefa.classificacao_id' => $data['ClassificacaoTarefa']['classificacao_id'],
                    'ClassificacaoTarefa.fase'             => '1',
                    'ClassificacaoTarefa.status'           => '0',
                ),
            ));
            if ($countFase1Status0) {
                return $countFase1Status0;
            }
        }

        // atualiza fase o
        if ($data['ClassificacaoTarefa']['fase'] == '1' &&
            $data['ClassificacaoTarefa']['status'] == '1' &&
            !empty($data['ClassificacaoTarefa']['tarefa_id'])
        ) {
            $this->ClassificacaoTarefa->create();
            $this->ClassificacaoTarefa->id = $data['ClassificacaoTarefa']['tarefa_id'];
            $this->ClassificacaoTarefa->saveField('status', '5');
        }

        // salva classificação tarefa
        $this->ClassificacaoTarefa->create();
        $dataSaved = $this->ClassificacaoTarefa->save($data);

        /*
         * Retorna a dado salvo
         */
        $classificacaoTarefa = $this->get($this->ClassificacaoTarefa->id);

        return $classificacaoTarefa;
    }

    public function queryGroupCartas($options = null)
    {

        // joins de dados associados
        $options['joins'] = array(
            array('table' => 'classificacoes',
                'alias'       => 'Classificacao',
                'type'        => 'LEFT',
                'conditions'  => array(
                    'ClassificacaoTarefa.classificacao_id = Classificacao.id',
                ),
            ), array('table' => 'cartas',
                'alias'          => 'Carta',
                'type'           => 'LEFT',
                'conditions'     => array(
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
        );

        $options['fields'] = array(
            'ClassificacaoTarefa.carta_codigo',
            'ClassificacaoTarefa.biomas',
            'ClassificacaoTarefa.years',
            'ClassificacaoTarefa.versoes',
            'ClassificacaoTarefa.ids',
            'ClassificacaoTarefa.count',
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
        $this->ClassificacaoTarefa->virtualFields = array(
            'carta_codigo' => "Carta.codigo",
            'biomas'       => "STRING_AGG(DISTINCT Bioma.nome,', ')",
            'years'        => "STRING_AGG(DISTINCT Classificacao.year,', ')",
            'versoes'      => "STRING_AGG(DISTINCT Classificacao.versao,', ')",
            'ids'          => "STRING_AGG(CAST(ClassificacaoTarefa.id AS text),', ')",
            'count'        => "COUNT(ClassificacaoTarefa.id)",
        );

        $data = $this->ClassificacaoTarefa->find('all', $options);

        return $data;
    }


    public function statsSave($data){
        
        $EstatisticaExportacao = new EstatisticaExportacao();
        
        $TransicaoClasse = new TransicaoClasse();

        $response = [];

        foreach ($data as $key => $d) {

            foreach ($d['areas'] as $key => $area) {

                $EstatisticaExportacao->create();            

                $tclasse = $TransicaoClasse->findByClasse($area['classe']);

                $id =  
                    $d['bioma'].'-'.
                    $d['carta'].'-'.
                    $d['periodo']['t0'].'-'.
                    $d['periodo']['t1'].'-'.
                    $area['territorio_id'].'-'.
                    $tclasse['TransicaoClasse']['classe_inicial'].'-'.
                    $tclasse['TransicaoClasse']['classe_final'].'-'.
                    $area['classe'];

                $exportacao = array(
                    'EstatisticaExportacao' => array(
                        //'id' => $id,
                        'carta' => $d['carta'],
                        'ano_inicial' => $d['periodo']['t0'],
                        'ano_final' => $d['periodo']['t1'],
                        'territorio' => $area['territorio_id'],
                        'classe_inicial' => $tclasse['TransicaoClasse']['classe_inicial'],
                        'classe_final' => $tclasse['TransicaoClasse']['classe_final'],
                        'classe' => $area['classe'],
                        'bioma' => $d['bioma'],
                        'area_km2' => $area['area_km2']
                    )
                );                

                $EstatisticaExportacao->save($exportacao);

                $response[] = $exportacao;        
            }    

        }        

        return $response;
    }

    public function isalive($data){

        $cacheId = 'isalive';
        
        $responseData = Cache::read($cacheId, 'exportIsAlive');

        if(empty($responseData)){
            $responseData = [];
        }

        $dataInput = [
            'exporting' => $data['cmd'],          
            'date' => date("Y-m-d H:i:s")
        ];      

        if(isset($data['args']['biomes'])){
            $dataInput['exporting'] .= ' : '. implode('-', $data['args']['biomes']);
        }       
        
        if(isset($data['args']['years'])){
            $dataInput['exporting'] .= ' : '. implode('-', $data['args']['years']);
        }       

        if(isset($data['msg'])){
            $dataInput['msg'] = $data['msg'];
        }  

        array_unshift($responseData, $dataInput);

        Cache::write($cacheId, array_slice($responseData,0,10000), 'exportIsAlive');

        return $responseData;
    }
    
    public function isaliveRead(){

        $cacheId = 'isalive';
        
        $data = Cache::read($cacheId, 'exportIsAlive');

        $responseData = [
            'list' => $data
        ];

        $dataGroup = [];

        foreach ($data as $key => $value) {
            
        }
        
        return $responseData;
    }
}
