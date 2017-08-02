<?php
App::uses('AppController', 'Controller');

App::uses('UsuarioService', 'Lib/Mapbiomas/Service/Usuario');

App::uses('Bioma', 'Model');

class UsuariosController extends AppController {
    
    public $uses = array(
        'Usuario'
    );
    
    public $UsuarioService;
    
    public $Bioma;
    
    public function beforeFilter() {
        parent::beforeFilter();
        
        $this->Auth->allow(array(
            'login',
            'guest_login',
            'cadastro',
            'service_googleauth',
            'service_googlecadastro',
            'service_googlelogin',
            'unauthorizedRedirect'
        ));
        
        $this->UsuarioService = new UsuarioService();
        
        $this->Bioma = new Bioma();
    }
    
    public function login() {
        $this->layout = "login";
        if ($this->request->is('post')) {            
            //Capturando o IP da maquna do usuário
            $clienteIp = $this->request->clientIp();
            if ($this->Auth->login()) {
                if (strstr($redirect, "services/")) {
                    $redirect = "/";
                }
                return $this->redirect("/");
            } 
            else {
                $this->Session->setFlash(__('Dados incorretos. Tente novamente.') , 'flash_erro', array() , 'auth');
            }
        } 
        else {
            if ($this->Auth->user()) {
                $this->redirect('/');
            }
        }

        $biomas = $this->Bioma->find('list',array(
            'fields' => ['Bioma.nome','Bioma.nome']
        ));

        $this->set('biomas',$biomas);
        
        /*
         * status code "não autorizado"
        */
        $this->response->statusCode(401);
    }
    
    public function guest_login() {
        $this->layout = "login";
        $this->request->data = array(
            'Usuario' => array(
                'password' => '123123',
                'email' => 'guest@mapbiomas.org'
            )
        );

        $guest = $this->Usuario->findByEmail('guest@mapbiomas.org');

        if ($this->Auth->login($guest)) {            
            //$this->Session->write('App', $this->request->data['Usuario']['app']);
            if (strstr($redirect, "services/")) {
                $redirect = "/";
            }
            return $this->redirect("/");
        }
    }
    
    public function service_googleauth() {
        try {
            $postData = $this->request->data;
            
            $responseData = $this->UsuarioService->googleAuth($postData);
            
            echo json_encode($responseData);
        }
        catch(Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }
    
    public function service_googlecadastro() {
        try {
            $postData = $this->request->data;
            
            $responseData = $this->UsuarioService->googleCadastro($postData);
            
            echo json_encode($responseData);
        }
        catch(Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }
    
    public function service_googlelogin() {
        try {
            $postData = $this->request->data;
            
            $responseData = $this->UsuarioService->googleLogin($postData);
            
            if ($responseData) {
                $this->Auth->login($responseData);
            }
            
            echo json_encode($responseData);
        }
        catch(Exception $exc) {
            $this->response->statusCode("403");
            echo $exc->getMessage();
        }
    }
    
    public function logout() {
        $this->Session->delete('App');
        $this->redirect($this->Auth->logout());
    }
    
    public function logout2() {
        $this->autoRender = false;
        $this->Auth->logout();
    }
    
    public function unauthorizedRedirect() {
        $this->autoRender = false;
        echo "nao autorizado";
    }
}
