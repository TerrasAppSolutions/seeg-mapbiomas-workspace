<?php

App::uses('DownloadService', 'Lib/Mapbiomas/Service/Download');

class DownloadsController extends DashboardAppController {

    public $DownloadService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('landsat', 'collection');
        $this->DownloadService = new DownloadService();
    }

    /*
     * Service API
     */
    public function landsat($carta = null, $ano = null) {
        $this->autoRender = false;
        try {

            $redirectData = $this->DownloadService->landsat($carta, $ano);

            if ($redirectData['status'] == 'success') {
                $this->redirect($redirectData['url']);
            } else {
                $this->layout = 'html';
                $this->set("msg", $redirectData['msg']);
                $this->set("title", "Arquivo não encontrado");
                $this->render("download_error");                
            }
        } catch (Exception $exc) {
            $this->response->statusCode("403");
            
        }
    }

    public function collection($colecao = null, $bioma = null, $ano = null) {
        $this->autoRender = false;
        try {

            $redirectData = $this->DownloadService->colecao($colecao, $bioma, $ano);

            if ($redirectData['status'] == 'success') {
                $this->redirect($redirectData['url']);
            } else {
                $this->layout = 'html';
                $this->set("msg", $redirectData['msg']);
                $this->set("title", "Arquivo não encontrado");
                $this->render("download_error");                
            }
        } catch (Exception $exc) {
            $this->response->statusCode("403");
            
        }
    }
}