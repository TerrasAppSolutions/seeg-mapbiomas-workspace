<?php

class AuthApp {

    public $usuario;
    public $plugin;
    public $perfis = array();

    public function __construct($usuario, $plugin) {
        $this->usuario = $usuario;
        $this->plugin = $plugin;
    }

    public function isAuthorized() {
        $plugin = $this->plugin;
        $usuario = $this->usuario;
        return true;
    }    

}
