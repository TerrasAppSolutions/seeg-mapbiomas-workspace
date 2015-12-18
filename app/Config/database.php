<?php

class DATABASE_CONFIG {

    public $default;
    public $test;

    public function __construct() {
        $appConfig = Configure::read('CONFIG');        

        $this->default = array(
            'datasource' => 'Database/Postgres',
            'persistent' => false,
            'host' => $appConfig['DB']['host'],
            'login' => $appConfig['DB']['login'],
            'password' => $appConfig['DB']['password'],
            'database' => $appConfig['DB']['database'],
            'encoding' => 'utf8'
        );

        $this->test = array(
            'datasource' => 'Database/Mysql',
            'persistent' => false,
            'host' => 'localhost',
            'login' => 'user',
            'password' => 'password',
            'database' => 'test_database_name',
        );
    }

}
