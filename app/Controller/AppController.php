<?php
App::uses('Controller', 'Controller');
class AppController extends Controller {

    public $components = array(
        'Session',
        'Auth' => array(
            'authenticate' => array(
                'Form' => array(
                    'userModel' => 'Usuario',
                    'fields' => array(
                        'username' => 'email',
                        'password' => 'password'
                    )
                )
            ) ,
            'authError' => 'Acesso restrito. Informe seus dados de acesso.',
            'loginAction' => array(
                'controller' => 'usuarios',
                'action' => 'login'
            ) ,
            'loginRedirect' => '/',
            'logoutRedirect' => '/',
            'unauthorizedRedirect' => true,
            'authorize' => array(
                'Controller'
            )
        ) ,
        'Upload'
    );

    public $authUser;
    public $serviceOptions;
    public $servicePaginate;

    public function beforeFilter() {
        parent::beforeFilter();
        
        /* ----------------------------
         * Rest service configurações
         * ----------------------------
        */
        $this->servicePrefix = isset($this->request->params['prefix']) && $this->request->params['prefix'] == 'service' ? $this->request->params['prefix'] : null;

        /*
         * se for uma requisição rest service
         * inicia as variaveis de serviço
        */
        if ($this->servicePrefix) {
            // configurando response
            $this->autoRender = false;
            $this->response->type('json');
        }
        else {
            $this->layout = "default";
        }

        /*
         * opcoes usadas para
         * metodos de busca
        */
        if (isset($this->request->query['options'])) {
            if (is_string($this->request->query['options'])) {
                $this->serviceOptions = json_decode($this->request->query['options'], true);
            }
            else {
                $this->serviceOptions = $this->request->query['options'];
            }
        }

        /*
         * opcoes de paginaçao
         * para busca paginada
        */
        if (isset($this->request->query['page'])) {
            $this->servicePaginate['page'] = $this->request->query['page'];
            $this->serviceOptions['page'] = $this->request->query['page'];
            $this->servicePaginate['limit'] = isset($this->request->query['limit']) ? $this->request->query['limit'] : 10;
        }

        if (isset($this->request->query['limit'])) {
            $this->serviceOptions['limit'] = $this->request->query['limit'];
        }

        /* ------------------------------
         * Rescupera usuario autenticado
         * e seta para view
         * ------------------------------
        */
        $this->authUser = $this->Auth->user();
        $this->set('authUser', $this->authUser);

        /* -------------------------------------
         * Variaveis de configuração do sistema
         * -------------------------------------
        */
        $this->set('appConfig', $this->getAppConfig());

    }

    public function isAuthorized($user) {
        return true;
    }

    public function getAppConfig() {        
        $appConfig = Configure::read('CONFIG');
        Configure::write('debug', $appConfig['debug']);
        
        $appConfig['rootpath'] = ROOT;        
        $appConfig['host'] = $this->request->host();
        $appConfig['baseapp'] = $this->request->base;        

        // segurança
        unset($appConfig['DB']);
        unset($appConfig['debug']);

        return $appConfig;
    }
}
