<?php
App::uses('AppController', 'Controller');

class DocsController extends AppController {

    public $uses = array();

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow(array('api','example'));        
    }

    public function api($mdfile = null) {
        if (!$mdfile) {
            $this->layout = "docs";            
        } else {
            $this->layout = "ajax";
            $this->render($mdfile);
        }
    }

    public function example($example){
        $this->layout = "ajax";
        $this->render($example);
    }

}
