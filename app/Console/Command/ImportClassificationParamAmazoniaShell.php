<?php
App::uses('Folder', 'Utility');
App::uses('File', 'Utility');
App::uses('Classificacao', 'Model');
App::uses('Carta', 'Model');
App::uses('Bioma', 'Model');
App::uses('CartaRegiao', 'Model');

class ImportClassificationParamAmazoniaShell extends AppShell
{

    /**
     * Model de Classificação
     * @var Cake.Model
     */
    private $Classificacao;

    /**
     * Model de Carta
     * @var Cake.Model
     */
    private $Carta;

    /**
     * Model de Bioma
     * @var Cake.Model
     */
    private $Bioma;

    /**
     * Model de CartaRegiao
     * @var Cake.Model
     */
    private $CartaRegiao;

    /**
     * Lista de erros
     * @var Array
     */
    private $erros;

    /**
     * Função principal do módulo, instancimento de modelos e
     * configurações de cache
     */
    public function main()
    {

        $this->Classificacao = new Classificacao();
        $this->Carta         = new Carta();
        $this->Bioma         = new Bioma();
        $this->CartaRegiao   = new CartaRegiao();

        $this->erros = array();

        //proc_nice(20);
        ini_set('memory_limit', '1G');

        // configurações de cache necessarios para evitar conflitos
        // com o sistema web
        Cache::config('_cake_model_', array(
            'engine'    => 'File',
            'prefix'    => 'shell' . 'cake_model_',
            'path'      => CACHE . 'models' . DS,
            'serialize' => true,
            'duration'  => '+999 days',
        ));

        // verifica se os argumentos são validos
        $this->validationArgs($this->args);

        $this->importacaoLog('Importação de arquivo json', 'titulo', 2);
        $this->importacaoLog('Verificando arquivos de importação...', 'info', 0);

        $this->importJsonFile(new File($this->args[0]));
    }

    /**
     * Valida argumentos da execução do modulo via console
     * @param  Array $args argumentos da execução do modulo via console
     */
    private function validationArgs($args)
    {
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

    /**
     * Importa arquivo json com os parametros
     * @param  Cake.Utility.File $jsonFile  arquivo json com os parâmetros
     */
    private function importJsonFile($jsonFile)
    {

        $json      = utf8_decode($jsonFile->read());
        $jsonDados = json_decode($json, true);

        // Exibe numero total de itens a ser importado
        $totalImportItens = count($jsonDados);
        $this->importacaoLog("$totalImportItens registros.", "info");

        // percorre parametros do json

        foreach ($jsonDados as $key => $paramJson) {

            // fabrica data model de classificação do parametro json
            $classificacao = $this->factoryClassificationDataModel($paramJson);

            // recupera id da carta
            $classificacao['Classificacao']['carta_id'] = $this->
                getCartaId($classificacao['Classificacao']['grid_name']);

            // recupera id do carta bioma
            $classificacao['Classificacao']['bioma_id'] = $this->
                getBiomaId($classificacao['Classificacao']['bioma']);

            // recupera id do carta regiao
            $classificacao['Classificacao']['regiao_id'] = $this->
                getRegiaoId(
                $classificacao['Classificacao']['bioma_id'],
                $classificacao['Classificacao']['carta_id'],
                $classificacao['Classificacao']['region']
            );

            // inicia a transação
            $dataSource = $this->Classificacao->getDataSource();
            $dataSource->begin();            

            try {

                // salva dados da classificação
                $this->Classificacao->create();
                $this->Classificacao->save($classificacao);
                $dataSource->commit();

                // mensagem de console para exibição de progresso da importação
                // calculo de porcentagem de progresso (rafatorar: criar função)
                $nImportados = $key + 1;
                $perc        = intval(($nImportados / $totalImportItens) * 100);
                $saida       = "<warning>[ $nImportados/$totalImportItens >> " . $perc . "% ]\t</warning>" . '<comment>' . 'registros importados.' . '</comment>';
                $this->importacaoLog($saida, null, 1);

            } catch (Exception $exc) {
                // exibe mensagem de erro de salvamento
                $saidaExc = "\t<error>" . "Erro ao importar </error>";
                $this->importacaoLog($saidaExc, null, 1);
                $dataSource->rollback();

                print($exc->getMessage());

                $paramJson['erro'] = $exc->getMessage();
                $this->erros[]     = $paramJson;
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

    /**
     * Fabrica um data model de Classificacao de um array de parametros originados do json
     * @param  array $paramJson array de parametros originados do json
     * @return array            data model de Classificacao
     */
    private function factoryClassificationDataModel($paramJson)
    {

        $ndado = array(
            'Classificacao' => array(),
        );

        $ndado['Classificacao']['grid_name'] = $paramJson['GRID_NAME'];
        $ndado['Classificacao']['bioma']     = $paramJson['BIOMA'];
        $ndado['Classificacao']['year']      = $paramJson['YEAR'];

        $t0 = explode("/", $paramJson['T0']);

        $ndado['Classificacao']['t0'] = $t0[1] . "/" . $t0[0] . "/2016"; // "01/30/2000"

        $t1 = explode("/", $paramJson['T1']);

        $ndado['Classificacao']['t1'] = $t1[1] . "/" . $t1[0] . "/2016"; //"01/30/2000"

        $ndado['Classificacao']['cloudcover'] = $paramJson['CLOUD_COVER'];

        $ndado['Classificacao']['dtv'] = $this->
            dtvParamParseToJsonArray($paramJson['DTV']);
            
        $ndado['Classificacao']['decision_tree_id'] = $paramJson['DTID'];

        $ndado['Classificacao']['sensor']        = $paramJson['SENSOR'];
        $ndado['Classificacao']['tag_on']        = $paramJson['TAG_ON'];
        $ndado['Classificacao']['ndfi']          = $paramJson['NDFI'];
        $ndado['Classificacao']['sma']           = $paramJson['SMA'];
        $ndado['Classificacao']['ref']           = $paramJson['REF'];
        $ndado['Classificacao']['dt']            = $paramJson['DT'];
        $ndado['Classificacao']['save']          = $paramJson['SAVE'];
        $ndado['Classificacao']['color']         = $paramJson['COLOR'];
        $ndado['Classificacao']['elevation_on']  = $paramJson['ELEVATION_ON'];
        $ndado['Classificacao']['elevation_min'] = $paramJson['ELEVATION_MIN'];
        $ndado['Classificacao']['elevation_max'] = $paramJson['ELEVATION_MAX'];
        $ndado['Classificacao']['versao']        = $paramJson['VERSION'];
        $ndado['Classificacao']['versao_final']  = true;
        $ndado['Classificacao']['identificador'] = $paramJson['LABEL'] . ' csvimport2';
        $ndado['Classificacao']['colecao_id']    = '3';
        $ndado['Classificacao']['elevation_max'] = $paramJson['ELEVATION_MAX'];
        $ndado['Classificacao']['region']        = isset($paramJson['REGION']) ? $paramJson['REGION'] : "";

        return $ndado;
    }

    /**
     * Converte parâmetros de valores de árvore de decisão para array correspondente ao json de valores
     * @param  string $dtvparam parâmetros de árvore de decisão
     * @return array correspondente ao json de valores de árvore de decisão
     */
    private function dtvParamParseToJsonArray($dtvparam)
    {
        $dtv    = [];
        $parse1 = explode('/', $dtvparam);
        foreach ($parse1 as $key => $dtvalue) {
            $parse2          = explode(':', $dtvalue);
            $dtv[$parse2[0]] = $parse2[1];
        }
        return $dtv;
    }

    private function getCartaId($cartacod)
    {
        $carta = $this->Carta->find('first', array(
            'conditions' => array(
                'Carta.codigo' => $cartacod,
            ),
            'recursive'  => '-1',
        ));

        if (empty($carta)) {
            $carta = array(
                'Carta' => array(
                    'codigo' => $cartacod,
                ),
            );
            $this->Carta->create();
            $this->Carta->save($carta);
            $carta['Carta']['id'] = $this->Carta->id;
        }

        return $carta['Carta']['id'];
    }

    private function getBiomaId($biomaNome)
    {
        $bioma = $this->Bioma->find('first', array(
            'conditions' => array(
                'Bioma.nome' => $biomaNome,
            ),
            'recursive'  => '-1',
        ));

        if (empty($bioma)) {
            $bioma = array(
                'Bioma' => array(
                    'nome' => $biomaNome,
                ),
            );
            $this->Bioma->create();
            $this->Bioma->save($bioma);
            $bioma['Bioma']['id'] = $this->Bioma->id;
        }

        return $bioma['Bioma']['id'];
    }

    private function getRegiaoId($biomaId, $cartaId, $regiao)
    {

        $cartaRegiaoId = null;

        $cartaRegiao = $this->CartaRegiao->find('first', array(
            'conditions' => array(
                'CartaRegiao.bioma_id' => $biomaId,
                'CartaRegiao.carta_id' => $cartaId,
                'CartaRegiao.regiao' => $regiao,
            ),
            'recursive'  => '-1',
        ));

        if($cartaRegiao){
            $cartaRegiaoId = $cartaRegiao['CartaRegiao']['id'];
        }

        return $cartaRegiaoId;
    }

    private function importacaoLog($msg, $tipoLog, $lineEscape = 2)
    {
        $this->stdout->styles('titulo', array(
            'text' => 'green',
        ));
        $this->stdout->styles('car', array(
            'text' => 'white',
        ));

        $log = "";
        if ($tipoLog == "info") {
            $log = "<info>$msg</info>";
        } else if ($tipoLog == "warning") {
            $log = "<warning>$msg</warning>";
        } else if ($tipoLog == "info") {
            $log = "<error>$msg</error>";
        } else {
            $log = $msg;
        }
        $this->out($log, $lineEscape, Shell::NORMAL);
    }
}
