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

    public $limitMax = 1000;

    public function beforeFilter() {
        parent::beforeFilter();

        $AppConfig = $this->getAppConfig();
        
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
            $this->response->header('Access-Control-Allow-Origin', '*');
        }
        else {
            $this->layout = "default";
            if(isset($AppConfig['layout'])){                
                $this->layout = $AppConfig['layout'];
            }
        }

        $this->serviceOptions = $this->getServiceOptions();

        $this->servicePaginate = $this->getServicePaginate();
        
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
        $this->set('appConfig', $AppConfig);

    }

    public function isAuthorized($user) {
        return true;
    }


    /**
     * Retorna array padrão de parâmetros de configurações utilizados nos serviços
     * @return array parametro de confifuração
     */
    public function getServiceOptions()
    {

        $options = null;

        if (isset($this->request->query['options'])) {
            if (is_string($this->request->query['options'])) {
                $options = json_decode($this->request->query['options'], true);
            } else {
                $options = $this->request->query['options'];
            }
        }

        $limit = $this->limitMax;

        if (isset($options['limit']) && $options['limit'] <= $this->limitMax) {
            $limit = $options['limit'] <= $this->limitMax ? $options['limit'] : $this->limitMax;
        }

        if (isset($this->request->query['limit'])) {
            $limit = $this->request->query['limit'] <= $this->limitMax ? $this->request->query['limit'] : $this->limitMax;
        }

        if (isset($this->request->query['page'])) {
            $options['page'] = $this->request->query['page'];
        }

        $options['limit'] = $limit;
        

        unset($options['recursive']);
        unset($options['group']);
        unset($options['offset']);
        unset($options['callbacks']);

        return $options;
    }

    /**
     * Retorna array padrão de parâmetros de paginação utilizados nos serviços
     * @return array parametro de paginação
     */
    public function getServicePaginate()
    {

        $paginate = null;

        if (isset($this->request->query['page'])) {
            $paginate['page']  = $this->request->query['page'];
            $paginate['limit'] = isset($this->request->query['limit']) && $this->request->query['limit'] <= $this->limitMax ? $this->request->query['limit'] : $this->limitMax;
        }

        return $paginate;
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
