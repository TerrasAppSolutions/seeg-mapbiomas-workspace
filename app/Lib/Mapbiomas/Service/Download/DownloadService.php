<?php

App::uses('File', 'Utility');

class DownloadService {

    private $colecaoBaseUrl = "http://storage.googleapis.com/mapbiomas-public/COLECAO";

    private $landsatBaseUrl = "http://storage.googleapis.com/mapbiomas-public/COLECAO/LANDSAT";

    private $biomas = ['AMAZONIA', 'MATAATLANTICA', 'PANTANAL', 'CERRADO', 'CAATINGA', 'PAMPA', 'ZONACOSTEIRA'];

    private $colecoes = ['CONSOLIDACAO', 'CLASSIFICACAO', 'CLASSIFICACAOFT', 'CLASSIFICACAOM'];

    private $msgs = [
        "Coleção em processamento, em breve estará disponível para download.",
        "Coleção não existe.",
        "Não existe coleção para o bioma informado.",
        "Carta não disponível para download.",
    ];

    /*
     * API
     */

    /**
     * Gera url de acesso aos arquivos das coleções do mapbiomas
     * @param  string $colecao colecao processada
     * @param  string $bioma bioma da coleção
     * @param  string $ano ano da colecao
     * @return array resposta com status dos parametros fornecidos e url do arquivo se o mesmo existir
     */
    public function colecao($colecao = 'CONSOLIDACAO', $bioma, $ano) {

        $redirectData = array(
            'status' => 'success',
            'url'    => null,
            'msg'    => null,
        );

        $fileUrl = $this->colecaoBaseUrl . '/' . $colecao . '/ZIP';
        $fileUrl .= '/' . $colecao . '_' . $bioma . '_' . $ano . '.zip';

        if ($this->remoteFileExists($fileUrl)) {

            $redirectData['url'] = $fileUrl;

        } elseif (in_array($colecao, $this->colecoes) && in_array($bioma, $this->biomas)) {
            $redirectData['status'] = 'error';
            $redirectData['msg']    = $this->msgs[0];

        } elseif (!in_array($colecao, $this->colecoes)) {
            $redirectData['status'] = 'error';
            $redirectData['msg']    = $this->msgs[1];

        } elseif (!in_array($bioma, $this->biomas)) {
            $redirectData['status'] = 'error';
            $redirectData['msg']    = $this->msgs[2];
        }

        return $redirectData;
    }

    /**
     * Gera url de acesso aos arquivos da coleção landsat
     * @param  string $carta codigo da carta
     * @param  string $ano   ano da carta
     * @return array resposta com status dos parametros fornecidos e url do arquivo se o mesmo existir
     */
    public function landsat($carta, $ano) {

        $redirectData = array(
            'status' => 'success',
            'url'    => null,
            'msg'    => null,
        );

        // soluçao temporaria - refatorar
        
        $file = new File('/data/arquivos/gcs-public-landsat.txt');
        $list = explode("/data",$file->read());
        $file->close();
        
        // exit;
        $listurl = "";
        
        foreach ($list as $key => $value) {
            if(strstr($value,$carta) != false && strstr($value,$ano) != false){
                $listurl = $value;
                break;
            }
        }       
        // pr($carta);
        // pr($ano);
        
        if(empty($listurl)){
            $redirectData['status'] = 'error';
            $redirectData['msg']    = $this->msgs[3];
            return $redirectData;
        }
        
        
        // $url = str_replace('/imagens/classificacao_v2/CLASSIFICACAO/BIOMA/',$this->landsatBaseUrl."/",$listurl);
        $url = str_replace('gs://mapbiomas-public/COLECAO/LANDSAT/',$this->landsatBaseUrl."/", $listurl);
        
        $fileUrl = trim(str_replace('.tif','.tif',$url));
        $urlArray = explode(".tif",$url);

        $foundUrls = $this->findByYearAndChart($urlArray, $carta, $ano);
        // pr($foundUrls);

        if (sizeof($foundUrls) > 0) {
            $redirectData['status'] = 'success';
            $redirectData['url'] = $foundUrls;
        } else {
            $redirectData['status'] = 'error';
            $redirectData['msg']    = $this->msgs[3];
        }
        
        // $redirectData['url'] = $fileUrl;        

        return $redirectData;
    }

    /**
     * Verifica se o arquivo existe
     * @param string $url url a ser verificada
     * @return boolean true se o arquivo existir
     */
    private function remoteFileExists($url) {
        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_NOBODY, true);
        $result = curl_exec($curl);
        $ret = false; 
        if ($result !== false) {
            $statusCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            if ($statusCode == 200) {
                $ret = true;
            }
        }
        curl_close($curl);
        return $ret;
    }

    /**
     * Pesquisa dentro da lista de imagens, aquelas que possuem carta e ano correspondente
     * @param Type function findByYearAndChart
     */
    private function findByYearAndChart($array, $chart, $year) {
        $result = [];
        foreach ($array as $key => $value) {
            if(strpos($value, $chart) && strpos($value, $year)) {
                array_push($result, $value.'.tif');
            }
        }
        return $result;
    }

}
