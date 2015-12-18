<?php
App::uses('AppController', 'Controller');

class ExportAppController extends AppController {
    
    public $components = array(
       'Session',
       'Auth' => array(
           'authenticate' => array(
               'Basic' => array(
                   'userModel' => 'Usuario',
                   'fields' => array(
                       'username' => 'email',
                       'password' => 'password'
                   )
               )
           )
       ) 
    );
}
