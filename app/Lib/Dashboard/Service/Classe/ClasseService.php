<?php
App::uses('Classe', 'Model');

class ClasseService {

    public $Classe;

    public function __construct() {
        $this->Classe = new Classe();
    }

    /*
     * API
    */
    public function findAll($query) {
      $result = [];

      $limit = 50;
      if(isset($query['limit']) && $query['limit'] < 50){
         $limit = $query['limit'];
      }

      $page = 1;
      if(isset($query['page'])){
         $page = $query['page'];
      }

      $array = array('page' => $page,  'limit' => $limit);

      foreach ($this->Classe->find("all", $array) as $key => $classe) {
                  $r = array(
                      "id" => $classe['Classe']['id'],
                      "name" => $classe['Classe']['classe'],
                      "color" => $classe['Classe']['cor']
                  );
                  $result[] = $r;
          }

      return $result;

    }

}
