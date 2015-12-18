<?php

App::uses('UsuarioService', 'Lib/Mapbiomas/Service/Usuario');

class UsuariosController extends MapbiomasAppController {
    
    
    public $UsuarioService;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->UsuarioService = new UsuarioService();
    } 
 
    /*
     * Service API 
     */
    public function service_get($id = null) {
        try {
            $responseData = null;
            if ($id) {
                $responseData = $this->UsuarioService->get($id);
            } else {
                $responseData = $this->UsuarioService->query($this->serviceOptions, $this->servicePaginate);
            }
            echo json_encode($responseData);
        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }

    public function service_post() {
        try {
            $postData = json_decode($this->request->input(), true);

            $responseData = $this->UsuarioService->cadastrar($postData);

            echo json_encode($responseData);
        } catch (Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }   

}
